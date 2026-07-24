import Link from "next/link";
import {
  BlogArticle,
  BlogCodeBlock,
  BlogHeader,
  BlogList,
  BlogParagraph,
  BlogQuote,
} from "@/components/blog/article";
import type { BlogPost } from "@/lib/blogs";
import { getAdjacentPosts } from "@/lib/blogs";
import { cn } from "@/lib/utils";

export function BlogPostView({ post }: { post: BlogPost }) {
  const { prev, next } = getAdjacentPosts(post.slug);

  return (
    <BlogArticle>
      <BlogHeader
        title={post.title}
        description={post.description}
        meta={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500 dark:text-zinc-500">
            <span>{post.author}</span>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
            <span aria-hidden>·</span>
            <span>Inspired by {post.inspiredBy}</span>
          </div>
        }
      />

      <div className="space-y-6">
        {post.sections.map((block, index) => {
          const key = `${post.slug}-${block.type}-${index}`;

          if (block.type === "heading") {
            const depth = block.depth ?? 2;
            const Tag = depth >= 3 ? "h3" : "h2";
            return (
              <Tag
                key={key}
                id={block.id}
                className={cn(
                  "scroll-mt-24 tracking-tight text-neutral-950 dark:text-white",
                  depth >= 3
                    ? "text-xl font-semibold"
                    : "text-2xl font-bold"
                )}
              >
                {block.title}
              </Tag>
            );
          }

          if (block.type === "paragraph") {
            return <BlogParagraph key={key}>{block.text}</BlogParagraph>;
          }

          if (block.type === "code") {
            return (
              <BlogCodeBlock key={key} code={block.code} title={block.title} />
            );
          }

          if (block.type === "list") {
            return <BlogList key={key} items={block.items} />;
          }

          if (block.type === "quote") {
            return (
              <BlogQuote key={key} cite={block.cite}>
                {block.text}
              </BlogQuote>
            );
          }

          return null;
        })}
      </div>

      <nav className="flex max-w-4xl items-start justify-between gap-6 border-t border-neutral-200 pt-8 dark:border-zinc-800">
        {prev ? (
          <Link
            href={`/${prev.slug}`}
            className="group max-w-[45%] space-y-1 text-left"
          >
            <span className="text-xs uppercase tracking-wide text-neutral-500 dark:text-zinc-500">
              Previous
            </span>
            <span className="block text-sm font-medium text-neutral-900 group-hover:underline dark:text-zinc-100">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/${next.slug}`}
            className="group max-w-[45%] space-y-1 text-right"
          >
            <span className="text-xs uppercase tracking-wide text-neutral-500 dark:text-zinc-500">
              Next
            </span>
            <span className="block text-sm font-medium text-neutral-900 group-hover:underline dark:text-zinc-100">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </BlogArticle>
  );
}
