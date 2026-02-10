'use client';

import { useEffect, useState } from 'react';
import type { ContributionData, ContributionDay } from '@/lib/github-contributions';

interface Props {
  data: ContributionData;
  username: string;
}

const levelColors = [
  'bg-slate-100 dark:bg-slate-800', // 0 - none
  'bg-green-200 dark:bg-green-900', // 1
  'bg-green-400 dark:bg-green-700', // 2
  'bg-green-500 dark:bg-green-500', // 3
  'bg-green-600 dark:bg-green-400', // 4
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function GitHubContributions({ data, username }: Props) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  // 计算月份标签位置
  const getMonthLabels = () => {
    const labels: { month: string; col: number }[] = [];
    let lastMonth = -1;

    data.weeks.forEach((week, weekIdx) => {
      const firstDay = week.days[0];
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ month: months[month], col: weekIdx });
          lastMonth = month;
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-max">
        {/* 月份标签 */}
        <div className="flex text-xs text-slate-500 mb-1 ml-8">
          {monthLabels.map((label, i) => (
            <span
              key={i}
              className="absolute"
              style={{ marginLeft: `${label.col * 13 + 32}px` }}
            >
              {label.month}
            </span>
          ))}
        </div>

        <div className="flex gap-1 mt-4">
          {/* 星期标签 */}
          <div className="flex flex-col gap-[3px] text-xs text-slate-500 pr-2">
            <span className="h-[10px]"></span>
            <span className="h-[10px] leading-[10px]">Mon</span>
            <span className="h-[10px]"></span>
            <span className="h-[10px] leading-[10px]">Wed</span>
            <span className="h-[10px]"></span>
            <span className="h-[10px] leading-[10px]">Fri</span>
            <span className="h-[10px]"></span>
          </div>

          {/* 贡献格子 */}
          <div className="flex gap-[3px]">
            {data.weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {week.days.map((day, dayIdx) => (
                  <div
                    key={day.date}
                    className={`w-[10px] h-[10px] rounded-sm ${levelColors[day.level]} cursor-pointer transition-transform hover:scale-125`}
                    title={`${day.date}: ${day.count} contributions`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            @{username} on GitHub
          </a>
          <div className="flex items-center gap-1">
            <span>Less</span>
            {levelColors.map((color, i) => (
              <div key={i} className={`w-[10px] h-[10px] rounded-sm ${color}`} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            <strong>{hoveredDay.count}</strong> contributions on {hoveredDay.date}
          </div>
        )}

        {/* 总计 */}
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-green-600">{data.totalContributions.toLocaleString()}</span>
          <span className="text-slate-500 ml-2">contributions in the last year</span>
        </div>
      </div>
    </div>
  );
}
