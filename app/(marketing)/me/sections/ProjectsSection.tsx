import type { MeProjectItem } from '@/config/me';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ProjectsSection({
  id,
  title,
  items,
  className,
}: {
  id?: string;
  title: string;
  items: MeProjectItem[];
  className?: string;
}) {
  if (!items?.length) return null;

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">{title}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((project) => (
          <Card key={project.name} className="relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <CardHeader className="relative space-y-2">
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4 flex-1">
              {project.highlights?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed">
                  {project.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              ) : null}

              {project.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </CardContent>
            {project.links?.length ? (
              <CardFooter className="relative gap-2 flex-wrap">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                  >
                    {link.label}
                  </a>
                ))}
              </CardFooter>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
}
