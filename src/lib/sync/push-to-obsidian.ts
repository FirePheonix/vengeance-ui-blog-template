import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import matter from "gray-matter";
import type { SyncConfig, SyncManifest, VengeanceFrontmatterSync } from "./types";
import { loadSyncConfig } from "./config";
import {
  findManifestEntryByBlogPath,
  loadSyncManifest,
  saveSyncManifest,
} from "./manifest";
import {
  vengeanceDraftToBlogFileContent,
  blogFileToObsidianDraft,
} from "./blog-to-obsidian";
import { hashContent } from "./hash";
import type { PushResult } from "./push-to-vengeance";
import {
  buildObsidianPathForBlog,
  collectAllBlogPosts,
  resolveBlogTarget,
} from "./resolve-blog-target";

function readVengeanceMeta(source: string) {
  const parsed = matter(source);
  return parsed.data.vengeance as VengeanceFrontmatterSync | undefined;
}

function resolveObsidianPath(
  config: SyncConfig,
  blogSlug: string,
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
  options: { force?: boolean } = {},
) {
  const blogAbsPath = path.join(rootDir, blogPath);
  const source = fs.readFileSync(blogAbsPath, "utf8");
  const body = matter(source).content.trim();
  const contentHash = hashContent(body);
  const existing = findManifestEntryByBlogPath(manifest, blogPath);
  const meta = readVengeanceMeta(source);
  const syncId = existing?.id ?? meta?.syncId ?? randomUUID();
  const obsidianPath = resolveObsidianPath(
    config,
    blogSlug,
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
    result.skipped.push(`${blogSlug} (already in sync)`);
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
  fs.writeFileSync(
    blogAbsPath,
    vengeanceDraftToBlogFileContent(draft, source),
    "utf8",
  );

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
  } else {
    manifest.entries.push(manifestEntry);
  }

  result[isNew ? "created" : "updated"].push(obsidianPath);
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
  const blogPosts = collectAllBlogPosts(rootDir);

  if (blogPosts.length === 0) {
    result.skipped.push("No blog posts found in content/blog/");
    saveSyncManifest(rootDir, manifest);
    return result;
  }

  for (const post of blogPosts) {
    syncOneBlogPost(
      rootDir,
      config,
      manifest,
      post.blogPath,
      post.blogSlug,
      result,
    );
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

export function getBlogSyncSummary(rootDir: string) {
  const posts = collectAllBlogPosts(rootDir);
  const categories = new Map<string, number>();

  for (const post of posts) {
    categories.set(post.category, (categories.get(post.category) ?? 0) + 1);
  }

  return {
    totalBlogPosts: posts.length,
    categories: [...categories.entries()]
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => a.category.localeCompare(b.category)),
  };
}
