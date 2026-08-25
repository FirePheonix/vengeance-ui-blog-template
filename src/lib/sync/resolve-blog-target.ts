import fs from "node:fs";
import path from "node:path";

const BLOG_ROOT = path.join("content", "blog");

export type ResolvedBlogTarget = {
  blogPath: string;
  blogSlug: string;
  blogAbsPath: string;
  category: string;
  fileName: string;
};

export function normalizeBlogTargetInput(input: string) {
  let value = input.trim().replace(/\\/g, "/");

  if (value.startsWith("content/blog/")) {
    value = value.slice("content/blog/".length);
  }

  if (value.endsWith(".md")) {
    value = value.slice(0, -3);
  }

  return value.replace(/^\/+|\/+$/g, "");
}

export function resolveBlogTarget(rootDir: string, input: string): ResolvedBlogTarget {
  const blogSlug = normalizeBlogTargetInput(input);

  if (!blogSlug.includes("/")) {
    throw new Error(
      `Blog path must include a category, e.g. frontend/how-browsers-work (got: ${input})`,
    );
  }

  const blogPath = path.join(BLOG_ROOT, `${blogSlug}.md`).replace(/\\/g, "/");
  const blogAbsPath = path.join(rootDir, blogPath);

  if (!fs.existsSync(blogAbsPath)) {
    throw new Error(`Blog file not found: ${blogPath}`);
  }

  const segments = blogSlug.split("/");
  const fileName = `${segments.at(-1)}.md`;
  const category = segments[0] ?? "";

  return {
    blogPath,
    blogSlug,
    blogAbsPath,
    category,
    fileName,
  };
}

export function buildObsidianPathForBlog(
  obsidianBlogRoot: string,
  blogSlug: string,
) {
  return `${obsidianBlogRoot.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "")}/${blogSlug}.md`;
}
