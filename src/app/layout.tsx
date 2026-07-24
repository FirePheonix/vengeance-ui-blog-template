import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { getAllPosts, getBlogCategories, getBlogLinks, getDefaultPostPath } from "@/lib/blog-server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vengeance Blog Template",
    template: "%s | Vengeance Blog",
  },
  description:
    "Docs-shell blog template ported from Vengeance UI — Next.js + Tailwind v4 with a left index of sample technical essays.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts();
  const categories = getBlogCategories(posts);
  const links = getBlogLinks(posts);
  const homeHref = getDefaultPostPath();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${geistSans.className} flex min-h-screen flex-col antialiased selection:bg-foreground selection:text-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar categories={categories} links={links} homeHref={homeHref} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
