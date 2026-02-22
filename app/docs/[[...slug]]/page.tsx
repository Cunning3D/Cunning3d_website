import { source } from '@/lib/source';
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from 'fumadocs-ui/page';
import { getMDXComponents } from '@/mdx-components';
import { notFound } from 'next/navigation';
import { VersionSwitcher } from '@/components/docs/version-switcher';
import { getLocale } from 'next-intl/server';
import { localizeDocDescription, localizeDocTitle, localizeTreeLabel } from '@/lib/docs-i18n';

const VERSION_LIST = ['v1.2', 'v1.1', 'v1.0'];
type Version = 'v1.2' | 'v1.1' | 'v1.0';
const LATEST = 'v1.2';

interface PageProps { params: Promise<{ slug?: string[] }> }

// Detect current version from slug
function detectVersion(slug?: string[]): Version {
  if (!slug || slug.length < 1) return LATEST;
  const match = VERSION_LIST.find((v) => slug[0] === v);
  return (match as Version) || LATEST;
}

// Get the node name from slug (e.g., ['nodes', 'boolean'] -> 'boolean', ['v1.1', 'nodes', 'boolean'] -> 'boolean')
function getNodeName(slug?: string[]): string | null {
  if (!slug) return null;
  const nodesIdx = slug.indexOf('nodes');
  if (nodesIdx === -1 || nodesIdx >= slug.length - 1) return null;
  return slug[nodesIdx + 1];
}

// Check which versions have docs for this node
function getAvailableVersions(nodeName: string): string[] {
  const available: string[] = [];
  // Check latest (no version prefix)
  if (source.getPage(['nodes', nodeName])) available.push(LATEST);
  // Check versioned paths
  for (const v of VERSION_LIST) {
    if (v === LATEST) continue;
    if (source.getPage([v, 'nodes', nodeName])) available.push(v);
  }
  return available.length > 0 ? available : [LATEST];
}

function localizeToc(toc: any, locale: 'en' | 'zh') {
  if (!toc || locale !== 'zh') return toc;
  if (!Array.isArray(toc)) return toc;
  return toc.map((item) => {
    if (!item || typeof item !== 'object') return item;
    if (typeof item.title !== 'string') return item;
    return { ...item, title: localizeTreeLabel(item.title, 'zh') as string };
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const locale = (await getLocale()) as 'en' | 'zh';
  const url = (page as any).url as string | undefined;
  const title = localizeDocTitle(url, page.data.title, locale);
  const description = localizeDocDescription(url, page.data.description, locale);

  const { body: MDX, toc } = await page.data.load();
  const localizedToc = localizeToc(toc, locale);
  const nodeName = getNodeName(slug);
  const isNodeDoc = !!nodeName && nodeName !== 'index';
  const currentVersion = detectVersion(slug);
  const availableVersions = nodeName ? getAvailableVersions(nodeName) : [];
  const showVersionSwitcher = isNodeDoc && availableVersions.length > 1;
  const since = (page.data as any).since;

  return (
    <DocsPage toc={localizedToc} tableOfContent={{ style: 'clerk' }}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <DocsTitle>{title}</DocsTitle>
        {isNodeDoc && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
            {since && <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5">Since {since}</span>}
            {showVersionSwitcher && <VersionSwitcher currentVersion={currentVersion} availableVersions={availableVersions} />}
            {!showVersionSwitcher && <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5">{currentVersion}</span>}
          </div>
        )}
      </div>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents(undefined, { locale })} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() { return source.generateParams(); }

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const locale = (await getLocale()) as 'en' | 'zh';
  const url = (page as any).url as string | undefined;
  return {
    title: localizeDocTitle(url, page.data.title, locale),
    description: localizeDocDescription(url, page.data.description, locale),
  };
}
