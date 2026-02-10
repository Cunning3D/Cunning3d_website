// Cunning3D 项目统计 - 真实数据（排除第三方库）
// 最后更新：2026-01-17

export interface ProjectStat {
  label: string;
  value: number;
  unit?: string;
  icon: string;
  color: string;
}

export interface LanguageStat {
  name: string;
  lines: number;
  color: string; // Tailwind color class
  icon: string;
}

export interface Milestone {
  title: string;
  progress: number; // 0-100
  icon: string;
}

// 语言统计（类似 GitHub 语言条）
export const languageStats: LanguageStat[] = [
  { name: 'Rust', lines: 252589, color: 'bg-orange-500', icon: 'cog' },
  { name: 'MDX', lines: 12561, color: 'bg-yellow-500', icon: 'file-text' },
  { name: 'TypeScript', lines: 10571, color: 'bg-blue-500', icon: 'code' },
  { name: 'TOML', lines: 1331, color: 'bg-slate-500', icon: 'settings' },
  { name: 'C#', lines: 1194, color: 'bg-purple-500', icon: 'hash' },
  { name: 'WGSL', lines: 1184, color: 'bg-green-500', icon: 'palette' },
  { name: 'Rhai', lines: 185, color: 'bg-cyan-500', icon: 'scroll-text' },
  { name: 'CSS', lines: 171, color: 'bg-pink-500', icon: 'paintbrush' },
];

// 计算总行数和百分比
export const totalLines = languageStats.reduce((sum, l) => sum + l.lines, 0);

export const projectStats = {
  updatedAt: '2026-01-17',
  stats: [
    { label: 'Total Lines', value: totalLines, icon: 'bar-chart', color: 'text-slate-700' },
    { label: 'Rust Files', value: 972, icon: 'file-code', color: 'text-orange-500' },
    { label: 'Node Types', value: 70, icon: 'hexagon', color: 'text-cyan-500' },
    { label: 'GPU Shaders', value: 17, icon: 'cpu', color: 'text-purple-500' },
  ] as ProjectStat[],
};

// 开发里程碑进度
export const milestones: Milestone[] = [
  { title: 'Core Engine', progress: 95, icon: 'cog' },
  { title: 'Node System', progress: 85, icon: 'hexagon' },
  { title: 'Unity Plugin', progress: 40, icon: 'gamepad-2' },
  { title: 'AI Features', progress: 60, icon: 'brain' },
  { title: 'Documentation', progress: 20, icon: 'book-open' },
];
