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
      name: 'Anonymous',
      title: 'PCG Developer / Technical Artist',
      location: 'Private',
      email: 'anonymous@example.com',
      avatarSrc: '/logo.png',
      bio: 'PCG developer / technical artist specialized in procedural systems and production pipelines for games. Focused on scalable worldbuilding tools, editor workflows, and stable asset packaging (C++ / Rust / C#).',
      interests: ['PCG', 'Tools', 'Pipelines', 'Open World'],
    },
    highlights: {
      title: 'Highlights',
      items: [
        { label: 'Focus', value: 'PCG · Tools · Pipeline', detail: 'Production-ready systems for content teams' },
        { label: 'Impact', value: 'Procedural Worldbuilding', detail: 'Scalable roads & tooling for large scenes' },
        { label: 'Achievement', value: 'Confidential', detail: 'Production tooling shipped and used by content teams' },
        { label: 'Stack', value: 'C++ · Rust · C#', detail: 'Engine/runtime + editor tooling' },
      ],
    },
    experience: {
      title: 'Experience',
      items: [
        {
          company: 'AAA Game Studio (Confidential)',
          role: 'PCG Roads System Owner · Tools & Pipeline',
          start: '2021.07',
          end: '2024.05',
          location: 'Confidential',
          summary: 'Owned a PCG road system and a production asset packaging pipeline for a large-scale project.',
          bullets: [
            'Built the PCG road system end-to-end: data structures, generation logic, editor workflows, and engine integration.',
            'Improved content iteration speed for environment/level teams through robust tooling and UX-focused workflows.',
            'Developed an asset packaging pipeline (validation, dependencies, standardized outputs) designed to be stable and low-maintenance.',
            'Collaborated with art/design/engine teams to align formats, iterate on usability, and ship tools into daily production.',
          ],
          tags: ['C++', 'C#', 'PCG', 'Tooling', 'Pipeline'],
        },
        {
          company: 'Game Studio (Confidential)',
          role: 'Technical Art Lead',
          start: '2024.05',
          end: '2025.07',
          location: 'Confidential',
          bullets: [
            'Led the technical art team to deliver tools and pipelines for a large-scale project.',
            'Implemented a seamless open-world streaming solution to support large scenes and content organization.',
            'Built and maintained packaging/validation tooling to improve delivery quality and stability.',
            'Partnered with engineering to unblock mobile builds and packaging workflows.',
          ],
          tags: ['Technical Art', 'Open World', 'Pipeline', 'Tools'],
        },
        {
          company: 'Game Studio (Confidential)',
          role: 'PCG Engineer · Open-world Project (Confidential)',
          start: '2025.07',
          end: 'Present',
          location: 'Confidential',
          summary: 'PCG development for a confidential project.',
          bullets: [
            'Procedural utilities for world details (e.g., power lines).',
          ],
          tags: ['C++', 'Rust', 'PCG'],
        },
      ],
    },
    projects: {
      title: 'Selected Projects',
      items: [
        {
          name: 'Cunning3D',
          description:
            'A node-based procedural modeling DCC built around a reusable kernel (Rust + Bevy).',
          highlights: [
            'A complete, runnable system with a growing library of CDA examples.',
            'Tooling-first design: reliable workflows, iteration speed, and production-minded architecture.',
          ],
          tags: ['Rust', 'Bevy', 'DCC', 'Procedural Modeling', 'PCG'],
          links: [
            { label: 'Website', href: 'https://cunning3d.com' },
            { label: 'GitHub', href: 'https://github.com/Cunning3D/Cunning3D-Dev' },
          ],
        },
        {
          name: 'Unity Procedural Road System (Personal)',
          description:
            'A spline-based road & junction generation tool built in the Unity Editor for large scenes.',
          highlights: [
            'Lofted multi-lane roads with sidewalks/curbs/green belts and consistent UV tiling.',
            'Junction generation with zebra crossings; block/parcel scanning from sidewalk outer edges.',
            'Editor performance tooling for large scenes (LOD / multithreaded frustum culling).',
          ],
          tags: ['Unity', 'C#', 'Splines', 'Mesh Generation', 'Editor Tools'],
        },
        {
          name: 'PCG Road System (Confidential)',
          description: 'A procedural road generation & editing system designed for production use at scale.',
          highlights: [
            'End-to-end ownership from design to implementation and iteration with content teams.',
            'Emphasis on stability, usability, and iteration speed for daily production.',
          ],
          tags: ['PCG', 'C++', 'Tools'],
        },
        {
          name: 'Seamless Open World Streaming (Confidential)',
          description: 'A seamless open-world streaming solution to support large-scale world building.',
          highlights: ['Designed with production constraints and iteration speed in mind.'],
          tags: ['Open World', 'Tools', 'Pipeline'],
        },
        {
          name: 'Art Asset Packaging Pipeline',
          description: 'A packaging/validation pipeline for art assets to improve delivery quality and consistency.',
          highlights: ['Low-maintenance pipeline with automated validation and standardized outputs.'],
          tags: ['Pipeline', 'C#', 'Automation'],
        },
        {
          name: 'PCG Utilities (Confidential)',
          description: 'PCG systems and tooling for a confidential project.',
          highlights: ['Procedural utilities for world details (e.g., power lines).'],
          tags: ['PCG', 'C++', 'Rust'],
        },
      ],
    },
    skills: {
      title: 'Skills',
      groups: [
        { name: 'Languages', items: ['C++', 'Rust', 'C#'] },
        { name: 'PCG', items: ['Roads', 'Open World', 'High-voltage lines', 'Procedural Tools'] },
        { name: 'Production', items: ['Asset Packaging', 'Validation', 'Automation', 'Mobile Build/Packaging'] },
      ],
    },
    education: {
      title: 'Education',
      items: [
        {
          school: 'Arts University (Confidential)',
          degree: 'B.A. in Arts & Crafts',
        },
        {
          school: 'Language Studies (Confidential)',
          degree: 'Dual degree in English Linguistics (Confidential)',
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
      name: 'Anonymous',
      title: 'PCG 开发工程师 / 技术美术',
      location: '保密',
      email: 'anonymous@example.com',
      avatarSrc: '/logo.png',
      bio: '专注游戏 PCG 与工具链/管线开发：程序化系统、编辑器工作流与资产打包/校验（C++ / Rust / C#）。',
      interests: ['PCG', '工具链', '生产管线', '大世界'],
    },
    highlights: {
      title: '亮点',
      items: [
        { label: '方向', value: 'PCG · 工具 · 管线', detail: '面向内容生产的可用系统' },
        { label: '影响', value: '内容生产提效', detail: '程序化工具支撑大规模内容迭代' },
        { label: '成绩', value: '保密', detail: '已上线项目/工具落地（保密）' },
        { label: '技术栈', value: 'C++ · Rust · C#', detail: '引擎运行时 + 编辑器工具' },
      ],
    },
    experience: {
      title: '经历',
      items: [
        {
          company: 'AAA 游戏工作室（保密）',
          role: 'PCG 道路系统负责人 · 工具/管线',
          start: '2021.07',
          end: '2024.05',
          location: '保密',
          summary: '负责 PCG 道路系统与美术资产打包/校验管线（保密项目）。',
          bullets: [
            '从 0 到 1 独立开发 PCG 道路系统：核心数据结构、生成逻辑、编辑器工作流与引擎侧对接。',
            '面向内容生产提效：提供稳定易用的道路编辑/生成工作流，支撑大规模内容迭代。',
            '建设资产打包/校验管线：依赖处理、产物规范与自动化，强调稳定与低维护。',
            '与美术/关卡/引擎团队协作落地数据格式与接口，持续迭代工具易用性并投入日常生产。',
          ],
          tags: ['C++', 'C#', 'PCG', '工具链', '管线'],
        },
        {
          company: '游戏工作室（保密）',
          role: '技术美术组长',
          start: '2024.05',
          end: '2025.07',
          location: '保密',
          bullets: [
            '带领技术美术团队推动工具/管线落地，提升内容生产效率。',
            '开发无缝大世界/流式加载方案，支撑大规模场景与内容组织。',
            '建设资产打包管线与自动化校验，提升交付一致性与稳定性。',
            '配合工程团队打通移动端构建与资源侧集成流程。',
          ],
          tags: ['技术美术', '大世界', '管线', '工具'],
        },
        {
          company: 'AAA 游戏工作室（保密）',
          role: 'PCG 开发工程师（保密项目）',
          start: '2025.07',
          end: '至今',
          location: '保密',
          summary: '负责保密项目 PCG 方向开发。',
          bullets: [
            '程序化世界细节（例如：高压线）。',
          ],
          tags: ['C++', 'Rust', 'PCG'],
        },
      ],
    },
    projects: {
      title: '代表项目',
      items: [
        {
          name: 'Cunning3D',
          description: '基于 Rust + Bevy 的节点式程序化建模软件（DCC），围绕可复用内核构建。',
          highlights: ['完整可运行的软件系统，并沉淀了大量 CDA 示例案例。', '以工具链与工作流为中心，强调可维护与可落地。'],
          tags: ['Rust', 'Bevy', 'DCC', '程序化建模', 'PCG'],
          links: [
            { label: '官网', href: 'https://cunning3d.com' },
            { label: 'GitHub', href: 'https://github.com/Cunning3D/Cunning3D-Dev' },
          ],
        },
        {
          name: 'Unity 程序化道路系统（个人作品）',
          description: '基于 Unity Splines 的道路/路口生成工具，用于大规模场景的道路制作与编辑。',
          highlights: [
            '支持多车道参数化道路，并生成道路/人行道/路缘/绿化带等网格与 UV。',
            '支持路口生成与斑马线，并基于人行道外沿扫描闭合区域生成地块占位符。',
            '面向大场景编辑效率：LOD / 多线程视锥裁剪等辅助工具。',
          ],
          tags: ['Unity', 'C#', 'Spline', '网格生成', '编辑器工具'],
        },
        {
          name: 'PCG 道路系统（保密）',
          description: '面向内容生产的道路生成与编辑系统，强调稳定性、易用性与迭代效率。',
          highlights: ['从设计到实现端到端负责，与内容团队共同打磨工作流并投入日常生产。'],
          tags: ['PCG', 'C++', '工具'],
        },
        {
          name: '无缝大世界方案',
          description: '开发无缝大世界/流式加载方案以支撑大规模场景与内容组织。',
          highlights: ['以生产约束为导向，强调可迭代、可落地与性能边界可控。'],
          tags: ['大世界', '工具链', '管线'],
        },
        {
          name: '美术资产打包管线',
          description: '美术资产打包与校验管线，保障产物一致性与交付质量。',
          highlights: ['自动化校验与规范产物，长期稳定且基本无需维护。'],
          tags: ['管线', 'C#', '自动化'],
        },
        {
          name: 'PCG 工具与系统（保密）',
          description: '负责保密项目 PCG 系统与工具链开发。',
          highlights: ['程序化世界细节（例如：高压线）。'],
          tags: ['PCG', 'C++', 'Rust'],
        },
      ],
    },
    skills: {
      title: '技能',
      groups: [
        { name: '语言', items: ['C++', 'Rust', 'C#'] },
        { name: 'PCG', items: ['道路', '大世界', '高压线', '程序化工具'] },
        { name: '生产', items: ['资产打包', '自动化校验', '工具链建设', '移动端出包'] },
      ],
    },
    education: {
      title: '教育',
      items: [
        {
          school: '艺术类本科（保密）',
          degree: '工艺美术',
        },
        {
          school: '英语语言学（双学位，保密）',
          degree: '英语语言学',
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
