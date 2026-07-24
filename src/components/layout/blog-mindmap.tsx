"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  type MutableRefObject,
} from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<unknown>(null) as MutableRefObject<{
    d3Force: (forceName: string, force: unknown) => void;
  } | null>;
  const [width, setWidth] = useState(0);

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

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.max(0, Math.floor(nextWidth)));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const onNodeClick = useCallback(
    (node: object) => {
      const typed = node as MindMapNode;
      if (!typed.slug) return;
      router.push(`/${typed.slug}`);
    },
    [router]
  );

  return (
    <div className="space-y-3">
      <div className="px-1 text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">
        Blog web
      </div>
      <div
        ref={containerRef}
        className="h-52 w-full overflow-hidden rounded-md border border-neutral-200/70 bg-neutral-50/40 dark:border-zinc-800 dark:bg-zinc-900/20"
      >
        {width > 0 ? (
          <ForceGraph2D
            ref={graphRef}
            width={width}
            height={208}
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
    </div>
  );
}
