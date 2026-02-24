import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { ShowcaseClient, type ShowcaseItem } from "@/components/showcase/showcase-client";
import { getTranslations } from "next-intl/server";

async function readExamplesIndex(): Promise<ShowcaseItem[]> {
  try {
    const p = path.join(process.cwd(), "public", "examples", "index.json");
    const txt = await fs.readFile(p, "utf8");
    const json = JSON.parse(txt) as { items?: ShowcaseItem[] };
    return Array.isArray(json.items) ? json.items : [];
  } catch {
    return [];
  }
}

export default async function ShowcasePage() {
  const items = await readExamplesIndex();
  return <ShowcaseClient items={items} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("showcase");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}
