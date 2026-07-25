
<div align="center">

<h1> <img src="https://github.com/user-attachments/assets/3875118d-75c0-4bc7-b7a6-7a0ef6a42252" width="42" alt="Vengeance Logo"/>
 Vengeance Blog Template </h1>

Standalone blog/docs template inspired by the Vengeance UI docs shell, built with **Next.js (App Router)** and **Tailwind CSS**.

<p>


  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Markdown-Content-000000?style=for-the-badge&logo=markdown" />
  <img src="https://img.shields.io/badge/Mermaid-Diagrams-FF3670?style=for-the-badge&logo=mermaid" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel" />
</p>



https://github.com/user-attachments/assets/cfaa7a42-d98e-4437-b2eb-183736e86cb5



</div>

---

## ✨ Features

- 📝 Markdown-based blog system (`content/blog/**.md`)
- 📂 Left index sidebar grouped by folder/category
- 🔍 Command search (title + content matching with highlighting)
- 📊 Mermaid diagram rendering
- 🖼️ Image & video embedding
- 🧠 Mindmap panel
- 📖 Right-side progress bar & Table of Contents
- 🌙 Light / Dark / System themes

---

## 📦 Requirements

- Node.js 22+
- npm 10+

---

## 🚀 Install

```bash
npm install
```

---

## 💻 Development

```bash
npm run dev
```

Open **http://localhost:3000**

---

## 🏗️ Production

```bash
npm run build
npm run start
```

---

## 🐳 Docker

### Docker Compose

```bash
docker compose up --build
```

Runs at **http://localhost:3000**

### Docker CLI

```bash
docker build -t vengeance-blog-template .
docker run --rm -p 3000:3000 vengeance-blog-template
```

---

## ▲ Deploy to Vercel

```bash
npm i -g vercel
vercel login
npm run vercel:pull
npm run vercel:deploy
```

Production deployment:

```bash
npm run vercel:deploy:prod
```

---

## 📁 Content Structure

```
content/
└── blog/
    ├── about/
    ├── classics/
    ├── frontend/
    └── systems/
```

Each folder becomes a **sidebar category**.

Each markdown file becomes a page.

Example:

```
content/blog/classics/mapreduce-explained.md
```

↓

```
/classics/mapreduce-explained
```

---

## ✍️ Markdown Templates

Use:

- `content/blog/.post-template.md`
- `content/blog/about/about-template.md`

They include examples for:

- Frontmatter
- Headings (`##`, `###`)
- Images
- Videos
- Mermaid diagrams

---

## 📄 License

Licensed under the **MIT License**.

See:

- `LICENSE`
- `CONTRIBUTING.md`
