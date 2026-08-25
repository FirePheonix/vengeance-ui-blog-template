---
title: Pull from Vengeance into Obsidian
description: Bring repo blog posts into your vault so you can edit them in Obsidian.
author: Vengeance Blog
inspiredBy: Obsidian sync workflow
date: '2026-08-26'
---

<div align="center" style="display:flex;align-items:center;justify-content:center;gap:16px;padding:8px 0 24px;">
  <img src="/vengeance-icon.svg" alt="Vengeance" width="56" height="56" style="width:56px;height:56px;object-fit:contain;" />
  <span style="font-size:28px;color:#a1a1aa;">→</span>
  <img src="/obsidian-icon.webp" alt="Obsidian" width="56" height="56" style="width:56px;height:56px;object-fit:contain;" />
</div>

## In one line

Posts already live in the repo. **Pull** copies them into your **Obsidian** vault to edit.

```mermaid
flowchart LR
  V[Blog file in repo] -->|pull| O[Obsidian note in vault]
```

## Example

**Repo has:**

```txt
content/blog/frontend/how-browsers-work.md
```

**You run:**

```powershell
npx tsx scripts/sync-obsidian.ts pull "frontend/how-browsers-work.md"
```

**Obsidian gets** `Blogs/frontend/how-browsers-work.md` — clean markdown, ready to edit.

**Edited something?** Push it back:

```powershell
npx tsx scripts/sync-obsidian.ts push "Blogs/frontend/how-browsers-work.md"
```

## Pull everything

```powershell
npm run sync:pull
```

Mirrors all of `content/blog/` → `Blogs/<category>/`. Safe to re-run.

## Push vs pull

| | Pull | Push |
|---|------|------|
| Direction | repo → Obsidian | Obsidian → repo |
| One file | `tsx ... pull "frontend/post.md"` | `tsx ... push "Blogs/Drafts/post.md"` |
| All files | `npm run sync:pull` | `npx tsx scripts/sync-obsidian.ts push` |

**Tip:** New drafts go in `Blogs/Drafts/`. Pulled posts sit under `Blogs/frontend/`, `Blogs/about/`, etc.

## Check counts

```powershell
npm run sync:status
```
