// Cunning3D 发布版本配置 - 下载页使用
// 这个文件可以被 GitHub Action 自动更新，或者从 GitHub API 实时获取

export interface ReleaseAsset {
  name: string;
  platform: 'windows' | 'macos' | 'linux' | 'unity' | 'source';
  url: string;
  size?: string;
}

export interface Release {
  version: string;
  date: string;
  tag: string;
  changelog?: string;
  assets: ReleaseAsset[];
  isLatest?: boolean;
  isPrerelease?: boolean;
}

// GitHub 仓库信息（用于 API 调用）
export const githubRepo = {
  owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'user',
  repo: process.env.NEXT_PUBLIC_GITHUB_REPO || 'Cunning3D',
};

// 静态版本列表（备用，当 API 不可用时使用）
// 建议用 GitHub Action 定时更新这个文件
export const releases: Release[] = [
  // 示例数据，实际由 sync 脚本生成
  // {
  //   version: '0.1.0',
  //   date: '2025-01-15',
  //   tag: 'v0.1.0',
  //   isLatest: true,
  //   assets: [
  //     { name: 'Cunning3D-0.1.0-win64.zip', platform: 'windows', url: '...', size: '45 MB' },
  //     { name: 'Cunning3D-0.1.0-unity.unitypackage', platform: 'unity', url: '...', size: '12 MB' },
  //   ],
  // },
];
