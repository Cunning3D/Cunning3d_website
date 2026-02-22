import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CopyButton } from '../components/CopyButton';

export function ContactSection({
  id,
  title,
  subtitle,
  email,
  sendEmailLabel,
  copyEmailLabel,
  copiedTitle,
  copiedDescription,
  className,
}: {
  id?: string;
  title: string;
  subtitle: string;
  email: string;
  sendEmailLabel: string;
  copyEmailLabel: string;
  copiedTitle: string;
  copiedDescription: string;
  className?: string;
}) {
  if (!email) return null;

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4">{title}</h2>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <CardContent className="relative p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-lg font-semibold break-all">{email}</div>
              <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <CopyButton
                value={email}
                label={copyEmailLabel}
                copiedTitle={copiedTitle}
                copiedDescription={copiedDescription}
              />
              <a
                className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
                href={`mailto:${email}`}
              >
                {sendEmailLabel}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
