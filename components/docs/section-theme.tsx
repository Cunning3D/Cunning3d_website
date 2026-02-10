'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

function getSectionFromPathname(pathname: string | null): string {
  const p = (pathname ?? '').replaceAll('\\', '/');
  if (p.startsWith('/docs/nodes')) return 'nodes';
  if (p.startsWith('/docs/cda')) return 'cda';
  if (p.startsWith('/docs/cgraph')) return 'cgraph';
  if (p.startsWith('/docs/platforms')) return 'platforms';
  if (p.startsWith('/docs/dev')) return 'dev';
  return 'core';
}

export function DocsSectionTheme({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const section = getSectionFromPathname(pathname);
  return <div className={section}>{children}</div>;
}

