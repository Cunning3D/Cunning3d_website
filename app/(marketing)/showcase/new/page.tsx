import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ShowcaseNewPage() {
  const t = await getTranslations("showcase");
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      <div className="container py-12">
        <div className="max-w-3xl">
          <div className="text-xs text-muted-foreground mb-2">{t("newPage.breadcrumb")}</div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {t("newPage.title")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t("newPage.desc")}
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/showcase"
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              {t("newPage.backToShowcase")}
            </Link>
            <Link
              href="/showcase/submit"
              className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              {t("newPage.submitCda")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
