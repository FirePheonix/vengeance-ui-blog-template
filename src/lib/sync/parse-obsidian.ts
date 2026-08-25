import type { WikilinkMode } from "./types";

export function convertWikilinks(markdown: string, mode: WikilinkMode) {
  if (mode === "plain") {
    return markdown.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, target, label) => {
      return label ?? target;
    });
  }

  return markdown.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, target, label) => {
    const text = (label ?? target).trim();
    const slug = String(target)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    return `[${text}](${slug || "#"})`;
  });
}

export function slugifyFileName(fileName: string) {
  return fileName
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
