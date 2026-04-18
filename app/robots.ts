import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const base = 'https://unapec-pensum-tracker.vercel.app'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
		},
		sitemap: `${base}/sitemap.xml`,
	}
}
