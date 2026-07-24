---
title: "About This Template"
description: "Folder-routed markdown blog template with TOC + mind web sync."
author: "Vengeance Blog"
inspiredBy: "Vengeance UI docs layout"
date: "2026-07-24"
---

## What you get

This template reads markdown files from `content/blog/**.md` and automatically wires:

- route path from folder/file name
- right TOC progress rail from `##` / `###` headings
- mind web node title from frontmatter `title`

## Folder routing

File:

```txt
content/blog/getting-started/about-template.md
```

Route:

```txt
/getting-started/about-template
```

## Frontmatter fields

Use this frontmatter schema:

```yaml
---
title: "Post title"
description: "One-line summary"
author: "Your name"
inspiredBy: "Source or reference"
date: "2026-07-24"
readingTime: "6 min" # optional, auto-calculated if omitted
isNew: true          # optional
---
```

## Rich markdown

Image:

![Vengeance preview](/vengeance-image.png)

Video:

<video controls src="/vengeance-demo.mp4"></video>

### Mermaid diagram

```mermaid
graph TD
  A[Markdown file] --> B[Frontmatter parser]
  B --> C[TOC headings]
  B --> D[Mind web title]
  C --> E[Right rail]
  D --> E
```
