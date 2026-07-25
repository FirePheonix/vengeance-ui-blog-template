---
title: "About"
description: "This page can be your personal About page, with folder-routed markdown."
author: "Vengeance Blog"
inspiredBy: "Vengeance UI docs layout"
date: "2026-07-24"
---

<video controls src="/vengeance-adding-blog-demo.mp4"></video>

## This can be your About

Use this page as your own About section. Replace this text with your bio, work summary, stack, and links.

## What you get

This template reads markdown files from `content/blog/**.md` and automatically wires:

- route path from folder/file name
- right TOC progress rail from `##` / `###` headings
- mind web node title from frontmatter `title`

## Folder routing

File:

```txt
content/blog/about/about-template.md
```

Route:

```txt
/about/about-template
```

### Frontmatter fields

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

### Image:

![Vengeance preview](/vengeance-image.png)

## Mermaid diagram

```mermaid
graph TD
  A[Markdown file] --> B[Frontmatter parser]
  B --> C[TOC headings]
  B --> D[Mind web title]
  C --> E[Right rail]
  D --> E
```

### Flow diagram sample

```mermaid
flowchart LR
  A[Write markdown] --> B[Save in content/blog/about]
  B --> C[Auto route + sidebar]
  C --> D[TOC + mind web]
```
