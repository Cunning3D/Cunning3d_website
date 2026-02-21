import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import 'fumadocs-ui/style.css';
import { LocaleToggle } from '@/components/locale-toggle';
import { DocsSectionTheme } from '@/components/docs/section-theme';
import { getLocale } from 'next-intl/server';
import { localizeTreeLabel } from '@/lib/docs-i18n';

function getSection(urlOrPath: string | undefined): string {
  const p = (urlOrPath ?? '').replaceAll('\\', '/');
  if (p.includes('/docs/nodes') || p.includes('/nodes/')) return 'nodes';
  if (p.includes('/docs/cda') || p.includes('/cda/')) return 'cda';
  if (p.includes('/docs/cgraph') || p.includes('/cgraph/')) return 'cgraph';
  if (p.includes('/docs/platforms') || p.includes('/platforms/')) return 'platforms';
  if (p.includes('/docs/dev') || p.includes('/dev/')) return 'dev';
  return 'core';
}

function localizePageTree(tree: any, locale: string): any {
  if (!tree) return tree;
  if (Array.isArray(tree)) return tree.map((n) => localizePageTree(n, locale));
  if (typeof tree !== 'object') return tree;

  const out: any = { ...tree };
  // Fumadocs pageTree nodes typically use `name` for display.
  if ('name' in out) out.name = localizeTreeLabel(out.name, locale === 'zh' ? 'zh' : 'en');
  if ('children' in out && Array.isArray(out.children)) {
    out.children = out.children.map((n: any) => localizePageTree(n, locale));
  }
  return out;
}

export default async function Layout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <RootProvider>
      <DocsSectionTheme>
        <DocsLayout
          tree={localizePageTree(source.pageTree, locale)}
          nav={{
            title: 'Cunning3D Docs',
            children: (
              <div className="flex items-center justify-end gap-2">
                <LocaleToggle />
              </div>
            ),
          }}
          sidebar={{
            tabs: {
              transform(option, node) {
                if (!node.icon) return option;
                const section = getSection((node as any)?.url ?? (option as any)?.url);
                const color = `var(--${section}-color, var(--color-fd-foreground))`;

                return {
                  ...option,
                  icon: (
                    <div
                      className="rounded-lg p-1.5 border [&_svg]:size-5 transition-colors"
                      style={{
                        color,
                        borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
                        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
                      }}
                    >
                      {node.icon}
                    </div>
                  ),
                };
              },
            },
          }}
        >
          {children}
        </DocsLayout>
      </DocsSectionTheme>
    </RootProvider>
  );
}
