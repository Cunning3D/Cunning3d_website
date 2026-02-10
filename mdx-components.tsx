import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as FilesComponents from 'fumadocs-ui/components/files';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Drawio } from '@/components/mdx/drawio';
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

type MDXComponents = Record<string, any>;

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
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
