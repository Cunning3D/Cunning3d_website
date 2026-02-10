// GitHub 贡献图数据获取
import { githubRepo } from '@/config/releases';

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0=无, 1-4=绿色深浅
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

// 从 GitHub GraphQL API 获取贡献数据
export async function fetchGitHubContributions(username: string): Promise<ContributionData | null> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  
  if (!token) {
    console.warn('[GitHub Contributions] No GITHUB_ACCESS_TOKEN, using mock data');
    return generateMockContributions();
  }

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 }, // 缓存 1 小时
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    
    const data = await res.json();
    const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
    
    if (!calendar) return generateMockContributions();

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week: any) => ({
        days: week.contributionDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          level: levelFromString(day.contributionLevel),
        })),
      })),
    };
  } catch (e) {
    console.error('[GitHub Contributions] Error:', e);
    return generateMockContributions();
  }
}

function levelFromString(level: string): 0 | 1 | 2 | 3 | 4 {
  switch (level) {
    case 'NONE': return 0;
    case 'FIRST_QUARTILE': return 1;
    case 'SECOND_QUARTILE': return 2;
    case 'THIRD_QUARTILE': return 3;
    case 'FOURTH_QUARTILE': return 4;
    default: return 0;
  }
}

// 生成 mock 数据（没有 token 时使用）
function generateMockContributions(): ContributionData {
  const weeks: ContributionWeek[] = [];
  const now = new Date();
  let total = 0;

  for (let w = 52; w >= 0; w--) {
    const days: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      
      // 随机生成贡献（周末少一点）
      const isWeekend = d === 0 || d === 6;
      const rand = Math.random();
      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      
      if (rand > (isWeekend ? 0.7 : 0.4)) {
        count = Math.floor(Math.random() * 10) + 1;
        level = count > 8 ? 4 : count > 5 ? 3 : count > 2 ? 2 : 1;
      }
      
      total += count;
      days.push({
        date: date.toISOString().split('T')[0],
        count,
        level,
      });
    }
    weeks.push({ days });
  }

  return { totalContributions: total, weeks };
}

// 获取仓库的提交者用户名
export function getRepoOwner(): string {
  return githubRepo.owner || 'o-oOvOo-o';
}
