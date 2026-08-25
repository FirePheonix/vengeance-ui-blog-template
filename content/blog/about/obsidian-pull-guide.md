---
title: Pull from Vengeance into Obsidian
description: >-
  Bring existing repo blogs into your vault for editing — bulk or one file at a
  time.
author: Vengeance Blog
inspiredBy: Obsidian sync workflow
date: '2026-08-26'
---

## What pull does

**Pull** copies blog posts from the Vengeance repo **into** your Obsidian vault.

Direction:

```txt
content/blog/  →  Obsidian vault (Blogs/<category>/)
```

Use pull when the blog already has posts in git and you want to edit them in Obsidian.

## Where files land in Obsidian

Pull uses `obsidianBlogRoot` from config (default: `Blogs`).

Path pattern:

```txt
content/blog/frontend/example-post.md
  →  Blogs/frontend/example-post.md

content/blog/about/your-about-page.md
  →  Blogs/about/your-about-page.md
```

Pull does **not** use the draft mappings — it mirrors the repo folder structure under `Blogs/`.

## Pull all blog posts

```powershell
npm run sync:pull
```

Scans every `.md` file under `content/blog/` (frontend, classics, systems, about, etc.) and writes them into your vault.

Re-running is safe: unchanged posts are skipped.

## Pull one post

```powershell
npx tsx scripts/sync-obsidian.ts pull "frontend/example-post.md"
```

You can omit `content/blog/` and the `.md` extension — the sync resolves the path for you.

## What changes in Obsidian

- Internal `vengeance:` blocks are **removed** from the note you edit — clean markdown only.
- The repo copy keeps sync metadata so push and pull stay linked.

## Pull vs push — quick reference

| Command | Direction | Bulk scans |
|---------|-----------|------------|
| `sync:pull` | repo → vault | all of `content/blog/` |
| `sync:push` | vault → repo | mapped Obsidian folders only |

**Drafts** (`Blogs/Drafts/`) are for new work you push out. **Pulled** posts live under `Blogs/<category>/` matching the repo.

## Suggested edit loop

1. `npm run sync:pull` — get latest from repo into Obsidian.
2. Edit in Obsidian under `Blogs/frontend/...` or `Blogs/about/...`.
3. Push changes back with `npx tsx scripts/sync-obsidian.ts push "Blogs/frontend/your-post.md"`.

For brand-new posts, write in `Blogs/Drafts/` or `Blogs/about/` and push instead.

## Check what's in the repo

```powershell
npm run sync:status
```

Look for the line:

```txt
Blog posts in content/blog/: <count> (about=N, classics=N, ...)
```

That count is what bulk pull will sync.
