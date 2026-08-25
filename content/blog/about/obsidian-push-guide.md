---
title: Push from Obsidian to Vengeance
description: 'Write in Obsidian, run one command, your note becomes a blog post.'
author: Vengeance Blog
inspiredBy: Obsidian sync workflow
date: '2026-08-26'
vengeance:
  syncId: 9953524e-52b4-4344-a486-a9e4f2d974bf
  obsidianPath: Blogs/about/obsidian-push-guide.md
  lastSyncedAt: '2026-08-25T21:24:37.336Z'
  source: vengeance
---

## Setup first

Before push works, copy the example config and point it at **your** vault:

```powershell
copy .vengeance\config.example.json .vengeance\config.json
```

Then edit `.vengeance/config.json`:

- **`vaultPath`** — absolute path to your Obsidian vault
- **`mappings`** — which Obsidian folders map to which blog categories
- **`obsidianBlogRoot`** — where pulled posts land in the vault (default: `Blogs`)

Example:

```json
{
  "vaultPath": "C:/Users/you/Documents/MyVault",
  "mappings": [
    {
      "obsidianFolder": "Blogs/Drafts",
      "blogCategory": "frontend",
      "direction": "bidirectional"
    }
  ],
  "obsidianBlogRoot": "Blogs"
}
```

This file is gitignored — it stays on your machine only.

<p align="center">

![icon:Obsidian](/obsidian-icon.webp) → ![icon:Vengeance](/vengeance-icon.svg)

</p>

## How push works

```mermaid
flowchart LR
  A["Obsidian\nBlogs/Drafts/my-react-tips.md"] -->|push| B["Repo\ncontent/blog/frontend/my-react-tips.md"]
  B --> C["Site\n/frontend/my-react-tips"]
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

Use `[[how-browsers-work]]` in Obsidian to link another note — push converts it to a blog route. See [Pull from Vengeance into Obsidian](/about/obsidian-pull-guide) for the reverse direction.

## Where to write

| Obsidian folder | Goes to |
|-----------------|---------|
| `Blogs/Drafts/` | `content/blog/frontend/` |
| `Blogs/about/` | `content/blog/about/` |

Those folders must match `mappings` in `.vengeance/config.json`.

## Commands

```powershell
npm run sync:status                                              # check vault + counts
npx tsx scripts/sync-obsidian.ts push "Blogs/Drafts/note.md"    # one file
npx tsx scripts/sync-obsidian.ts push                           # all mapped folders
```
