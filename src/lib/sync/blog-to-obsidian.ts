import matter from "gray-matter";
import type { VengeanceFrontmatterSync } from "./types";

type BlogFrontmatter = {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  inspiredBy?: string;
  tags?: string[];
  vengeance?: VengeanceFrontmatterSync;
};

export type ObsidianDraftFromBlog = {
  obsidianPath: string;
  markdown: string;
  syncMeta: {
    blogPath: string;
    blogSlug: string;
    source: "vengeance";
    lastSyncedAt: string;
    syncId: string;
  };
};

function cleanFrontmatter(data: BlogFrontmatter) {
  const frontmatter: Record<string, unknown> = {};

  if (data.title) frontmatter.title = data.title;
  if (data.description) frontmatter.description = data.description;
  if (data.author) frontmatter.author = data.author;
  if (data.date) frontmatter.date = data.date;
  if (data.inspiredBy) frontmatter.inspiredBy = data.inspiredBy;
  if (data.tags?.length) frontmatter.tags = data.tags;

  return frontmatter;
}

export function blogFileToObsidianDraft(
  source: string,
  blogPath: string,
  blogSlug: string,
  obsidianPath: string,
  syncId: string,
): ObsidianDraftFromBlog {
  const parsed = matter(source);
  const data = parsed.data as BlogFrontmatter;
  const now = new Date().toISOString();
  const frontmatter = cleanFrontmatter(data);
  const body = parsed.content.trim();

  return {
    obsidianPath,
    markdown: matter.stringify(body ? `\n${body}\n` : "\n", frontmatter),
    syncMeta: {
      blogPath,
      blogSlug,
      source: "vengeance",
      lastSyncedAt: now,
      syncId,
    },
  };
}

export function vengeanceDraftToBlogFileContent(
  draft: ObsidianDraftFromBlog,
  existingSource?: string,
) {
  const parsed = existingSource
    ? matter(existingSource)
    : { data: {}, content: "" };
  const existing = parsed.data as BlogFrontmatter;
  const body = matter(draft.markdown).content.trim();
  const parsedObsidian = matter(draft.markdown).data as BlogFrontmatter;

  const frontmatter: Record<string, unknown> = {
    title: existing.title ?? parsedObsidian.title,
    description: existing.description ?? parsedObsidian.description,
    author: existing.author ?? parsedObsidian.author,
    inspiredBy: existing.inspiredBy ?? parsedObsidian.inspiredBy,
    date: existing.date ?? parsedObsidian.date,
    vengeance: {
      syncId: draft.syncMeta.syncId,
      obsidianPath: draft.obsidianPath,
      lastSyncedAt: draft.syncMeta.lastSyncedAt,
      source: draft.syncMeta.source,
    },
  };

  if (existing.tags?.length || parsedObsidian.tags?.length) {
    frontmatter.tags = existing.tags ?? parsedObsidian.tags;
  }

  for (const key of Object.keys(frontmatter)) {
    if (frontmatter[key] === undefined) {
      delete frontmatter[key];
    }
  }

  return matter.stringify(body ? `\n${body}\n` : "\n", frontmatter);
}
