export type MeLocale = 'en' | 'zh';

export interface MeHighlightItem {
  label: string;
  value: string;
  detail?: string;
}

export interface MeExperienceItem {
  company: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  summary?: string;
  bullets: string[];
  tags?: string[];
}

export interface MeProjectLink {
  label: string;
  href: string;
}

export interface MeProjectItem {
  name: string;
  description: string;
  highlights?: string[];
  tags?: string[];
  links?: MeProjectLink[];
}

export interface MeSkillGroup {
  name: string;
  items: string[];
}

export interface MeEducationItem {
  school: string;
  degree: string;
  start?: string;
  end?: string;
  detail?: string;
}

export interface MeProfile {
  name: string;
  title: string;
  location: string;
  email: string;
  avatarSrc?: string;
  bio: string;
  interests?: string[];
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface MePageConfig {
  meta: {
    title: string;
    description: string;
  };
  tocTitle: string;
  profile: MeProfile;
  highlights: {
    title: string;
    items: MeHighlightItem[];
  };
  experience: {
    title: string;
    items: MeExperienceItem[];
  };
  projects: {
    title: string;
    items: MeProjectItem[];
  };
  skills: {
    title: string;
    groups: MeSkillGroup[];
  };
  education: {
    title: string;
    items: MeEducationItem[];
  };
  contact: {
    title: string;
    subtitle: string;
    sendEmail: string;
    copyEmail: string;
    downloadPdf: string;
    copiedTitle: string;
    copiedDescription: string;
  };
}

export const mePageByLocale: Record<MeLocale, MePageConfig> = {
  en: {
    meta: {
      title: 'About',
      description: 'PCG developer / technical artist focused on tools and pipelines.',
    },
    tocTitle: 'Sections',
    profile: {
      name: 'Your Name',
      title: 'PCG Developer / Technical Artist',
      location: 'Shanghai, China',
      email: 'you@example.com',
      avatarSrc:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'PCG developer / technical artist specialized in procedural systems and production pipelines for games. Strong at bridging art and engineering with maintainable, reusable tooling (C++ / Rust / C#).',
      interests: ['PCG', 'Procedural Tools', 'Pipelines', 'Geometry'],
    },
    highlights: {
      title: 'Highlights',
      items: [
        { label: 'Focus', value: 'PCG · Tools · Pipeline', detail: 'Production-ready systems for content teams' },
        { label: 'Stack', value: 'C++ · Rust · C#', detail: 'Engine/runtime + editor tooling' },
        { label: 'Experience', value: '4+ years', detail: 'Game development & technical art' },
      ],
    },
    experience: {
      title: 'Experience',
      items: [
        {
          company: 'NetEase Games',
          role: 'PCG Roads System Owner · Tech Center · Leihuo “Infinite”',
          start: '2021.07',
          end: '2024.05',
          location: 'Shanghai',
          summary: 'Owned the PCG road system and a production asset packaging pipeline.',
          bullets: [
            'Independently built the PCG road system end-to-end: core data structures, generation logic, editor workflow, and integration points.',
            'Developed an art asset packaging pipeline: asset validation, dependency handling, standardized outputs, and automation for stable delivery.',
            'Partnered with artists/level designers/engine teams to align formats, iterate on usability, and ship tooling into daily production.',
          ],
          tags: ['C++', 'C#', 'PCG', 'Tooling', 'Pipeline'],
        },
        {
          company: 'miao',
          role: 'Technical Art Lead',
          start: '2024.05',
          end: '2025.07',
          location: 'Shanghai',
          bullets: [
            'Led the technical art team to support production with tools, pipelines, and workflow improvements.',
            'Established asset standards and automated checks to reduce rework and improve content consistency.',
            'Coordinated cross-functionally to drive implementation and adoption of tools.',
          ],
          tags: ['Technical Art', 'Pipeline', 'Tools'],
        },
        {
          company: 'miHoYo',
          role: 'PCG Engineer · “Rain City”',
          start: '2025.07',
          end: 'Present',
          location: 'Shanghai',
          summary: 'PCG development for “Rain City”.',
          bullets: [
            'Developing PCG systems and related tooling for game content production.',
            'Collaborating with content teams to iterate toward reusable, configurable building blocks.',
          ],
          tags: ['C++', 'Rust', 'PCG'],
        },
      ],
    },
    projects: {
      title: 'Selected Projects',
      items: [
        {
          name: 'PCG Road System',
          description: 'A procedural road generation & editing system designed for level production.',
          highlights: [
            'End-to-end ownership from design to implementation and iteration with content teams.',
            'Emphasis on maintainability, reusability, and predictable results for production.',
          ],
          tags: ['PCG', 'C++', 'Tools'],
        },
        {
          name: 'Art Asset Packaging Pipeline',
          description: 'A packaging/validation pipeline for art assets to improve delivery quality and consistency.',
          highlights: ['Automated validation and standardized outputs for stable integration.'],
          tags: ['Pipeline', 'C#', 'Automation'],
        },
        {
          name: '“Rain City” PCG',
          description: 'PCG systems and tooling for the “Rain City” project.',
          tags: ['PCG', 'C++', 'Rust'],
        },
      ],
    },
    skills: {
      title: 'Skills',
      groups: [
        { name: 'Languages', items: ['C++', 'Rust', 'C#'] },
        { name: 'PCG', items: ['Procedural Systems', 'Tooling Workflow', 'Deterministic Pipelines'] },
        { name: 'Production', items: ['Asset Pipeline', 'Validation', 'Automation'] },
      ],
    },
    education: {
      title: 'Education',
      items: [
        {
          school: 'Shanghai Institute of Visual Arts',
          degree: 'B.A. in Arts & Crafts',
        },
        {
          school: 'Shanghai International Studies University',
          degree: 'Dual degree in English Linguistics',
        },
      ],
    },
    contact: {
      title: 'Contact',
      subtitle: 'Prefer email. I typically reply within 24–48 hours.',
      sendEmail: 'Send email',
      copyEmail: 'Copy email',
      downloadPdf: 'Download PDF',
      copiedTitle: 'Copied',
      copiedDescription: 'Email address copied to clipboard.',
    },
  },
  zh: {
    meta: {
      title: '关于我',
      description: 'PCG 开发/技术美术：程序化系统与工具链、生产管线。',
    },
    tocTitle: '目录',
    profile: {
      name: '你的名字',
      title: 'PCG 开发工程师 / 技术美术',
      location: '上海',
      email: 'you@example.com',
      avatarSrc:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&h=256&q=80',
      bio: '专注游戏 PCG 与工具链/管线开发，擅长用 C++ / Rust / C# 连接美术与工程，交付可维护、可复用、可落地的程序化系统与生产流程。',
      interests: ['PCG', '程序化工具', '生产管线', '几何/内容生成'],
    },
    highlights: {
      title: '亮点',
      items: [
        { label: '方向', value: 'PCG · 工具 · 管线', detail: '面向内容生产的可用系统' },
        { label: '技术栈', value: 'C++ · Rust · C#', detail: '引擎运行时 + 编辑器工具' },
        { label: '经验', value: '4+ 年', detail: '游戏研发与技术美术' },
      ],
    },
    experience: {
      title: '经历',
      items: [
        {
          company: '网易 · 技术中心 · 雷火无限大',
          role: 'PCG 道路系统负责人',
          start: '2021.07',
          end: '2024.05',
          location: '上海',
          summary: '独立负责 PCG 道路系统开发，并负责美术资产打包管线。',
          bullets: [
            '从 0 到 1 独立开发 PCG 道路系统：核心数据结构、生成逻辑、编辑器工作流与引擎侧对接。',
            '建设美术资产打包管线：资产校验、依赖处理、产物规范与自动化，提升交付稳定性与一致性。',
            '与美术/关卡/引擎团队协作落地数据格式与接口，持续迭代工具易用性并投入日常生产。',
          ],
          tags: ['C++', 'C#', 'PCG', '工具链', '管线'],
        },
        {
          company: 'miao',
          role: '技术美术组长',
          start: '2024.05',
          end: '2025.07',
          location: '上海',
          bullets: [
            '带领技术美术小组支持项目生产：工具/管线/流程优化与问题闭环。',
            '制定资产规范与自动化检查，降低返工并提升内容一致性。',
            '跨团队推进需求落地与工具推广，保障可用性与生产效率。',
          ],
          tags: ['技术美术', '管线', '工具'],
        },
        {
          company: '米哈游',
          role: 'PCG 开发工程师 · 雨之城',
          start: '2025.07',
          end: '至今',
          location: '上海',
          summary: '负责《雨之城》PCG 方向开发。',
          bullets: [
            '负责 PCG 系统与相关工具开发，服务内容生产与迭代。',
            '与内容团队协作沉淀可复用、可配置的模块与流程。',
          ],
          tags: ['C++', 'Rust', 'PCG'],
        },
      ],
    },
    projects: {
      title: '代表项目',
      items: [
        {
          name: 'PCG 道路系统',
          description: '面向关卡生产的道路生成与编辑系统，强调稳定性、可复用与可维护。',
          highlights: ['从设计到实现的端到端负责，与内容团队高频迭代落地。'],
          tags: ['PCG', 'C++', '工具'],
        },
        {
          name: '美术资产打包管线',
          description: '美术资产打包与校验管线，保障产物一致性与交付质量。',
          highlights: ['自动化校验与规范产物，降低集成与返工成本。'],
          tags: ['管线', 'C#', '自动化'],
        },
        {
          name: '《雨之城》PCG',
          description: '负责《雨之城》PCG 系统与工具链开发。',
          tags: ['PCG', 'C++', 'Rust'],
        },
      ],
    },
    skills: {
      title: '技能',
      groups: [
        { name: '语言', items: ['C++', 'Rust', 'C#'] },
        { name: 'PCG', items: ['程序化系统', '工具工作流', '可复现/确定性管线'] },
        { name: '生产', items: ['资产管线', '自动化校验', '工具链建设'] },
      ],
    },
    education: {
      title: '教育',
      items: [
        {
          school: '上海视觉艺术学院',
          degree: '工艺美术（本科）',
        },
        {
          school: '上海外国语大学',
          degree: '英语语言学（双学位）',
        },
      ],
    },
    contact: {
      title: '联系',
      subtitle: '优先邮件联系，一般 24–48 小时内回复。',
      sendEmail: '发送邮件',
      copyEmail: '复制邮箱',
      downloadPdf: '下载 PDF',
      copiedTitle: '已复制',
      copiedDescription: '邮箱地址已复制到剪贴板。',
    },
  },
};
