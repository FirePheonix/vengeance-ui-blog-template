export function resolveThumbnailSrc(thumbnail: string) {
  if (/^https?:\/\//i.test(thumbnail)) {
    return thumbnail;
  }

  return thumbnail.startsWith("/") ? thumbnail : `/${thumbnail}`;
}

export function resolveThumbnailUrl(
  thumbnail: string,
  toAbsolute: (path: string) => string,
) {
  if (/^https?:\/\//i.test(thumbnail)) {
    return thumbnail;
  }

  return toAbsolute(resolveThumbnailSrc(thumbnail));
}

export function getPostThumbnail(post: {
  thumbnail?: string;
  ogImage?: string;
}) {
  return post.thumbnail ?? post.ogImage;
}
