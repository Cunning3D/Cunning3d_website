import type { Metadata } from "next";
import { ShowcaseClient, type ShowcaseItem } from "@/components/showcase/showcase-client";
import { getTranslations } from "next-intl/server";
import examplesIndex from "@/public/examples/index.json";

function readExamplesIndex(): ShowcaseItem[] {
  const json = examplesIndex as unknown as { items?: ShowcaseItem[] };
  return Array.isArray(json.items) ? json.items : [];
}

export default async function ShowcasePage() {
  const items = readExamplesIndex();
  return <ShowcaseClient items={items} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("showcase");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}
