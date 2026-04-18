import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

import pensumsData from '@/lib/data/pensums.json'
import type { Pensum } from '@/types'

const base = 'https://unapec-pensum-tracker.vercel.app'
const pensums = pensumsData as Pensum[]

export default function sitemap(): MetadataRoute.Sitemap {
	const pensumEntries = pensums.map((p) => ({
		url: `${base}/pensums/${p.pensumCode}`,
		changeFrequency: 'yearly' as const,
		priority: 0.8,
	}))

	return [
		{
			url: base,
			changeFrequency: 'monthly',
			priority: 1,
		},
		...pensumEntries,
	]
}
