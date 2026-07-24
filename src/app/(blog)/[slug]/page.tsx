import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/blog/post-view";
import { TableOfContents } from "@/components/layout/toc";
import {
  ALL_POSTS,
  getMarkdownHeadings,
  getPost,
  getPostMarkdown,
} from "@/lib/blogs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ALL_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const markdown = getPostMarkdown(post);
  const tocItems = getMarkdownHeadings(markdown);

  return (
    <>
      <main className="relative min-w-0 py-8 md:pl-8 lg:pl-12 xl:pl-20">
        <div className="w-full min-w-0 max-w-6xl">
          <BlogPostView post={post} markdown={markdown} headings={tocItems} />
        </div>
      </main>
      <TableOfContents
        items={tocItems}
        blogLinks={ALL_POSTS.map((entry) => ({
          href: `/${entry.slug}`,
          title: entry.title,
        }))}
        activeBlogHref={`/${post.slug}`}
      />
    </>
  );
}
