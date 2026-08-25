import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { FolderMapping, SyncConfig, SyncManifest } from "./types";
import { loadSyncConfig } from "./config";
import {
  findManifestEntryByObsidianPath,
  loadSyncManifest,
  saveSyncManifest,
} from "./manifest";
import {
  blogDraftToFileContent,
  obsidianNoteToBlogDraft,
} from "./obsidian-to-blog";
import { hashContent } from "./hash";
import { slugifyFileName } from "./parse-obsidian";

const BLOG_ROOT = path.join("content", "blog");

export type PushResult = {
  created: string[];
  updated: string[];
  skipped: string[];
};

function mappingAllowsObsidianPush(mapping: FolderMapping) {
  return (
    mapping.direction === "bidirectional" ||
    mapping.direction === "obsidian-to-vengeance"
  );
}

function shouldIgnore(relativePath: string, ignore: string[]) {
  const parts = relativePath.split("/");
  return ignore.some((pattern) => parts.includes(pattern));
}

function collectObsidianNotes(vaultPath: string, obsidianFolder: string) {
  const folderAbs = path.join(vaultPath, obsidianFolder);
  if (!fs.existsSync(folderAbs)) {
    return [] as string[];
  }

  const files: string[] = [];
  const stack = [folderAbs];

  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(abs);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(abs);
      }
    }
  }

  return files.sort();
}

function toObsidianRelative(vaultPath: string, absPath: string) {
  return path.relative(vaultPath, absPath).replace(/\\/g, "/");
}

export function pushObsidianToVengeance(
  rootDir: string,
  config: SyncConfig,
  manifest: SyncManifest,
): PushResult {
  const result: PushResult = { created: [], updated: [], skipped: [] };

  for (const mapping of config.mappings) {
    if (!mappingAllowsObsidianPush(mapping)) continue;

    const notes = collectObsidianNotes(config.vaultPath, mapping.obsidianFolder);
    if (notes.length === 0) {
      result.skipped.push(
        `No notes found in ${mapping.obsidianFolder} (create this folder in your vault)`,
      );
      continue;
    }

    for (const absNotePath of notes) {
      const obsidianPath = toObsidianRelative(config.vaultPath, absNotePath);
      if (shouldIgnore(obsidianPath, config.ignore)) continue;

      const source = fs.readFileSync(absNotePath, "utf8");
      const draft = obsidianNoteToBlogDraft(source, obsidianPath, config);
      const contentHash = hashContent(draft.markdown);
      const fileBase = path.basename(absNotePath, ".md");
      const slug = slugifyFileName(fileBase) || "untitled";
      const blogRelPath = path
        .join(BLOG_ROOT, mapping.blogCategory, `${slug}.md`)
        .replace(/\\/g, "/");
      const blogAbsPath = path.join(rootDir, blogRelPath);
      const blogSlug = `${mapping.blogCategory}/${slug}`;

      const existing = findManifestEntryByObsidianPath(manifest, obsidianPath);
      if (existing && existing.contentHash === contentHash) {
        result.skipped.push(`${obsidianPath} (unchanged)`);
        continue;
      }

      const syncId = existing?.id ?? randomUUID();
      const fileContent = blogDraftToFileContent(draft, syncId);

      fs.mkdirSync(path.dirname(blogAbsPath), { recursive: true });
      const isNew = !fs.existsSync(blogAbsPath);
      fs.writeFileSync(blogAbsPath, fileContent, "utf8");

      const entry = {
        id: syncId,
        obsidianPath,
        blogPath: blogRelPath,
        blogSlug,
        contentHash,
        lastSyncedAt: draft.syncMeta.lastSyncedAt,
        lastSource: "obsidian" as const,
      };

      if (existing) {
        manifest.entries = manifest.entries.map((item) =>
          item.id === existing.id ? entry : item,
        );
        result.updated.push(blogRelPath);
      } else {
        manifest.entries.push(entry);
        result.created.push(blogRelPath);
      }
    }
  }

  saveSyncManifest(rootDir, manifest);
  return result;
}

export function runPushToVengeance(rootDir: string) {
  const config = loadSyncConfig(rootDir);
  const manifest = loadSyncManifest(rootDir);
  return pushObsidianToVengeance(rootDir, config, manifest);
}

export function getSyncStatus(rootDir: string) {
  const config = loadSyncConfig(rootDir);
  const manifest = loadSyncManifest(rootDir);

  const pendingFolders = config.mappings
    .map((mapping) => {
      const folderAbs = path.join(config.vaultPath, mapping.obsidianFolder);
      const exists = fs.existsSync(folderAbs);
      const noteCount = exists ? collectObsidianNotes(config.vaultPath, mapping.obsidianFolder).length : 0;
      return {
        obsidianFolder: mapping.obsidianFolder,
        blogCategory: mapping.blogCategory,
        folderExists: exists,
        noteCount,
      };
    });

  return {
    vaultPath: config.vaultPath,
    linkedEntries: manifest.entries.length,
    folders: pendingFolders,
  };
}
