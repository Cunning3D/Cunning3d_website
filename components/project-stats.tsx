import { projectStats, milestones, languageStats, totalLines } from '@/config/project-stats';
import type { IconWeight } from "@phosphor-icons/react";
import {
  ChartBar,
  FileCode,
  Hexagon,
  Cpu,
  Gear,
  GameController,
  Brain,
  BookOpen,
  Crosshair,
} from '@phosphor-icons/react/dist/ssr';

// 图标映射
const iconMap: Record<string, React.ComponentType<{ className?: string; weight?: IconWeight }>> = {
  'bar-chart': ChartBar,
  'file-code': FileCode,
  'hexagon': Hexagon,
  'cpu': Cpu,
  'cog': Gear,
  'gamepad-2': GameController,
  'brain': Brain,
  'book-open': BookOpen,
};

// 格式化大数字
function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function ProjectStats() {
  return (
    <div className="space-y-8">
      {/* 语言占比条（类似 GitHub） */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold">Languages</h4>
          <span className="text-sm text-slate-500">{formatNumber(totalLines)} lines</span>
        </div>

        {/* 彩色进度条 */}
        <div className="h-3 rounded-full overflow-hidden flex">
          {languageStats.map((lang) => {
            const percent = (lang.lines / totalLines) * 100;
            if (percent < 0.1) return null; // 太小的不显示
            return (
              <div
                key={lang.name}
                className={`${lang.color} transition-all`}
                style={{ width: `${percent}%` }}
                title={`${lang.name}: ${formatNumber(lang.lines)} lines (${percent.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* 语言图例 */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {languageStats.map((lang) => {
            const percent = (lang.lines / totalLines) * 100;
            return (
              <div key={lang.name} className="flex items-center gap-1.5 text-sm">
                <span className={`w-3 h-3 rounded-full ${lang.color}`} />
                <span className="font-medium">{lang.name}</span>
                <span className="text-slate-500">{percent.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 统计数字 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {projectStats.stats.map((stat) => {
          const IconComponent = iconMap[stat.icon];
          return (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white dark:bg-slate-800 border">
              <span className="text-2xl block mb-1">
                {IconComponent && <IconComponent className="w-6 h-6 mx-auto" weight="light" />}
              </span>
              <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>
                {formatNumber(stat.value)}
              </div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* 里程碑进度 */}
      <div className="space-y-3">
        <h4 className="font-bold flex items-center gap-2">
          <Crosshair className="w-5 h-5" weight="light" />
          Development Progress
        </h4>
        <div className="grid gap-2">
          {milestones.map((m) => {
            const IconComponent = iconMap[m.icon];
            return (
              <div key={m.title} className="flex items-center gap-3">
                <span className="text-lg w-6">
                  {IconComponent && <IconComponent className="w-5 h-5" weight="light" />}
                </span>
                <span className="w-28 text-sm">{m.title}</span>
                <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.progress >= 80 ? 'bg-green-500' :
                      m.progress >= 50 ? 'bg-blue-500' :
                      m.progress >= 30 ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-slate-500">{m.progress}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 更新时间 */}
      <p className="text-xs text-slate-400 text-center">
        Updated: {projectStats.updatedAt} • Excludes 3rd party libraries
      </p>
    </div>
  );
}
