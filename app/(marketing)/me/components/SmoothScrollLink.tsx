'use client';

import { cn } from '@/lib/utils';
import { useCallback } from 'react';

export function SmoothScrollLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!href.startsWith('#')) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();

      try {
        history.pushState(null, '', href);
      } catch {
        // ignore
      }

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [href],
  );

  return (
    <a href={href} className={cn(className)} onClick={onClick}>
      {children}
    </a>
  );
}

