# Vengeance Blog Template

Standalone blog/docs template inspired by the Vengeance UI docs shell, built with Next.js (App Router) and Tailwind CSS.

## Features

- Markdown-based blog system (`content/blog/**.md`)
- Left index sidebar by folder/category
- Top command search (title + content matching with highlighting)
- Mermaid diagram rendering
- Image/video rendering support
- Mindmap panel and right-side progress/TOC behavior
- Theme toggle (light/dark/system)

## Requirements

- Node.js 22+
- npm 10+

## Install

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build + run (production)

```bash
npm run build
npm run start
```

## Docker

### Option 1: Docker Compose

```bash
docker compose up --build
```

App runs on `http://localhost:3000`.

### Option 2: Docker CLI

```bash
docker build -t vengeance-blog-template .
docker run --rm -p 3000:3000 vengeance-blog-template
```

## Deploy to Vercel

This repo includes `vercel.json` and scripts for quick deployment.

```bash
npm i -g vercel
vercel login
npm run vercel:pull
npm run vercel:deploy
```

For production:

```bash
npm run vercel:deploy:prod
```

## Content structure

- `content/blog/about/*.md`
- `content/blog/classics/*.md`
- `content/blog/frontend/*.md`
- `content/blog/systems/*.md`

Each folder becomes a left-sidebar category.  
Each markdown file becomes a route:

- `content/blog/classics/mapreduce-explained.md` -> `/classics/mapreduce-explained`

## Markdown template

Use:

- `content/blog/.post-template.md`
- `content/blog/about/about-template.md`

They include examples for:

- Frontmatter
- headings (`##`, `###`) used by the right-side progress bar/TOC
- images
- videos
- mermaid blocks
