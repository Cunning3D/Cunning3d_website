import { Metadata } from 'next'
import RoadmapClient from './client'

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'Cunning3D development roadmap and planned features.',
}

export default function RoadmapPage() {
  return <RoadmapClient />
}
