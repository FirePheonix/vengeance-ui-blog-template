"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/lib/blogs";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

type MindMapNode = {
  id: string;
  label: string;
  kind: "root" | "category" | "post";
  slug?: string;
};

type MindMapLink = {
  source: string;
  target: string;
};

export function BlogMindmap({ currentSlug }: { currentSlug: string }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const data = useMemo(() => {
    const nodes: MindMapNode[] = [{ id: "root", label: "Blogs", kind: "root" }];
    const links: MindMapLink[] = [];

    for (const category of BLOG_CATEGORIES) {
      const categoryId = `category:${category.name}`;
      nodes.push({ id: categoryId, label: category.name, kind: "category" });
      links.push({ source: "root", target: categoryId });

      for (const post of category.items) {
        const postId = `post:${post.slug}`;
        nodes.push({
          id: postId,
          label: post.title,
          kind: "post",
          slug: post.slug,
        });
        links.push({ source: categoryId, target: postId });
      }
    }

    return { links, nodes };
  }, []);

  const onNodeClick = useCallback(
    (node: object) => {
      const typed = node as MindMapNode;
      if (!typed.slug) return;
      setExpanded(false);
      router.push(`/${typed.slug}`);
    },
    [router]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">
          Blog web
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          aria-label="Expand blog web"
          onClick={() => setExpanded(true)}
        >
          <Expand className="size-4" />
        </Button>
      </div>
      <MindMapCanvas
        className="h-72"
        currentSlug={currentSlug}
        data={data}
        onNodeClick={onNodeClick}
      />

      {expanded ? (
        <div
          className="fixed inset-0 z-[320] flex items-center justify-center bg-black/30 p-4 backdrop-blur-md"
          onClick={() => setExpanded(false)}
        >
          <div
            className="relative h-[80vh] w-[min(1200px,96vw)] rounded-xl border border-neutral-200/80 bg-background/85 p-3 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950/80"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 z-10 size-8 text-neutral-600 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              aria-label="Close expanded blog web"
              onClick={() => setExpanded(false)}
            >
              <X className="size-4" />
            </Button>
            <MindMapCanvas
              className="h-full"
              currentSlug={currentSlug}
              data={data}
              onNodeClick={onNodeClick}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MindMapCanvas({
  className,
  currentSlug,
  data,
  onNodeClick,
}: {
  className: string;
  currentSlug: string;
  data: { nodes: MindMapNode[]; links: MindMapLink[] };
  onNodeClick: (node: object) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      setSize({
        width: Math.max(0, Math.floor(rect?.width ?? 0)),
        height: Math.max(0, Math.floor(rect?.height ?? 0)),
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${className} w-full overflow-hidden rounded-md border border-neutral-200/70 bg-neutral-50/40 dark:border-zinc-800 dark:bg-zinc-900/20`}
    >
      {size.width > 0 && size.height > 0 ? (
        <ForceGraph2D
          width={size.width}
          height={size.height}
          graphData={data}
          cooldownTicks={90}
          d3AlphaDecay={0.03}
          nodeRelSize={5}
          nodeColor={(node) => {
            const typed = node as MindMapNode;
            if (typed.kind === "root") return "#ffffff";
            if (typed.slug === currentSlug) return "#ffffff";
            if (typed.kind === "category") return "#9499a5";
            return "#6d7280";
          }}
          linkColor={() => "rgba(120,126,139,0.45)"}
          linkWidth={(link) =>
            ((link as { source: { id?: string } }).source?.id === "root" ? 1.15 : 0.95)
          }
          onNodeClick={onNodeClick}
          nodeCanvasObject={(node, ctx, scale) => {
            const typed = node as MindMapNode & { x?: number; y?: number };
            const x = typed.x ?? 0;
            const y = typed.y ?? 0;
            const radius =
              typed.kind === "root" ? 4.4 : typed.slug === currentSlug ? 4.1 : 3.3;
            const fontSize = Math.max(8, 11 / scale);
            const isActive = typed.slug === currentSlug;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle =
              typed.kind === "root" || isActive ? "#ffffff" : "rgba(146,154,170,0.9)";
            ctx.fill();

            if (typed.kind !== "post") return;
            ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillStyle = isActive ? "#ffffff" : "rgba(148,153,165,0.95)";
            ctx.fillText(typed.label, x + radius + 4, y);
          }}
        />
      ) : null}
    </div>
  );
}
