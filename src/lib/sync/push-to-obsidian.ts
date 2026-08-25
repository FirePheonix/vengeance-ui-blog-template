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

function defaultObsidianPath(mapping: FolderMapping, blogFileName: string) {
  return `${mapping.obsidianFolder}/${blogFileName}`.replace(/\\/g, "/");
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

    const source = fs.readFileSync(blogAbsPath, "utf8");
    const body = matter(source).content.trim();
    const contentHash = hashContent(body);
    const obsidianAbs = path.join(config.vaultPath, entry.obsidianPath);

    if (entry.contentHash === contentHash && fs.existsSync(obsidianAbs)) {
      result.skipped.push(`${entry.blogPath} (unchanged)`);
      continue;
    }

    const draft = blogFileToObsidianDraft(
      source,
      entry.blogPath,
      entry.blogSlug,
      entry.obsidianPath,
      entry.id,
    );

    fs.mkdirSync(path.dirname(obsidianAbs), { recursive: true });
    const isNew = !fs.existsSync(obsidianAbs);
    fs.writeFileSync(obsidianAbs, draft.markdown, "utf8");
    fs.writeFileSync(blogAbsPath, blogDraftToFileContent(draft, source), "utf8");

    Object.assign(entry, {
      contentHash,
      lastSyncedAt: draft.syncMeta.lastSyncedAt,
      lastSource: "vengeance" as const,
    });

    if (isNew) {
      result.created.push(entry.obsidianPath);
    } else {
      result.updated.push(entry.obsidianPath);
    }
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

      const existing = findManifestEntryByBlogPath(manifest, blogPath);
      const syncId = existing?.id ?? meta.syncId ?? randomUUID();
      const obsidianPath =
        existing?.obsidianPath ??
        meta.obsidianPath ??
        defaultObsidianPath(mapping, path.basename(blogAbsPath));
      const blogSlug = `${mapping.blogCategory}/${path.basename(blogAbsPath, ".md")}`;
      const draft = blogFileToObsidianDraft(
        source,
        blogPath,
        blogSlug,
        obsidianPath,
        syncId,
      );
      const contentHash = hashContent(matter(source).content.trim());
      const obsidianAbs = path.join(config.vaultPath, obsidianPath);

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
        result.updated.push(obsidianPath);
      } else {
        manifest.entries.push(manifestEntry);
        result.created.push(obsidianPath);
      }
    }
  }

  saveSyncManifest(rootDir, manifest);
  return result;
}

export function runPushToObsidian(rootDir: string) {
  const config = loadSyncConfig(rootDir);
  const manifest = loadSyncManifest(rootDir);
  return pushVengeanceToObsidian(rootDir, config, manifest);
}
