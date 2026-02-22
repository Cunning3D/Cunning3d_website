import { NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { mePageByLocale, type MeLocale } from '@/config/me';
import { createResumePdfDocument } from './ResumePdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function asLocale(v: string | null | undefined): MeLocale | null {
  if (v === 'en' || v === 'zh') return v;
  return null;
}

function encodeRFC5987(v: string): string {
  return encodeURIComponent(v);
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const locale =
    asLocale(url.searchParams.get('locale')) ??
    asLocale(request.cookies.get('NEXT_LOCALE')?.value) ??
    'zh';

  const config = mePageByLocale[locale] ?? mePageByLocale.zh;
  const document = createResumePdfDocument({ config, locale });
  const buffer = await renderToBuffer(document);
  const body = new Uint8Array(buffer);

  const displayName =
    locale === 'zh'
      ? `${config.profile.name || 'resume'}-简历.pdf`
      : `${config.profile.name || 'resume'}-resume.pdf`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume.pdf"; filename*=UTF-8''${encodeRFC5987(displayName)}`,
      'Cache-Control': 'private, no-store, max-age=0',
    },
  });
}
