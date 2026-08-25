---
title: Push from Obsidian to Vengeance
description: >-
  Write in your vault, then sync one note or a whole drafts folder into
  content/blog/.
author: Vengeance Blog
inspiredBy: Obsidian sync workflow
date: '2026-08-26'
---

## What push does

**Push** copies notes from your Obsidian vault **into** the Vengeance repo under `content/blog/`.

Direction:

```txt
Obsidian vault  →  content/blog/<category>/
```

Use push when you drafted a post in Obsidian and want it to show up on the site.

## Where to write in Obsidian

Push only works for folders listed in `.vengeance/config.json` under `mappings`.

Example mapping:

```json
{
  "obsidianFolder": "Blogs/Drafts",
  "blogCategory": "frontend",
  "direction": "bidirectional"
}
```

Notes in `Blogs/Drafts/` land in `content/blog/frontend/`.

For **about** pages, add a second mapping:

```json
{
  "obsidianFolder": "Blogs/about",
  "blogCategory": "about",
  "direction": "bidirectional"
}
```

## Frontmatter

Add YAML at the top of your note:

```yaml
---
title: "My Post Title"
description: "One-line summary for the blog UI"
author: "Your name"
date: "2026-08-26"
---
```

If you skip `title`, the sync uses the filename.

## Push one note

From the repo root:

```powershell
npx tsx scripts/sync-obsidian.ts push "Blogs/Drafts/your-draft-post.md"
```

Or for an about page:

```powershell
npx tsx scripts/sync-obsidian.ts push "Blogs/about/your-about-page.md"
```

## Push everything in mapped folders

```powershell
npm run sync:push
```

This scans every mapped Obsidian folder and syncs all `.md` files inside.

## What you get on the blog side

A pushed note becomes:

```txt
content/blog/<category>/<slug>.md
```

The blog file keeps internal `vengeance:` metadata (sync id, Obsidian path, last sync time). Your Obsidian copy stays clean — that metadata is stripped when pulling back.

## Typical workflow

1. Create or edit a note in a mapped folder (`Blogs/Drafts/` or `Blogs/about/`).
2. Run push for one file (see above) or bulk `npm run sync:push`.
3. Start the dev server and open the route — folder + filename become the URL.

## Check before you push

```powershell
npm run sync:status
```

Shows vault path, linked entries, blog post counts, and how many notes sit in each mapped folder.
