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
      name: 'Shuangqing Liu',
      title: 'PCG Developer / Technical Artist',
      location: 'Shanghai, China',
      email: 'you@example.com',
      avatarSrc:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'PCG developer / technical artist specialized in procedural systems and production pipelines for games. Built a PCG road system that drove most exposure PV with only a handful of artists, and shipped low-maintenance packaging pipelines (C++ / Rust / C#).',
      interests: ['PCG', 'Tools', 'Pipelines', 'Open World'],
    },
    highlights: {
      title: 'Highlights',
      items: [
        { label: 'Focus', value: 'PCG · Tools · Pipeline', detail: 'Production-ready systems for content teams' },
        { label: 'Impact', value: 'Roads at Scale', detail: 'Most exposure PV driven by PCG roads (small art team)' },
        { label: 'Achievement', value: '#1 on TapTap', detail: 'Pre-registration chart (project)' },
        { label: 'Stack', value: 'C++ · Rust · C#', detail: 'Engine/runtime + editor tooling' },
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
            'Improved production efficiency: most exposure PV came from PCG road content, enabled with only a handful of artists participating.',
            'Developed an art asset packaging pipeline (validation, dependencies, standardized outputs) designed to be stable and low-maintenance.',
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
            'Led the technical art team; shipped a project that reached #1 on the TapTap pre-registration chart.',
            'Developed a seamless open-world solution inspired by industry references (e.g., GTA V) to support large-scale content.',
            'Built/iterated asset packaging pipelines and validation tooling for stable delivery.',
            'Worked closely with the lead engineer to unblock mobile builds and packaging.',
          ],
          tags: ['Technical Art', 'Open World', 'Pipeline', 'Tools'],
        },
        {
          company: 'miHoYo',
          role: 'PCG Engineer · “Rain City”',
          start: '2025.07',
          end: 'Present',
          location: 'Shanghai',
          summary: 'PCG development for “Rain City”.',
          bullets: [
            'High-voltage lines.',
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
          description: 'A procedural road generation & editing system designed for level production at scale.',
          highlights: [
            'End-to-end ownership from design to implementation and iteration with content teams.',
            'Drove most exposure PV with only a handful of artists participating.',
          ],
          tags: ['PCG', 'C++', 'Tools'],
        },
        {
          name: 'Seamless Open World Solution',
          description: 'A seamless open-world solution to support large-scale world building.',
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
          name: '“Rain City” PCG',
          description: 'PCG systems and tooling for the “Rain City” project.',
          highlights: ['High-voltage lines.'],
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
      name: '刘双庆',
      title: 'PCG 开发工程师 / 技术美术',
      location: '上海',
      email: 'you@example.com',
      avatarSrc:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&h=256&q=80',
      bio: '专注游戏 PCG 与工具链/管线开发，擅长用 C++ / Rust / C# 连接美术与工程：PCG 道路覆盖主要曝光 PV（仅少量美术参与），资产打包管线长期稳定且基本无需维护。',
      interests: ['PCG', '工具链', '生产管线', '大世界'],
    },
    highlights: {
      title: '亮点',
      items: [
        { label: '方向', value: 'PCG · 工具 · 管线', detail: '面向内容生产的可用系统' },
        { label: '影响', value: '道路效率提升', detail: '曝光 PV 主要来自 PCG 道路（少量美术参与）' },
        { label: '成绩', value: 'TapTap 预约榜第 1', detail: '项目预约榜单' },
        { label: '技术栈', value: 'C++ · Rust · C#', detail: '引擎运行时 + 编辑器工具' },
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
            '显著提升效率：曝光 PV 主要来自 PCG 道路内容，仅需少量美术参与即可支撑大规模内容产出。',
            '建设美术资产打包管线：资产校验、依赖处理、产物规范与自动化，长期稳定且基本无需维护。',
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
            '带领技术美术团队推动工具/管线落地，项目 TapTap 预约榜第 1。',
            '开发无缝大世界方案（参考 GTA5 等业界实现思路），支撑大规模场景与内容组织。',
            '建设资产打包管线与自动化校验，提升交付一致性与稳定性。',
            '配合主程完成手机包出包，解决构建与资源侧集成问题。',
          ],
          tags: ['技术美术', '大世界', '管线', '工具'],
        },
        {
          company: '米哈游',
          role: 'PCG 开发工程师 · 雨之城',
          start: '2025.07',
          end: '至今',
          location: '上海',
          summary: '负责《雨之城》PCG 方向开发。',
          bullets: [
            '高压线',
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
          highlights: ['从设计到实现端到端负责：道路内容覆盖主要曝光 PV，仅需少量美术参与。'],
          tags: ['PCG', 'C++', '工具'],
        },
        {
          name: '无缝大世界方案',
          description: '参考 GTA5 等业界实现思路，开发无缝大世界方案以支撑大规模场景与内容组织。',
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
          name: '《雨之城》PCG',
          description: '负责《雨之城》PCG 系统与工具链开发。',
          highlights: ['高压线'],
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
