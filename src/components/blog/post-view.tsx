import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  BlogArticle,
  BlogCodeBlock,
  BlogHeader,
} from "@/components/blog/article";
import { MermaidDiagram } from "@/components/blog/mermaid-diagram";
import type { BlogPost, TOCHeading } from "@/lib/blog-types";
import { getAdjacentPosts } from "@/lib/blog-server";

function flattenText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(flattenText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const withChildren = node as { props?: { children?: React.ReactNode } };
    return flattenText(withChildren.props?.children ?? "");
  }

  return "";
}

export function BlogPostView({
  post,
  markdown,
  headings,
}: {
  post: BlogPost;
  markdown: string;
  headings: TOCHeading[];
}) {
  const { prev, next } = getAdjacentPosts(post.slug);
  let headingIndex = 0;

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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          disallowedElements={["script"]}
          unwrapDisallowed
          components={{
            h2: ({ children }) => {
              const heading = headings[headingIndex++];
              return (
                <h2
                  id={heading?.id}
                  className="scroll-mt-24 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white"
                >
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const heading = headings[headingIndex++];
              return (
                <h3
                  id={heading?.id}
                  className="scroll-mt-24 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white"
                >
                  {children}
                </h3>
              );
            },
            p: ({ children }) => (
              <p className="max-w-4xl text-base leading-7 text-neutral-700 dark:text-zinc-300">
                {children}
              </p>
            ),
            blockquote: ({ children }) => (
              <blockquote className="max-w-4xl border-l-2 border-neutral-300 pl-4 text-base leading-7 text-neutral-600 italic dark:border-zinc-700 dark:text-zinc-400">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="max-w-4xl list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700 dark:text-zinc-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="max-w-4xl list-decimal space-y-2 pl-5 text-base leading-7 text-neutral-700 dark:text-zinc-300">
                {children}
              </ol>
            ),
            code: ({ className, children }) => {
              const language = className?.startsWith("language-")
                ? className.replace("language-", "")
                : undefined;
              const rawCode = flattenText(children).replace(/\n$/, "");
              const isInline = !className?.includes("language-");

              if (isInline) {
                return (
                  <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.92em] text-neutral-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {children}
                  </code>
                );
              }

              if (language === "mermaid") {
                return <MermaidDiagram chart={rawCode} />;
              }

              return <BlogCodeBlock code={rawCode} title={language} />;
            },
            img: ({ src, alt }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src ?? ""}
                alt={alt ?? ""}
                loading="lazy"
                className="w-full max-w-4xl rounded-md border border-neutral-300 bg-background object-cover p-1 shadow-[0_18px_44px_rgba(15,15,18,0.12)] dark:border-zinc-700 dark:bg-zinc-950 dark:shadow-[0_18px_44px_rgba(0,0,0,0.45)]"
              />
            ),
            video: ({ src, children }) => (
              <div className="w-full max-w-4xl overflow-hidden rounded-md border border-neutral-300 bg-background shadow-[0_18px_44px_rgba(15,15,18,0.12)] dark:border-zinc-700 dark:bg-zinc-950 dark:shadow-[0_18px_44px_rgba(0,0,0,0.45)]">
                <video
                  controls
                  preload="metadata"
                  playsInline
                  src={typeof src === "string" ? src : undefined}
                  className="block w-full bg-black"
                >
                  {children}
                </video>
              </div>
            ),
            script: () => null,
            a: ({ href, children }) => {
              const isVideoLink =
                typeof href === "string" &&
                /\.(mp4|webm|ogg)(\?.*)?$/i.test(href);

              if (isVideoLink) {
                return (
                  <div className="w-full max-w-4xl overflow-hidden rounded-md border border-neutral-300 bg-background shadow-[0_18px_44px_rgba(15,15,18,0.12)] dark:border-zinc-700 dark:bg-zinc-950 dark:shadow-[0_18px_44px_rgba(0,0,0,0.45)]">
                    <video
                      controls
                      preload="metadata"
                      playsInline
                      src={href}
                      className="block w-full bg-black"
                    />
                  </div>
                );
              }

              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      <nav className="flex max-w-4xl items-start justify-between gap-6 border-t border-neutral-200 pt-8 dark:border-zinc-800">
        {prev ? (
          <Link
            href={prev.href}
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
            href={next.href}
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
