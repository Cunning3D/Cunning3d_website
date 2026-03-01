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
      description: 'Engine tools engineer / technical artist focused on production tooling and pipelines for games.',
    },
    tocTitle: 'Sections',
    profile: {
      name: 'Anonymous',
      title: 'Engine Tools Engineer / Technical Artist / Software Engineer',
      location: 'Private',
      email: 'anonymous@example.com',
      avatarSrc: '/logo.png',
      bio: 'Engine tools engineer / technical artist focused on production tooling and pipelines for games: editor workflows, asset validation/packaging, automation, and procedural utilities. Comfortable bridging art and engineering; shipped tools used by content teams (C++ / Rust / C#).',
      interests: ['PCG', 'Tools', 'Pipelines', 'Open World'],
    },
    highlights: {
      title: 'Highlights',
      items: [
        { label: 'Focus', value: 'Engine Tools · Tech Art · Pipeline', detail: 'Production-ready systems for content teams' },
        { label: 'Impact', value: 'Iteration Speed & Reliability', detail: 'Editor UX + validation tooling for large scenes' },
        { label: 'Achievement', value: 'Shipped Tooling (Confidential)', detail: 'Production tools used daily by content teams' },
        { label: 'Stack', value: 'C++ · Rust · C#', detail: 'Engine/runtime + editor tooling' },
      ],
    },
    experience: {
      title: 'Experience',
      items: [
        {
          company: 'NetEase Games · Tianxia Division · “Moonfall”',
          role: 'Technical Artist · Animation Tools (Campus Hire)',
          start: '2019.07',
          end: '2020.07',
          location: 'Confidential',
          summary: 'Campus hire on a high-quality AAA title built on an in-house engine.',
          bullets: [
            'Built animation asset batch-processing tooling.',
            'Developed a bulk skeleton hierarchy update tool.',
            'Drove tuning feedback and iteration for Messiah engine animation tools.',
            'Built Houdini-based workflow “tricks” (e.g., Nanite-to-Messiah VFX conversion).',
          ],
          tags: ['Houdini', 'Animation', 'Tools', 'Pipeline'],
        },
        {
          company: 'NetEase Games (Leihuo) · Project New World',
          role: 'PCG Tools Engineer · Pipeline Landing',
          start: '2020.07',
          end: '2021.07',
          location: 'Confidential',
          bullets: [
            'Worked with the technical platform team to land the central PCG pipeline tools into the project (Unity mainline + Houdini for geometry/terrain masks), debugged PCG tooling, and built a PCG cliff tool.',
          ],
          tags: ['Unity', 'Houdini', 'C#', 'PCG', 'Tools', 'Pipeline'],
        },
        {
          company: 'NetEase Games (Leihuo) · “无限大”',
          role: 'PCG Roads System Owner · Tools & Pipeline',
          start: '2021.07',
          end: '2024.05',
          location: 'Confidential',
          summary:
            'Joined as a new graduate; independently built a PCG road system and a PCG art asset packaging/validation pipeline from 0 to 1 for a large-scale project.',
          bullets: [
            'Built the PCG road system end-to-end: data structures, generation logic, editor workflows, and engine integration.',
            'Improved content iteration speed for environment/level teams through robust tooling and UX-focused workflows.',
            'Developed a PCG art asset packaging/validation pipeline (dependencies, standardized outputs, automated checks) designed to be stable and low-maintenance.',
            'Partnered with client engineering to develop a traffic graph data system; optimized scene load; heavily contributed to maintaining the mobile open-world PCG scene asset pipeline.',
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
          name: 'Real-time Procedural Road System (Unity, Personal)',
          description:
            'A real-time procedural road & junction system built in the Unity Editor for large scenes.',
          highlights: [
            'Lofted multi-lane roads with sidewalks/curbs/green belts and consistent UV tiling.',
            'Junction generation with zebra crossings; block/parcel scanning from sidewalk outer edges.',
            'Large-scene editor performance: LOD + multi-threaded culling.',
            'Real-time generation per-GameObject for road segments & junctions (WYSIWYG in Editor).',
            'Highly programmable geometry customization (lane counts, turning rules, etc.).',
            'Cunning3D Graph integration as a Houdini-PCG-Graph alternative for procedural workflows.',
            'Cunning Engine for Unity: operators API + graph data access for hybrid dev; HDA-like black-box usage with async builds (no main-thread stalls).',
            'Rust-based DLL wrapping a geometry library (non-RPC session) with strict validation (unwrap/assert) around memory ops to reduce leak/crash risk.',
          ],
          tags: ['Unity', 'C#', 'PCG', 'Graph', 'Rust', 'Editor Tools'],
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
          name: 'CometSwap',
          description: 'Blockchain swap front-end built with React.',
          highlights: ['AI-coding learning project: exploring what AI can do end-to-end.'],
          tags: ['React', 'Blockchain', 'Frontend', 'AI Coding'],
        },
        {
          name: 'AoMDC Modding & Community (2007–2009)',
          description: 'Early modding and community work for the Half-Life (GoldSrc) mod AoMDC.',
          highlights: [
            'Contributed to multiplayer map creation for AoMDC (predecessor of Cry of Fear).',
            'Built and published maps using Hammer (Valve Hammer Editor).',
            'Learned AMX Mod X (AMXX) plugin development.',
            'Moderated the GoldSrc mod section on Modchian and hosted an AoMDC server.',
          ],
          tags: ['GoldSrc', 'Half-Life', 'Modding', 'Hammer', 'AMXX', 'Server'],
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
      description: '引擎工具/技术美术：编辑器工具、生产管线与自动化。',
    },
    tocTitle: '目录',
    profile: {
      name: 'Anonymous',
      title: '引擎工具工程师 / 技术美术 / 软件工程师',
      location: '保密',
      email: 'anonymous@example.com',
      avatarSrc: '/logo.png',
      bio: '五年级起开始对游戏 Mod 开发感兴趣，参与《Cry of Fear》（曾在 Steam 免费恐怖游戏榜单 Top 10）前作 AoMDC 的联机地图开发。2021 年大学毕业转行加入游戏行业，工作至今主要负责 PCG 方向技术美术与工具需求开发（C++ / Rust / C#）。',
      interests: ['PCG', '工具链', '生产管线', '大世界'],
    },
    highlights: {
      title: '亮点',
      items: [
        { label: '方向', value: '引擎工具 · 技术美术 · 管线', detail: '面向内容生产的可用系统' },
        { label: '影响', value: '迭代提效与稳定性', detail: '编辑器体验 + 自动化校验，支撑大规模内容生产' },
        { label: '成绩', value: '工具落地（保密）', detail: '已投入生产并被内容团队日常使用' },
        { label: '技术栈', value: 'C++ · Rust · C#', detail: '引擎运行时 + 编辑器工具' },
      ],
    },
    experience: {
      title: '经历',
      items: [
        {
          company: '网易 · 天下事业部 · 《月球陨落》',
          role: '动画工具开发 · 技术美术（校招）',
          start: '2019.07',
          end: '2020.07',
          location: '保密',
          summary: '校招参与高品质自研引擎 3A 项目《月球陨落》，负责动画相关工具与工作流。',
          bullets: [
            '开发动画资产批处理工具。',
            '开发批量骨骼层级更新工具。',
            '弥赛亚引擎动画工具调优与反馈闭环。',
            'Houdini 辅助的“邪恶 trick”工作流：例如 Nanite 转弥赛亚特效等方案。',
          ],
          tags: ['Houdini', '动画', '工具链', '管线'],
        },
        {
          company: '网易雷火 · Project New World',
          role: 'PCG 工具工程师 · 中台落地',
          start: '2020.07',
          end: '2021.07',
          location: '保密',
          bullets: [
            '和技术中台一起，负责中台 PCG 管线工具项目内落地（Unity 主干 && Houdini 辅助处理几何、地形 Mask 等），调试 PCG 工具，开发 PCG 崖壁工具。',
          ],
          tags: ['Unity', 'Houdini', 'C#', 'PCG', '工具链', '管线'],
        },
        {
          company: '网易雷火 · 《无限大》',
          role: 'PCG 道路系统负责人 · 工具/管线',
          start: '2021.07',
          end: '2024.05',
          location: '保密',
          summary: '应届入职起，从 0 到 1 独立开发 PCG 道路系统与 PCG 美术资产打包/校验管线。',
          bullets: [
            '从 0 到 1 独立开发 PCG 道路系统：核心数据结构、生成逻辑、编辑器工作流与引擎侧对接。',
            '面向内容生产提效：提供稳定易用的道路编辑/生成工作流，支撑大规模内容迭代。',
            '建设 PCG 美术资产打包/校验管线：依赖处理、产物规范与自动化，强调稳定与低维护。',
            '与客户端合作开发交通 Graph 数据系统；优化场景负载；重度参与手机版本大世界 PCG 场景资产管线维护。',
          ],
          tags: ['C++', 'C#', 'PCG', '工具链', '管线'],
        },
        {
          company: '游戏工作室（保密）',
          role: 'TA组长',
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
          name: '实时程序化道路系统（个人作品）',
          description: '基于 Unity Editor 的实时程序化道路/路口系统，用于大规模场景的道路制作与编辑。',
          highlights: [
            '支持多车道参数化道路，并生成道路/人行道/路缘/绿化带等网格与 UV。',
            '支持路口生成与斑马线，并基于人行道外沿扫描闭合区域生成地块占位符。',
            '面向大场景的编辑器 EDITOR 下：LOD / 多线程裁剪等辅助工具。',
            '逐 GameObject 维度对路段/路口进行实时生成与更新，所见即所得。',
            '高度程序员可控的几何自定义：左右车道数、转向规则等能力。',
            '替代 Houdini 的 PCG Graph：集成 Cunning3D Graph，支持流程编排与数据访问。',
            'Cunning Engine for Unity：可直接调算子，也可配合 Graph 做混合开发；支持 HDA 式黑盒使用，异步构建不阻塞主线程。',
            '非 RPC Session：本质是几何库封装；Rust 实现并在关键内存操作处加入 unwrap/断言与边界保护，降低内存泄露与 DLL 带崩宿主风险。',
          ],
          tags: ['Unity', 'C#', 'PCG', 'Graph', 'Rust', '编辑器工具'],
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
          name: '彗星swap',
          description: '区块链 Swap 前端（React）。',
          highlights: ['AI Coding 学习作品：测试 AI 可以做到什么程度。'],
          tags: ['React', '区块链', '前端', 'AI Coding'],
        },
        {
          name: 'AoMDC 联机地图 & 服务器（Modchian 版主，2007–2009）',
          description: '小学时期的 Mod 开发与社区实践：围绕 Half-Life（GoldSrc）Mod「AoMDC」。',
          highlights: [
            '参与 AoMDC 联机地图制作与迭代（《Cry of Fear》前作）。',
            '学习并使用 Hammer 工具制作/发布场景地图。',
            '学习 AMXX 插件制作。',
            '担任 Modchian GoldSrc 引擎 Mod 板块版主，搭建并维护 AoMDC 服务器。',
          ],
          tags: ['GoldSrc', 'Half-Life', 'Mod', 'Hammer', 'AMXX', '服务器'],
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
