import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import RoadmapClient from './client'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('roadmap')
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default function RoadmapPage() {
  return <RoadmapClient />
}
