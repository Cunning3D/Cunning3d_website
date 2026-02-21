// Locale-aware labels for the docs sidebar and page chrome.
//
// We keep docs source files English-only (no "English / 中文" hardcoding).
// Chinese titles/descriptions are provided here and selected at runtime via next-intl locale.

export type DocLocale = 'en' | 'zh';

// Keyed by `page.url` from fumadocs loader (e.g. "/docs/nodes/group/create").
const zhTitleByUrl: Record<string, string> = {
  '/docs/nodes': '节点库',
  '/docs/nodes/group': '组',
  '/docs/nodes/group/create': '组创建',
  '/docs/nodes/group/combine': '组布尔',
  '/docs/nodes/group/promote': '组提升',
  '/docs/nodes/group/manage': '组管理',
  '/docs/nodes/group/normalize': '组归一化',
};

const zhDescriptionByUrl: Record<string, string> = {
  '/docs/nodes': '程序化建模算子',
  '/docs/nodes/group': '管理几何选集',
  '/docs/nodes/group/create': '按域筛选生成组',
  '/docs/nodes/group/combine': '组之间的布尔运算',
  '/docs/nodes/group/promote': '组域转换',
  '/docs/nodes/group/manage': '重命名、删除与复制组',
  '/docs/nodes/group/normalize': '修复组尺寸不匹配',
};

// Sidebar section labels (meta.json separators, meta titles, etc.)
const zhLabelByEn: Record<string, string> = {
  Nodes: '节点',
  'Node Library': '节点库',
  Docs: '文档',
  CDA: 'CDA',
  CGraph: 'CGraph',
  Platforms: '平台',
  Dev: '开发',
  Modeling: '建模',
  Attribute: '属性',
  IO: '输入输出',
  Flow: '流程',
  Group: '组',
  Volume: '体积',
  'AI Texture': 'AI 贴图',
  'AI Generation': 'AI 生成',
  Utility: '工具',
};

function looksLikeCodeLabel(s: string): boolean {
  // Keep code-like titles (components, JSX, function names) unmodified.
  if (s.includes('`') || s.includes('<') || s.includes('/>') || s.includes('()')) return true;
  if (/^[A-Z0-9_]+$/.test(s)) return true;
  return false;
}

function autoZhText(s: string): string {
  if (!s.trim()) return s;
  if (looksLikeCodeLabel(s)) return s;

  // Phrase-level replacements first.
  const phrases: Array<[RegExp, string]> = [
    [/Node Library/gi, '节点库'],
    [/Getting Started/gi, '快速开始'],
    [/Quick Start/gi, '快速开始'],
    [/Overview/gi, '概览'],
    [/Installation/gi, '安装'],
    [/Manual Installation/gi, '手动安装'],
    [/Internationalization/gi, '国际化'],
    [/Deploying/gi, '部署'],
    [/Search/gi, '搜索'],
    [/Configuration(s)?/gi, '配置'],
    [/Components/gi, '组件'],
    [/Utilities/gi, '工具'],
    [/Integrations/gi, '集成'],
    [/Platforms/gi, '平台'],
    [/Versioning/gi, '版本管理'],
    [/What is Cunning/gi, '什么是 Cunning'],
    [/File Format/gi, '文件格式'],
    [/Page Conventions/gi, '页面规范'],
    [/Parameters/gi, '参数'],
    [/Usage Modes/gi, '使用模式'],
    [/Graph/gi, '图'],
    [/Nodes/gi, '节点'],
    [/Attributes/gi, '属性'],
    [/Geometry/gi, '几何'],
    [/Kernel/gi, '内核'],
    [/Editor/gi, '编辑器'],
    [/Runtime/gi, '运行时'],
    [/API/gi, 'API'],
  ];
  let out = s;
  for (const [re, rep] of phrases) out = out.replace(re, rep);
  return out;
}

export function localizeDocTitle(url: string | undefined, title: string, locale: DocLocale): string {
  if (locale !== 'zh') return title;
  if (!url) return zhLabelByEn[title] ?? title;
  return zhTitleByUrl[url] ?? zhLabelByEn[title] ?? autoZhText(title);
}

export function localizeDocDescription(
  url: string | undefined,
  description: string | undefined,
  locale: DocLocale,
): string | undefined {
  if (locale !== 'zh') return description;
  if (!url) return description;
  if (zhDescriptionByUrl[url]) return zhDescriptionByUrl[url];
  if (!description) return description;
  // Only auto-translate short descriptions; longer content tends to need manual copywriting.
  if (description.length > 120) return description;
  return autoZhText(description);
}

export function localizeTreeLabel(label: unknown, locale: DocLocale): unknown {
  if (locale !== 'zh') return label;
  if (typeof label !== 'string') return label;
  return zhLabelByEn[label] ?? autoZhText(label);
}
