# vengeance-bog-template

Blog starter that ports the **Vengeance UI `/docs` shell** into a standalone **Next.js + Tailwind CSS v4** app.

## What matches Vengeance UI docs

- Sticky top navbar + theme toggle
- Left sidebar index with section headers, nested links, hover motion
- Diagonal striped divider rail between nav and content
- Docs-style article typography (headers, body, code blocks with copy)
- Right “On this page” TOC (xl+)

## Sample posts

Famous technical topics as original sample essays (inspired by well-known essays — not copies):

- Maker's Schedule, Manager's Schedule
- MapReduce Explained Simply
- CAP Theorem in Practice
- A Complete Guide to useEffect
- How Browsers Work
- Why Redis Is Fast
- What Programmers Should Know About Memory

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/about`.

## Add a post

Edit `src/lib/blogs.ts`: add a `BlogPost` to a category in `BLOG_CATEGORIES`. It appears in the left index and at `/{slug}` automatically.
