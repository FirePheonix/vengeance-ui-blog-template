import { redirect } from "next/navigation";
import { DEFAULT_POST_SLUG } from "@/lib/blogs";

export default function HomePage() {
  redirect(`/${DEFAULT_POST_SLUG}`);
}
