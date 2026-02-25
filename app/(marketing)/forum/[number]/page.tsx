import { notFound } from "next/navigation";
import { ForumThreadClient } from "@/components/forum/forum-thread-client";

export default async function ForumThreadPage({
  params,
}: {
  params?: Promise<{ number?: string }>;
}) {
  const p = await params;
  const n = Number.parseInt(String(p?.number || ""), 10);
  if (!Number.isFinite(n) || n <= 0) notFound();
  return <ForumThreadClient number={n} />;
}

