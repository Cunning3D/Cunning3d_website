'use client';

import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  label: string;
}

const ACTIVE_LAYOUT_ID = 'me-toc-active';

export function TocNav({ items }: { items: TocItem[] }) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(() => items[0]?.id ?? '');

  useEffect(() => {
    if (!items.length) return;
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && items.some((i) => i.id === hash)) {
      setActiveId(hash);
      return;
    }
    if (!activeId) setActiveId(items[0].id);
  }, [activeId, items]);

  useEffect(() => {
    if (!items.length) return;

    const elements = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;

        const best = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];
        const id = (best.target as HTMLElement).id;
        if (id) setActiveId(id);
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const onClick = useCallback(
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      setActiveId(id);

      const href = `#${id}`;
      try {
        history.pushState(null, '', href);
      } catch {
        // ignore
      }

      const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [],
  );

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 650, damping: 45, mass: 0.7 };

  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={onClick(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative isolate rounded-md px-2 py-1 text-sm transition-colors',
              isActive
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={ACTIVE_LAYOUT_ID}
                className="pointer-events-none absolute inset-0 z-0 rounded-md bg-accent"
                transition={transition}
              />
            ) : null}
            <span className="relative z-10">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
