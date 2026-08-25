---
title: Push from Obsidian to Vengeance
description: Write in Obsidian, run one command, your note becomes a blog post.
author: Vengeance Blog
inspiredBy: Obsidian sync workflow
date: '2026-08-26'
---

<div align="center" style="display:flex;align-items:center;justify-content:center;gap:16px;padding:8px 0 24px;">
  <img src="/obsidian-icon.webp" alt="Obsidian" width="56" height="56" style="width:56px;height:56px;object-fit:contain;" />
  <span style="font-size:28px;color:#a1a1aa;">→</span>
  <img src="/vengeance-icon.svg" alt="Vengeance" width="56" height="56" style="width:56px;height:56px;object-fit:contain;" />
</div>

## In one line

Write in **Obsidian**, push once, the note lands in **Vengeance** as a blog file.

```mermaid
flowchart LR
  O[Obsidian note] -->|push| V[Blog file in repo]
  V --> R[Live page on site]
```

## Example

**You write** `Blogs/Drafts/my-react-tips.md` in Obsidian:

```markdown
---
title: My React Tips
description: Three hooks I use every day
---

## useMemo
Use when profiling shows a real cost.
```

**You run:**

```powershell
npx tsx scripts/sync-obsidian.ts push "Blogs/Drafts/my-react-tips.md"
```

**You get** `content/blog/frontend/my-react-tips.md` → open `/frontend/my-react-tips`.

## Where to write

| Obsidian folder | Goes to |
|-----------------|---------|
| `Blogs/Drafts/` | `content/blog/frontend/` |
| `Blogs/about/` | `content/blog/about/` |

Set these in `.vengeance/config.json` under `mappings`.

## Commands

```powershell
npm run sync:status                                              # check vault + counts
npx tsx scripts/sync-obsidian.ts push "Blogs/Drafts/note.md"    # one file
npx tsx scripts/sync-obsidian.ts push                           # all mapped folders
```
