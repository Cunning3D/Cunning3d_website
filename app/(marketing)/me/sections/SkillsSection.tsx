import type { MeSkillGroup } from '@/config/me';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function SkillsSection({
  id,
  title,
  groups,
  className,
}: {
  id?: string;
  title: string;
  groups: MeSkillGroup[];
  className?: string;
}) {
  if (!groups?.length) return null;

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">{title}</h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.name} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <CardHeader className="relative pb-3">
              <CardTitle className="text-base">{group.name}</CardTitle>
            </CardHeader>
            <CardContent className="relative flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
