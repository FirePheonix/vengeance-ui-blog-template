import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import matter from "gray-matter";
import type {
  FolderMapping,
  SyncConfig,
  SyncManifest,
  VengeanceFrontmatterSync,
} from "./types";
import { loadSyncConfig } from "./config";
import {
  findManifestEntryByBlogPath,
  loadSyncManifest,
  saveSyncManifest,
} from "./manifest";
import {
  blogDraftToFileContent,
  blogFileToObsidianDraft,
} from "./blog-to-obsidian";
import { hashContent } from "./hash";
import type { PushResult } from "./push-to-vengeance";
import {
  buildObsidianPathForBlog,
  resolveBlogTarget,
} from "./resolve-blog-target";

const BLOG_ROOT = path.join("content", "blog");

function mappingAllowsVengeancePush(mapping: FolderMapping) {
  return (
    mapping.direction === "bidirectional" ||
    mapping.direction === "vengeance-to-obsidian"
  );
}

function mappingForBlogCategory(config: SyncConfig, blogCategory: string) {
  return config.mappings.find(
    (mapping) =>
      mapping.blogCategory === blogCategory &&
      mappingAllowsVengeancePush(mapping),
  );
}

function collectBlogPosts(rootDir: string, blogCategory: string) {
  const folderAbs = path.join(rootDir, BLOG_ROOT, blogCategory);
  if (!fs.existsSync(folderAbs)) {
    return [] as string[];
  }

  return fs
    .readdirSync(folderAbs, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(folderAbs, entry.name))
    .sort();
}

function toBlogRelative(rootDir: string, absPath: string) {
  return path.relative(rootDir, absPath).replace(/\\/g, "/");
}

function readVengeanceMeta(source: string) {
  const parsed = matter(source);
  return parsed.data.vengeance as VengeanceFrontmatterSync | undefined;
}

function resolveObsidianPath(
  config: SyncConfig,
  blogSlug: string,
  fileName: string,
  existingObsidianPath?: string,
  metaObsidianPath?: string,
) {
  return (
    existingObsidianPath ??
    metaObsidianPath ??
    buildObsidianPathForBlog(config.obsidianBlogRoot, blogSlug)
  );
}

function syncOneBlogPost(
  rootDir: string,
  config: SyncConfig,
  manifest: SyncManifest,
  blogPath: string,
  blogSlug: string,
  result: PushResult,
  options: { force?: boolean; obsidianPathOverride?: string } = {},
) {
  const blogAbsPath = path.join(rootDir, blogPath);
  const source = fs.readFileSync(blogAbsPath, "utf8");
  const body = matter(source).content.trim();
  const contentHash = hashContent(body);
  const existing = findManifestEntryByBlogPath(manifest, blogPath);
  const meta = readVengeanceMeta(source);
  const syncId = existing?.id ?? meta?.syncId ?? randomUUID();
  const obsidianPath =
    options.obsidianPathOverride ??
    resolveObsidianPath(
      config,
      blogSlug,
      path.basename(blogAbsPath),
      existing?.obsidianPath,
      meta?.obsidianPath,
    );
  const obsidianAbs = path.join(config.vaultPath, obsidianPath);

  if (
    !options.force &&
    existing &&
    existing.contentHash === contentHash &&
    fs.existsSync(obsidianAbs)
  ) {
    result.skipped.push(
      `${blogSlug} (already in sync — edit the blog file, then pull again)`,
    );
    return;
  }

  const draft = blogFileToObsidianDraft(
    source,
    blogPath,
    blogSlug,
    obsidianPath,
    syncId,
  );

  fs.mkdirSync(path.dirname(obsidianAbs), { recursive: true });
  const isNew = !fs.existsSync(obsidianAbs);
  fs.writeFileSync(obsidianAbs, draft.markdown, "utf8");
  fs.writeFileSync(blogAbsPath, blogDraftToFileContent(draft, source), "utf8");

  const manifestEntry = {
    id: syncId,
    obsidianPath,
    blogPath,
    blogSlug,
    contentHash,
    lastSyncedAt: draft.syncMeta.lastSyncedAt,
    lastSource: "vengeance" as const,
  };

  if (existing) {
    manifest.entries = manifest.entries.map((item) =>
      item.id === existing.id ? manifestEntry : item,
    );
    result[isNew ? "created" : "updated"].push(obsidianPath);
  } else {
    manifest.entries.push(manifestEntry);
    result[isNew ? "created" : "updated"].push(obsidianPath);
  }
}

export function pullBlogByTarget(
  rootDir: string,
  config: SyncConfig,
  manifest: SyncManifest,
  targetInput: string,
): PushResult {
  const target = resolveBlogTarget(rootDir, targetInput);
  const result: PushResult = { created: [], updated: [], skipped: [] };

  syncOneBlogPost(
    rootDir,
    config,
    manifest,
    target.blogPath,
    target.blogSlug,
    result,
    { force: true },
  );

  saveSyncManifest(rootDir, manifest);
  return result;
}

export function pushVengeanceToObsidian(
  rootDir: string,
  config: SyncConfig,
  manifest: SyncManifest,
): PushResult {
  const result: PushResult = { created: [], updated: [], skipped: [] };
  const handledBlogPaths = new Set<string>();

  for (const entry of manifest.entries) {
    const blogAbsPath = path.join(rootDir, entry.blogPath);
    if (!fs.existsSync(blogAbsPath)) {
      result.skipped.push(`${entry.blogPath} (blog file missing)`);
      continue;
    }

    const blogCategory = entry.blogSlug.split("/")[0] ?? "";
    const mapping = mappingForBlogCategory(config, blogCategory);
    if (!mapping) {
      result.skipped.push(`${entry.blogPath} (category not configured for pull)`);
      continue;
    }

    handledBlogPaths.add(entry.blogPath.replace(/\\/g, "/"));
    syncOneBlogPost(
      rootDir,
      config,
      manifest,
      entry.blogPath,
      entry.blogSlug,
      result,
    );
  }

  for (const mapping of config.mappings) {
    if (!mappingAllowsVengeancePush(mapping)) continue;

    for (const blogAbsPath of collectBlogPosts(rootDir, mapping.blogCategory)) {
      const blogPath = toBlogRelative(rootDir, blogAbsPath);
      if (handledBlogPaths.has(blogPath)) continue;

      const source = fs.readFileSync(blogAbsPath, "utf8");
      const meta = readVengeanceMeta(source);
      if (!meta?.syncId && !meta?.obsidianPath) {
        continue;
      }

      const blogSlug = `${mapping.blogCategory}/${path.basename(blogAbsPath, ".md")}`;
      syncOneBlogPost(rootDir, config, manifest, blogPath, blogSlug, result);
    }
  }

  saveSyncManifest(rootDir, manifest);
  return result;
}

export function runPushToObsidian(rootDir: string, target?: string) {
  const config = loadSyncConfig(rootDir);
  const manifest = loadSyncManifest(rootDir);

  if (target?.trim()) {
    return pullBlogByTarget(rootDir, config, manifest, target);
  }

  return pushVengeanceToObsidian(rootDir, config, manifest);
}
