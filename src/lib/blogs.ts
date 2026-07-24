import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Boxes,
  CircuitBoard,
  Compass,
  Layers,
} from "lucide-react";

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; id: string; title: string; depth?: 2 | 3 }
  | { type: "code"; title?: string; code: string; language?: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  author: string;
  inspiredBy: string;
  date: string;
  readingTime: string;
  isNew?: boolean;
  sections: BlogBlock[];
};

export type TOCHeading = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export type BlogCategory = {
  name: string;
  icon: LucideIcon;
  items: BlogPost[];
};

function markdownEscape(value: string) {
  return value.replace(/([`*_{}\[\]()#+\-.!|>])/g, "\\$1");
}

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeMarkdownSlug(slug: string, counts: Map<string, number>) {
  const nextCount = (counts.get(slug) ?? 0) + 1;
  counts.set(slug, nextCount);

  return nextCount > 1 ? `${slug}-${nextCount}` : slug;
}

export function blocksToMarkdown(blocks: BlogBlock[]) {
  const lines: string[] = [];

  for (const block of blocks) {
    if (block.type === "heading") {
      const depth = block.depth ?? 2;
      const hashes = depth === 3 ? "###" : "##";
      lines.push(`${hashes} ${block.title}`);
      lines.push("");
      continue;
    }

    if (block.type === "paragraph") {
      lines.push(block.text);
      lines.push("");
      continue;
    }

    if (block.type === "list") {
      for (const item of block.items) {
        lines.push(`- ${item}`);
      }
      lines.push("");
      continue;
    }

    if (block.type === "quote") {
      lines.push(`> ${block.text}`);
      if (block.cite) {
        lines.push(`> - ${markdownEscape(block.cite)}`);
      }
      lines.push("");
      continue;
    }

    if (block.type === "code") {
      lines.push(`\`\`\`${block.language ?? "tsx"}`);
      lines.push(block.code.trimEnd());
      lines.push("\`\`\`");
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}

export function getPostMarkdown(post: BlogPost) {
  return blocksToMarkdown(post.sections);
}

export function getMarkdownHeadings(markdown: string): TOCHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const usedSlugs = new Map<string, number>();
  const headings: TOCHeading[] = [];
  let match: RegExpExecArray | null;

  match = headingRegex.exec(markdown);
  while (match) {
    const hashes = match[1];
    const rawTitle = match[2]
      .trim()
      .replace(/\s+#+\s*$/, "");
    const depth = hashes.length === 3 ? 3 : 2;
    const baseSlug = slugifyHeading(rawTitle) || `section-${headings.length + 1}`;

    headings.push({
      id: normalizeMarkdownSlug(baseSlug, usedSlugs),
      title: rawTitle,
      depth,
    });

    match = headingRegex.exec(markdown);
  }

  return headings;
}

const aboutTemplate: BlogPost = {
  slug: "about",
  title: "About this template",
  description:
    "A Vengeance UI docs-shell blog starter — left index, striped rail, article chrome.",
  author: "Vengeance Blog",
  inspiredBy: "Vengeance UI /docs layout",
  date: "2026-07-24",
  readingTime: "3 min",
  isNew: true,
  sections: [
    {
      type: "heading",
      id: "what-you-get",
      title: "What you get",
    },
    {
      type: "paragraph",
      text: "This template ports the Vengeance UI /docs experience into a standalone Next.js + Tailwind v4 app. The sticky left sidebar indexes posts, the diagonal stripe rail separates nav from content, and articles use the same typography rhythm as the docs pages.",
    },
    {
      type: "heading",
      id: "structure",
      title: "Project structure",
    },
    {
      type: "code",
      title: "src/",
      code: `src/
  app/
    [slug]/page.tsx   # individual posts
    layout.tsx         # docs-style shell
    page.tsx           # redirects to first post
  components/
    blog/              # article primitives
    layout/            # navbar, sidebar, toc
  lib/
    blogs.ts           # post catalog + content`,
    },
    {
      type: "heading",
      id: "customize",
      title: "Customize",
    },
    {
      type: "list",
      items: [
        "Add posts in lib/blogs.ts and they appear in the left index automatically.",
        "Keep slug unique — routes are /[slug].",
        "Heading blocks with an id feed the right-side “On this page” TOC.",
      ],
    },
    {
      type: "heading",
      id: "rich-markdown",
      title: "Rich markdown blocks",
    },
    {
      type: "paragraph",
      text: "Image markdown works directly:\n\n![Vercel mark](/vercel.svg)",
    },
    {
      type: "paragraph",
      text: "Video embeds are supported with HTML:\n\n<video controls src=\"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4\"></video>",
    },
    {
      type: "code",
      title: "mermaid - sequence example",
      language: "mermaid",
      code: `sequenceDiagram
  participant U as User
  participant B as Blog
  participant R as Renderer
  U->>B: Open post
  B->>R: Parse markdown
  R-->>U: Render diagram`,
    },
  ],
};

const makersSchedule: BlogPost = {
  slug: "makers-schedule",
  title: "Maker's Schedule, Manager's Schedule",
  description:
    "Why a single meeting can wreck a maker's entire afternoon — and how teams can respect deep work.",
  author: "Sample Essay",
  inspiredBy: "Paul Graham (2009)",
  date: "2009-07-01",
  readingTime: "8 min",
  sections: [
    {
      type: "heading",
      id: "two-schedules",
      title: "Two kinds of schedules",
    },
    {
      type: "paragraph",
      text: "Managers run on hour-long blocks. Their day is a sequence of meetings, decisions, and context switches — and that rhythm works for them. Makers — writers, engineers, designers — need longer contiguous stretches. A half-day block is the minimum unit of real progress.",
    },
    {
      type: "heading",
      id: "the-cost",
      title: "The cost of one meeting",
    },
    {
      type: "paragraph",
      text: "On a maker's schedule, a meeting doesn't cost an hour. It costs the surrounding block. A 2pm call can erase the afternoon because you never fully enter the problem before or after. Switching cost is the hidden tax.",
    },
    {
      type: "quote",
      text: "When you're operating on the maker's schedule, meetings are a disaster.",
      cite: "inspired by Paul Graham",
    },
    {
      type: "heading",
      id: "practical-rules",
      title: "Practical rules for teams",
    },
    {
      type: "list",
      items: [
        "Batch meetings into one or two windows per week.",
        "Protect mornings for makers; put syncs in the afternoon.",
        "Prefer async updates (docs, PRs, short recordings) over status meetings.",
        "If you must meet, make the agenda and decision criteria explicit.",
      ],
    },
    {
      type: "heading",
      id: "office-hours",
      title: "Office hours as a compromise",
    },
    {
      type: "paragraph",
      text: "One durable pattern: makers publish office hours. Outside those windows, default to written communication. Inside them, meetings are expected. Both schedules get what they need without pretending they are the same thing.",
    },
  ],
};

const mapReduce: BlogPost = {
  slug: "mapreduce-explained",
  title: "MapReduce Explained Simply",
  description:
    "How a two-function programming model scaled data processing across commodity machines.",
  author: "Systems Notes",
  inspiredBy: "Dean & Ghemawat, Google (2004)",
  date: "2004-12-01",
  readingTime: "10 min",
  sections: [
    {
      type: "heading",
      id: "idea",
      title: "The core idea",
    },
    {
      type: "paragraph",
      text: "MapReduce lets you express large batch jobs with two functions: map and reduce. The framework handles splitting input, scheduling workers, shuffling intermediate keys, and retrying failures. You focus on the transformation; the cluster focuses on distribution.",
    },
    {
      type: "heading",
      id: "map-phase",
      title: "Map phase",
    },
    {
      type: "paragraph",
      text: "Map takes an input record and emits zero or more key/value pairs. Classic example: count words — emit (word, 1) for every token. Thousands of map tasks can run in parallel across shards of the input.",
    },
    {
      type: "code",
      title: "pseudocode — word count map",
      code: `function map(docId, text):
  for word in tokenize(text):
    emit(word, 1)`,
    },
    {
      type: "heading",
      id: "shuffle",
      title: "Shuffle",
    },
    {
      type: "paragraph",
      text: "After map, the runtime groups all values for the same key onto the same reducer. That network-heavy step — the shuffle — is often the bottleneck, which is why partitioning and combiners matter.",
    },
    {
      type: "heading",
      id: "reduce-phase",
      title: "Reduce phase",
    },
    {
      type: "code",
      title: "pseudocode — word count reduce",
      code: `function reduce(word, counts):
  emit(word, sum(counts))`,
    },
    {
      type: "heading",
      id: "why-it-mattered",
      title: "Why it mattered",
    },
    {
      type: "paragraph",
      text: "MapReduce made fault-tolerant distributed computation accessible to application engineers. Later systems (Spark, Flink, Beam) kept the spirit while improving iteration, latency, and API ergonomics — but the mental model still pays rent.",
    },
  ],
};

const capTheorem: BlogPost = {
  slug: "cap-theorem-in-practice",
  title: "CAP Theorem in Practice",
  description:
    "Consistency, availability, and partition tolerance — what the slogan actually means when networks fail.",
  author: "Distributed Systems",
  inspiredBy: "Brewer / Gilbert & Lynch",
  date: "2012-05-01",
  readingTime: "9 min",
  sections: [
    {
      type: "heading",
      id: "statement",
      title: "The statement",
    },
    {
      type: "paragraph",
      text: "In a distributed system that can experience network partitions, you cannot simultaneously guarantee linearizable consistency and perfect availability. When a partition happens, you choose: refuse some requests (favor consistency) or serve possibly stale/divergent answers (favor availability).",
    },
    {
      type: "heading",
      id: "misconceptions",
      title: "Common misconceptions",
    },
    {
      type: "list",
      items: [
        "CAP is not a menu where you pick two letters forever.",
        "Partition tolerance is not optional on the real internet.",
        "Most systems are neither fully CP nor fully AP — they pick per-operation tradeoffs.",
        "Latency and durability are missing from the three-letter slogan but dominate real designs.",
      ],
    },
    {
      type: "heading",
      id: "examples",
      title: "Concrete examples",
    },
    {
      type: "paragraph",
      text: "A primary/replica SQL database that refuses writes when the primary is unreachable leans CP for those writes. A multi-master cache that accepts writes on both sides of a split leans AP and needs conflict resolution later. Good systems make the choice explicit in the API.",
    },
    {
      type: "heading",
      id: "design-takeaway",
      title: "Design takeaway",
    },
    {
      type: "paragraph",
      text: "Ask per use-case: what is worse — serving stale data, or returning an error? Inventory, payments, and identity often want stronger consistency. Feeds, analytics counters, and presence can tolerate eventual consistency. Encode that answer in retries, SLAs, and UX copy.",
    },
  ],
};

const useEffectGuide: BlogPost = {
  slug: "complete-guide-useeffect",
  title: "A Complete Guide to useEffect",
  description:
    "Effects synchronize with external systems — they are not lifecycle methods in disguise.",
  author: "React Notes",
  inspiredBy: "Dan Abramov / Overreacted",
  date: "2021-03-01",
  readingTime: "12 min",
  isNew: true,
  sections: [
    {
      type: "heading",
      id: "mental-model",
      title: "Mental model",
    },
    {
      type: "paragraph",
      text: "useEffect lets React components talk to things React does not own: the DOM beyond JSX, network subscriptions, timers, third-party widgets. Think “synchronize” not “run after render because class components had componentDidMount.”",
    },
    {
      type: "heading",
      id: "dependencies",
      title: "Dependencies are a contract",
    },
    {
      type: "paragraph",
      text: "The dependency array tells React when the effect is stale. If the effect reads a value, that value belongs in the array — or you restructure so it does not need to. Suppressing the linter is usually a smell that the effect is doing too much.",
    },
    {
      type: "code",
      title: "subscribe once, clean up always",
      code: `useEffect(() => {
  const controller = new AbortController();
  fetchUser(id, { signal: controller.signal });
  return () => controller.abort();
}, [id]);`,
    },
    {
      type: "heading",
      id: "avoid",
      title: "What to avoid",
    },
    {
      type: "list",
      items: [
        "Using effects to transform data that could be computed during render.",
        "Chaining effects that setState to cascade more effects — prefer derived state.",
        "Fetching in effects without cancellation or race handling.",
        "Treating Strict Mode double-invoke as a bug instead of a cleanup stress test.",
      ],
    },
    {
      type: "heading",
      id: "server-components",
      title: "Today's default",
    },
    {
      type: "paragraph",
      text: "In the App Router era, start with Server Components and server data fetching. Reach for useEffect when you truly need a client-only subscription or browser API. Fewer effects usually means fewer bugs.",
    },
  ],
};

const browsersWork: BlogPost = {
  slug: "how-browsers-work",
  title: "How Browsers Work",
  description:
    "From bytes on the wire to pixels on the screen — a tour of the rendering pipeline.",
  author: "Web Platform",
  inspiredBy: "HTML5 Rocks / browser internals essays",
  date: "2011-08-01",
  readingTime: "11 min",
  sections: [
    {
      type: "heading",
      id: "navigation",
      title: "Navigation",
    },
    {
      type: "paragraph",
      text: "A navigation starts with DNS, TCP/TLS, and an HTTP response. The browser streams HTML and begins building the DOM before the full document arrives. CSS downloads in parallel and feeds the CSSOM.",
    },
    {
      type: "heading",
      id: "render-tree",
      title: "Render tree",
    },
    {
      type: "paragraph",
      text: "DOM + CSSOM combine into a render tree of visible nodes. display:none nodes are omitted; visibility:hidden nodes still take space. Scripts can block parsing unless deferred or async — which is why modern bundlers obsess over waterfalls.",
    },
    {
      type: "heading",
      id: "layout-paint",
      title: "Layout, paint, composite",
    },
    {
      type: "list",
      items: [
        "Layout (reflow): compute geometry for each box.",
        "Paint: fill pixels for text, colors, shadows, images.",
        "Composite: layer GPU surfaces so scrolling/transforms stay cheap.",
      ],
    },
    {
      type: "heading",
      id: "performance",
      title: "Performance intuition",
    },
    {
      type: "paragraph",
      text: "Reading layout-affecting properties in a loop forces synchronous reflow. Animating transform and opacity tends to stay on the compositor. Measuring with Performance panel beats guessing — the pipeline is real hardware with real budgets (about 16ms per frame at 60Hz).",
    },
  ],
};

const redisFast: BlogPost = {
  slug: "why-redis-is-fast",
  title: "Why Redis Is Fast",
  description:
    "Single-threaded event loop, in-memory data structures, and ruthless simplicity.",
  author: "Infrastructure",
  inspiredBy: "antirez / Redis design notes",
  date: "2015-06-01",
  readingTime: "9 min",
  sections: [
    {
      type: "heading",
      id: "memory-first",
      title: "Memory first",
    },
    {
      type: "paragraph",
      text: "Redis keeps the working set in RAM. Disk exists for durability and restart (RDB/AOF), not for the hot path. That alone removes the hardest latency source in traditional databases.",
    },
    {
      type: "heading",
      id: "event-loop",
      title: "The event loop",
    },
    {
      type: "paragraph",
      text: "A (mostly) single-threaded command executor avoids lock contention and makes complex data structures easier to reason about. I/O multiplexing accepts thousands of clients; commands run to completion quickly by design.",
    },
    {
      type: "code",
      title: "mental model",
      code: `while true:
  events = wait_for_sockets()
  for event in events:
    execute_redis_command(event)  # fast, in-memory`,
    },
    {
      type: "heading",
      id: "data-structures",
      title: "Purpose-built structures",
    },
    {
      type: "paragraph",
      text: "Strings, hashes, lists, sets, sorted sets, streams — each operation is O(1) or O(log N) with careful encodings (ziplist/listpack, skiplist, etc.). The API maps to efficient primitives instead of SQL planning.",
    },
    {
      type: "heading",
      id: "tradeoffs",
      title: "Tradeoffs",
    },
    {
      type: "paragraph",
      text: "CPU-heavy commands can stall the loop. Memory is finite. Persistence and replication add failure modes you must understand. Redis is fast because it chooses a narrow, honest problem — not because magic.",
    },
  ],
};

const memoryGuide: BlogPost = {
  slug: "what-programmers-should-know-about-memory",
  title: "What Programmers Should Know About Memory",
  description:
    "Caches, locality, and why “fast code” is often “memory-friendly code.”",
  author: "Performance",
  inspiredBy: "Ulrich Drepper (2007)",
  date: "2007-11-21",
  readingTime: "10 min",
  sections: [
    {
      type: "heading",
      id: "hierarchy",
      title: "The hierarchy",
    },
    {
      type: "paragraph",
      text: "Modern CPUs are starved for data more often than for compute. Registers → L1 → L2 → L3 → RAM → SSD differ by orders of magnitude in latency and bandwidth. Algorithms that thrash caches look “mysteriously slow” on paper-identical Big-O.",
    },
    {
      type: "heading",
      id: "locality",
      title: "Locality wins",
    },
    {
      type: "list",
      items: [
        "Temporal locality: reuse the same data soon.",
        "Spatial locality: touch nearby addresses (arrays beat pointer-chasing trees).",
        "Prefetchers help sequential scans; random access pays full latency.",
      ],
    },
    {
      type: "heading",
      id: "practical",
      title: "Practical habits",
    },
    {
      type: "paragraph",
      text: "Prefer contiguous layouts for hot loops. Batch work to amortize cache misses. Measure with perf / VTune / Instruments — intuition without counters is folklore. The famous paper is long; the durable lesson is short: treat the memory hierarchy as part of your API.",
    },
    {
      type: "heading",
      id: "example",
      title: "Tiny illustration",
    },
    {
      type: "code",
      title: "row-major vs column-striding",
      code: `// Friendly: walk memory linearly
for (r in rows)
  for (c in cols)
    sum += matrix[r][c]

// Hostile: huge strides per inner step
for (c in cols)
  for (r in rows)
    sum += matrix[r][c]`,
    },
  ],
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    name: "Getting started",
    icon: Compass,
    items: [aboutTemplate],
  },
  {
    name: "Classics",
    icon: BookOpen,
    items: [makersSchedule, mapReduce, capTheorem],
  },
  {
    name: "Frontend",
    icon: Layers,
    items: [useEffectGuide, browsersWork],
  },
  {
    name: "Systems",
    icon: CircuitBoard,
    items: [redisFast, memoryGuide],
  },
];

export const ALL_POSTS: BlogPost[] = BLOG_CATEGORIES.flatMap(
  (category) => category.items
);

export function getPost(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string): {
  prev?: BlogPost;
  next?: BlogPost;
} {
  const index = ALL_POSTS.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? ALL_POSTS[index - 1] : undefined,
    next: index < ALL_POSTS.length - 1 ? ALL_POSTS[index + 1] : undefined,
  };
}

export const DEFAULT_POST_SLUG = aboutTemplate.slug;

export const SIDEBAR_EXTRA = {
  name: "Template",
  icon: Boxes,
  items: [{ name: "Vengeance UI docs shell", href: "https://www.vengenceui.com/docs", external: true }],
};
