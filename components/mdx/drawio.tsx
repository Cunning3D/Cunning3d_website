import fs from 'fs/promises';
import path from 'path';
import { getLocale } from 'next-intl/server';
import { DrawioClient } from './drawio-client';

interface DrawioProps {
  /**
   * Path to the .drawio file relative to the project root.
   * Example: "content/docs/diagrams/my-chart.drawio"
   */
  file: string;
  title?: string;
  height?: string | number;
}

export async function Drawio({ file, title, height }: DrawioProps) {
  try {
    const locale = await getLocale();
    const originalPath = path.join(process.cwd(), file);
    let targetPath = originalPath;

    // Localized file logic: if locale is 'zh', try to load *.zh.drawio
    if (locale === 'zh') {
      const dir = path.dirname(originalPath);
      const ext = path.extname(originalPath);
      const name = path.basename(originalPath, ext);
      const zhPath = path.join(dir, `${name}.zh${ext}`);

      try {
        await fs.access(zhPath);
        targetPath = zhPath;
      } catch {
        // Fallback to original file if .zh doesn't exist
      }
    }

    const xml = await fs.readFile(targetPath, 'utf8');

    return <DrawioClient xml={xml} title={title} height={height} />;
  } catch (e) {
    return (
      <div className="my-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
        <p className="font-bold">Failed to load Draw.io diagram</p>
        <p>File: {file}</p>
        <p className="mt-2 text-xs opacity-80">{String(e)}</p>
      </div>
    );
  }
}
