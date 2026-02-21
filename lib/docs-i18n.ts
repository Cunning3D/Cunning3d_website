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

export function localizeDocTitle(url: string | undefined, title: string, locale: DocLocale): string {
  if (locale !== 'zh') return title;
  if (!url) return zhLabelByEn[title] ?? title;
  return zhTitleByUrl[url] ?? title;
}

export function localizeDocDescription(
  url: string | undefined,
  description: string | undefined,
  locale: DocLocale,
): string | undefined {
  if (locale !== 'zh') return description;
  if (!url) return description;
  return zhDescriptionByUrl[url] ?? description;
}

export function localizeTreeLabel(label: unknown, locale: DocLocale): unknown {
  if (locale !== 'zh') return label;
  if (typeof label !== 'string') return label;
  return zhLabelByEn[label] ?? label;
}

