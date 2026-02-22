import type { MeEducationItem } from '@/config/me';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function EducationSection({
  id,
  title,
  items,
  className,
}: {
  id?: string;
  title: string;
  items: MeEducationItem[];
  className?: string;
}) {
  if (!items?.length) return null;

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">{title}</h2>

      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.school}-${item.degree}`} className="relative">
              <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                <CardContent className="relative p-5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="min-w-0">
                      <div className="font-semibold leading-tight">{item.school}</div>
                      <div className="text-sm text-muted-foreground">{item.degree}</div>
                    </div>
                    {item.start || item.end ? (
                      <div className="text-sm text-muted-foreground shrink-0">
                        {item.start ?? ''}{item.start && item.end ? ' – ' : ''}{item.end ?? ''}
                      </div>
                    ) : null}
                  </div>
                  {item.detail ? (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
