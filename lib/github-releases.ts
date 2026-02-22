// GitHub Releases API - 获取最新版本信息
import { githubRepo, releases as staticReleases, type Release, type ReleaseAsset } from '@/config/releases';

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  body: string;
  assets: {
    name: string;
    browser_download_url: string;
    size: number;
  }[];
}

// 根据文件名判断平台
function detectPlatform(name: string): ReleaseAsset['platform'] {
  const n = name.toLowerCase();
  if (n.includes('win') || n.includes('windows') || n.endsWith('.exe') || n.endsWith('.msi')) return 'windows';
  if (n.includes('mac') || n.includes('darwin') || n.includes('osx')) return 'macos';
  if (n.includes('linux') || n.endsWith('.deb') || n.endsWith('.appimage')) return 'linux';
  if (n.includes('unity') || n.endsWith('.unitypackage')) return 'unity';
  return 'source';
}

// 格式化文件大小
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 从 GitHub API 获取发布版本
export async function fetchGitHubReleases(limit = 10): Promise<Release[]> {
  const owner = String(githubRepo.owner || '').trim();
  const repo = String(githubRepo.repo || '').trim();
  if (!owner || !repo) return staticReleases;

  let res: Response;
  try {
    res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=${limit}`, {
      next: { revalidate: 3600 }, // 缓存 1 小时
    });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[GitHub Releases] API fetch failed, using static data:', e);
    }
    return staticReleases;
  }

  // If repo has no releases or repo is private/misconfigured, fall back to static releases.
  // Avoid noisy build logs during static generation.
  if (!res.ok) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[GitHub Releases] API returned non-OK, using static data:', {
        status: res.status,
        owner,
        repo,
      });
    }
    return staticReleases;
  }

  let data: GitHubRelease[];
  try {
    data = (await res.json()) as GitHubRelease[];
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[GitHub Releases] API returned invalid JSON, using static data:', e);
    }
    return staticReleases;
  }

  try {
    return data.map((r, i) => ({
      version: r.tag_name.replace(/^v/, ''),
      date: r.published_at.split('T')[0],
      tag: r.tag_name,
      changelog: r.body,
      isLatest: i === 0 && !r.prerelease,
      isPrerelease: r.prerelease,
      assets: r.assets.map((a) => ({
        name: a.name,
        platform: detectPlatform(a.name),
        url: a.browser_download_url,
        size: formatSize(a.size),
      })),
    }));
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[GitHub Releases] API returned unexpected shape, using static data:', e);
    }
    return staticReleases;
  }
}

// 获取最新版本
export async function getLatestRelease(): Promise<Release | null> {
  const releases = await fetchGitHubReleases(5);
  return releases.find((r) => !r.isPrerelease) || releases[0] || null;
}
