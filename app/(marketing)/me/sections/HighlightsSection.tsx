import type { MeHighlightItem } from '@/config/me';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function HighlightsSection({
  id,
  title,
  items,
  className,
}: {
  id?: string;
  title: string;
  items: MeHighlightItem[];
  className?: string;
}) {
  if (!items?.length) return null;

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={`${item.label}-${item.value}`} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <CardContent className="relative p-5">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="mt-2 text-2xl font-bold tracking-tight">{item.value}</div>
              {item.detail && <div className="mt-2 text-sm text-muted-foreground">{item.detail}</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
