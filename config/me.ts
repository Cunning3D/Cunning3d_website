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
    copiedTitle: string;
    copiedDescription: string;
  };
}

export const mePageByLocale: Record<MeLocale, MePageConfig> = {
  en: {
    meta: {
      title: 'About',
      description: 'Personal profile, experience, projects, and contact.',
    },
    tocTitle: 'Sections',
    profile: {
      name: 'Your Name',
      title: 'Your Title / Role',
      location: 'Shanghai, China',
      email: 'you@example.com',
      avatarSrc: '/logo.png',
      bio: 'Write a short, specific bio: what you do, what you’re good at, and what kind of roles you want.',
      interests: ['Procedural Modeling', 'Developer Tools', 'Open Source'],
      social: {
        github: 'https://github.com/yourname',
        linkedin: 'https://linkedin.com/in/yourname',
      },
    },
    highlights: {
      title: 'Highlights',
      items: [
        { label: 'Experience', value: 'X+ years', detail: 'Frontend / Full-stack / 3D tools' },
        { label: 'Impact', value: 'X projects', detail: 'Shipped features & products' },
        { label: 'Open Source', value: 'X contributions', detail: 'Repos, PRs, and docs' },
      ],
    },
    experience: {
      title: 'Experience',
      items: [
        {
          company: 'Company Name',
          role: 'Role / Team',
          start: '2023',
          end: 'Present',
          location: 'Shanghai',
          summary: 'One-line summary of scope and ownership.',
          bullets: [
            'Quantified achievement (e.g. reduced build time by 40%, improved conversion by 12%).',
            'A hard problem you solved and how (system design / performance / reliability).',
            'Collaboration and leadership (mentoring, cross-team, standards).',
          ],
          tags: ['TypeScript', 'React', 'Next.js'],
        },
        {
          company: 'Previous Company',
          role: 'Role / Team',
          start: '2020',
          end: '2023',
          location: 'Remote',
          bullets: [
            'A measurable result and what you did.',
            'A challenging project and the outcome.',
          ],
          tags: ['Node.js', 'Infra', 'Observability'],
        },
      ],
    },
    projects: {
      title: 'Selected Projects',
      items: [
        {
          name: 'Project Name',
          description: 'What it is, who it’s for, and why it matters.',
          highlights: ['Key technical highlight', 'Key product highlight'],
          tags: ['Rust', 'WASM', 'WebGPU'],
          links: [
            { label: 'GitHub', href: 'https://github.com/yourname/yourproject' },
            { label: 'Live', href: 'https://example.com' },
          ],
        },
        {
          name: 'Another Project',
          description: 'A shorter description with an outcome or metric.',
          tags: ['Next.js', 'AI', 'RAG'],
        },
      ],
    },
    skills: {
      title: 'Skills',
      groups: [
        { name: 'Languages', items: ['TypeScript', 'Rust', 'Python'] },
        { name: 'Web', items: ['React', 'Next.js', 'Tailwind'] },
        { name: '3D', items: ['Geometry', 'GPU', 'WASM'] },
      ],
    },
    education: {
      title: 'Education',
      items: [
        {
          school: 'University Name',
          degree: 'B.S. in Computer Science',
          start: '2016',
          end: '2020',
          detail: 'Optional: awards, thesis, notable coursework.',
        },
      ],
    },
    contact: {
      title: 'Contact',
      subtitle: 'Prefer email. I typically reply within 24–48 hours.',
      sendEmail: 'Send email',
      copyEmail: 'Copy email',
      copiedTitle: 'Copied',
      copiedDescription: 'Email address copied to clipboard.',
    },
  },
  zh: {
    meta: {
      title: '关于我',
      description: '个人简介、经历、项目与联系方式。',
    },
    tocTitle: '目录',
    profile: {
      name: '你的名字',
      title: '你的职位 / 方向',
      location: '上海',
      email: 'you@example.com',
      avatarSrc: '/logo.png',
      bio: '写一段短且具体的简介：你做什么、擅长什么、想找什么方向的机会。',
      interests: ['程序化建模', '开发者工具', '开源'],
      social: {
        github: 'https://github.com/yourname',
        linkedin: 'https://linkedin.com/in/yourname',
      },
    },
    highlights: {
      title: '亮点',
      items: [
        { label: '经验', value: 'X+ 年', detail: '前端 / 全栈 / 3D 工具' },
        { label: '产出', value: 'X 个项目', detail: '交付功能与产品' },
        { label: '开源', value: 'X 次贡献', detail: '仓库、PR 与文档' },
      ],
    },
    experience: {
      title: '经历',
      items: [
        {
          company: '公司名称',
          role: '岗位 / 团队',
          start: '2023',
          end: '至今',
          location: '上海',
          summary: '一句话概括范围与负责内容。',
          bullets: [
            '量化结果（例如构建耗时 -40%，转化率 +12%）。',
            '解决过的关键难题与方法（架构/性能/稳定性）。',
            '协作与影响力（推动规范、跨团队、带新人）。',
          ],
          tags: ['TypeScript', 'React', 'Next.js'],
        },
        {
          company: '上一家公司',
          role: '岗位 / 团队',
          start: '2020',
          end: '2023',
          location: '远程',
          bullets: ['一条可量化的成果与贡献。', '一项复杂项目与最终结果。'],
          tags: ['Node.js', '基础设施', '可观测性'],
        },
      ],
    },
    projects: {
      title: '代表项目',
      items: [
        {
          name: '项目名称',
          description: '它是什么、服务谁、价值是什么（最好带指标）。',
          highlights: ['关键技术亮点', '关键产品亮点'],
          tags: ['Rust', 'WASM', 'WebGPU'],
          links: [
            { label: 'GitHub', href: 'https://github.com/yourname/yourproject' },
            { label: '在线体验', href: 'https://example.com' },
          ],
        },
        {
          name: '另一个项目',
          description: '更短的一句话描述，最好带一个结果。',
          tags: ['Next.js', 'AI', 'RAG'],
        },
      ],
    },
    skills: {
      title: '技能',
      groups: [
        { name: '语言', items: ['TypeScript', 'Rust', 'Python'] },
        { name: 'Web', items: ['React', 'Next.js', 'Tailwind'] },
        { name: '3D', items: ['几何处理', 'GPU', 'WASM'] },
      ],
    },
    education: {
      title: '教育',
      items: [
        {
          school: '学校名称',
          degree: '计算机科学 本科',
          start: '2016',
          end: '2020',
          detail: '可选：奖项、论文、课程。',
        },
      ],
    },
    contact: {
      title: '联系',
      subtitle: '优先邮件联系，一般 24–48 小时内回复。',
      sendEmail: '发送邮件',
      copyEmail: '复制邮箱',
      copiedTitle: '已复制',
      copiedDescription: '邮箱地址已复制到剪贴板。',
    },
  },
};
