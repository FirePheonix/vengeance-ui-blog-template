---
title: Pull from Vengeance into Obsidian
description: Bring repo blog posts into your vault so you can edit them in Obsidian.
author: Vengeance Blog
inspiredBy: Obsidian sync workflow
date: '2026-08-26'
vengeance:
  syncId: 915f7982-dfe0-4a2e-988b-eafb0d82ebbb
  obsidianPath: Blogs/about/obsidian-pull-guide.md
  lastSyncedAt: '2026-08-25T19:43:43.185Z'
  source: vengeance
---

<div align="center" style="display:flex;align-items:center;justify-content:center;gap:10px;padding:4px 0 16px;">
  <img src="/vengeance-icon.svg" alt="Vengeance" width="32" height="32" style="width:32px;height:32px;object-fit:contain;" />
  <span style="font-size:18px;color:#a1a1aa;">→</span>
  <img src="/obsidian-icon.webp" alt="Obsidian" width="32" height="32" style="width:32px;height:32px;object-fit:contain;" />
</div>

## Setup first

Before pull works, copy the example config and point it at **your** vault:

```powershell
copy .vengeance\config.example.json .vengeance\config.json
```

Then edit `.vengeance/config.json`:

- **`vaultPath`** — absolute path to your Obsidian vault
- **`obsidianBlogRoot`** — folder in the vault where pulled posts go (default: `Blogs`)
- **`mappings`** — needed if you push edits back from Obsidian

Example:

```json
{
  "vaultPath": "C:/Users/you/Documents/MyVault",
  "obsidianBlogRoot": "Blogs",
  "mappings": [
    {
      "obsidianFolder": "Blogs/Drafts",
      "blogCategory": "frontend",
      "direction": "bidirectional"
    }
  ]
}
```

This file is gitignored — it stays on your machine only.

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

**Obsidian gets** `Blogs/frontend/how-browsers-work.md` — path comes from `obsidianBlogRoot` in your config.

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
