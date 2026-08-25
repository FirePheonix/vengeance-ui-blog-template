import matter from "gray-matter";
import type { SyncConfig, SyncSource } from "./types";
import { convertWikilinks } from "./parse-obsidian";

type ObsidianFrontmatter = {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  inspiredBy?: string;
  tags?: string[];
};

export type BlogDraftFromObsidian = {
  title: string;
  description: string;
  author: string;
  inspiredBy: string;
  date: string;
  markdown: string;
  syncMeta: {
    obsidianPath: string;
    source: SyncSource;
    lastSyncedAt: string;
  };
};

function titleFromPath(obsidianPath: string) {
  const base = obsidianPath.split("/").pop() ?? "Untitled";
  return base.replace(/\.md$/i, "").replace(/[-_]/g, " ");
}

export function obsidianNoteToBlogDraft(
  source: string,
  obsidianPath: string,
  config: SyncConfig,
): BlogDraftFromObsidian {
  const parsed = matter(source);
  const data = parsed.data as ObsidianFrontmatter;
  const body = convertWikilinks(parsed.content.trim(), config.wikilinkMode);
  const now = new Date().toISOString();

  return {
    title: data.title ?? titleFromPath(obsidianPath),
    description: data.description ?? "",
    author: data.author ?? "Vengeance Blog",
    inspiredBy: data.inspiredBy ?? "Obsidian",
    date: data.date ?? now.slice(0, 10),
    markdown: body,
    syncMeta: {
      obsidianPath,
      source: "obsidian",
      lastSyncedAt: now,
    },
  };
}

export function obsidianDraftToBlogFileContent(
  draft: BlogDraftFromObsidian,
  syncId: string,
) {
  const frontmatter = {
    title: draft.title,
    description: draft.description,
    author: draft.author,
    inspiredBy: draft.inspiredBy,
    date: draft.date,
    vengeance: {
      syncId,
      obsidianPath: draft.syncMeta.obsidianPath,
      lastSyncedAt: draft.syncMeta.lastSyncedAt,
      source: draft.syncMeta.source,
    },
  };

  return matter.stringify(`\n${draft.markdown}\n`, frontmatter);
}
