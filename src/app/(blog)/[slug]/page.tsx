import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/blog/post-view";
import { TableOfContents } from "@/components/layout/toc";
import { ALL_POSTS, getPost } from "@/lib/blogs";

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

  const tocItems = post.sections
    .filter((block) => block.type === "heading")
    .map((block) => {
      if (block.type !== "heading") {
        return { id: "", title: "", depth: 2 };
      }
      return {
        id: block.id,
        title: block.title,
        depth: block.depth ?? 2,
      };
    });

  return (
    <>
      <main className="relative min-w-0 py-8 md:pl-8 lg:pl-12 xl:pl-20">
        <div className="w-full min-w-0 max-w-6xl">
          <BlogPostView post={post} />
        </div>
      </main>
      <TableOfContents items={tocItems} />
    </>
  );
}
