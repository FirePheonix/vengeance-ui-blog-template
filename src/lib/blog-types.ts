export type TOCHeading = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export type BlogPost = {
  slug: string;
  segments: string[];
  href: string;
  title: string;
  description: string;
  author: string;
  inspiredBy: string;
  date: string;
  readingTime: string;
  isNew?: boolean;
  category: string;
  markdown: string;
  headings: TOCHeading[];
};

export type BlogNavItem = {
  title: string;
  href: string;
  isNew?: boolean;
};

export type BlogCategory = {
  name: string;
  items: BlogNavItem[];
};

export type BlogLink = {
  title: string;
  href: string;
  category: string;
};
