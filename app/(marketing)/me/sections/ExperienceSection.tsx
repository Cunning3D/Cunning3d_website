import type { MeExperienceItem } from '@/config/me';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ExperienceSection({
  id,
  title,
  items,
  className,
}: {
  id?: string;
  title: string;
  items: MeExperienceItem[];
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
            <div key={`${item.company}-${item.role}-${item.start}`} className="relative">
              <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                <CardContent className="relative p-5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="min-w-0">
                      <div className="font-semibold leading-tight truncate">{item.role}</div>
                      <div className="text-sm text-muted-foreground">
                        <span>{item.company}</span>
                        {item.location ? <span> · {item.location}</span> : null}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground shrink-0">
                      {item.start} – {item.end}
                    </div>
                  </div>

                  {item.summary ? (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
                  ) : null}

                  {item.bullets?.length ? (
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-sm leading-relaxed">
                      {item.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  ) : null}

                  {item.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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
