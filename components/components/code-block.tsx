import * as Base from 'fumadocs-ui/components/codeblock';
import { highlight } from 'fumadocs-core/highlight';
import { cn } from '@/lib/cn';
import type { BundledLanguage } from 'shiki';

export interface CodeBlockProps {
  code: string;
  wrapper?: Base.CodeBlockProps;
  lang: string;
}

export async function CodeBlock({ code, lang, wrapper }: CodeBlockProps) {
  const rendered = await highlight(code, {
    lang: lang as BundledLanguage,
    defaultColor: false,
    themes: {
      light: 'github-light',
      dark: 'vesper',
    },
    // Ensure our `pre` wrapper matches Fumadocs UI styling.
    components: {
      pre: Base.Pre,
    },
  });

  return (
    <Base.CodeBlock {...wrapper} className={cn('my-0', wrapper?.className)}>
      {rendered}
    </Base.CodeBlock>
  );
}
