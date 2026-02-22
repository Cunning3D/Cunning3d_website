import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as FilesComponents from 'fumadocs-ui/components/files';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Drawio } from '@/components/mdx/drawio';
import { Children, type ReactNode } from 'react';
import {
  AppWindow,
  Boxes,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  Package,
  PanelsTopLeft,
  SlidersHorizontal,
  Terminal,
} from 'lucide-react';
import { Feedback, FeedbackBlock } from '@/components/components/feedback/client';
import { sendBlockFeedbackAction, sendPageFeedbackAction } from '@/lib/feedback-actions';
import { Lang } from '@/components/mdx/lang';
import { VersionSwitcher } from '@/components/docs/version-switcher';
import { localizeTreeLabel, type DocLocale } from '@/lib/docs-i18n';

type MDXComponents = Record<string, any>;

function localizeHeadingChildren(children: ReactNode, locale?: DocLocale): ReactNode {
  if (locale !== 'zh') return children;
  return Children.map(children, (child) => {
    if (typeof child !== 'string') return child;
    return localizeTreeLabel(child, 'zh') as string;
  });
}

export function getMDXComponents(components?: MDXComponents, opts?: { locale?: DocLocale }) {
  const locale = opts?.locale;
  const BaseH2 = defaultMdxComponents.h2;
  const BaseH3 = defaultMdxComponents.h3;
  const BaseH4 = defaultMdxComponents.h4;
  return {
    ...defaultMdxComponents,
    h2: (props: any) => (
      <BaseH2 {...props}>{localizeHeadingChildren(props.children, locale)}</BaseH2>
    ),
    h3: (props: any) => (
      <BaseH3 {...props}>{localizeHeadingChildren(props.children, locale)}</BaseH3>
    ),
    h4: (props: any) => (
      <BaseH4 {...props}>{localizeHeadingChildren(props.children, locale)}</BaseH4>
    ),
    ...TabsComponents,
    ...FilesComponents,
    Accordion,
    Accordions,
    Step,
    Steps,
    Drawio,
    CpuIcon: Cpu,
    Cpu,
    Database,
    PanelsTopLeft,
    Terminal,
    Boxes,
    Package,
    GitBranch,
    Layers,
    Globe,
    AppWindow,
    SlidersHorizontal,
    Lang,
    VersionSwitcher,
    Feedback: (props: any) => <Feedback {...props} onSendAction={sendPageFeedbackAction} />,
    FeedbackBlock: ({ children, ...props }: any) => (
      <FeedbackBlock {...props} onSendAction={sendBlockFeedbackAction}>
        {children}
      </FeedbackBlock>
    ),
    ...components,
  } satisfies MDXComponents;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
