import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blog-types";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";
import { getPostThumbnail, resolveThumbnailUrl } from "@/lib/thumbnail";

const DEFAULT_OG_IMAGE = "/vengeance-image.png";
const SITE_NAME = "Vengeance Blog";

function resolveCustomThumbnail(post: BlogPost) {
  const image = getPostThumbnail(post);
  if (!image) return undefined;

  return resolveThumbnailUrl(image, absoluteUrl);
}

function resolveGeneratedThumbnail(post: BlogPost) {
  return absoluteUrl(`/og/${post.slug}`);
}

export function buildPostMetadata(post: BlogPost): Metadata {
  const url = absoluteUrl(post.href);
  const thumbnail =
    resolveCustomThumbnail(post) ?? resolveGeneratedThumbnail(post);

  const imageMeta = [
    {
      url: thumbnail,
      width: 1200,
      height: 630,
      alt: post.title,
    },
  ];

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      images: imageMeta,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: imageMeta.map((item) => item.url),
    },
  };
}

export function buildSiteMetadata(): Metadata {
  const image = absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: "Vengeance Blog Template",
      template: `%s | ${SITE_NAME}`,
    },
    description:
      "Docs-shell blog template — markdown posts with folder routing, TOC, and mind web.",
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: "Vengeance Blog Template",
      description:
        "Docs-shell blog template — markdown posts with folder routing, TOC, and mind web.",
      images: [{ url: image, alt: "Vengeance Blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Vengeance Blog Template",
      description:
        "Docs-shell blog template — markdown posts with folder routing, TOC, and mind web.",
      images: [image],
    },
  };
}
