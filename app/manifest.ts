import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'UNAPEC Pensum Tracker',
		short_name: 'Pensum',
		description: 'Seguimiento de asignaturas para UNAPEC',
		start_url: `${base}/`,
		scope: `${base}/`,
		display: 'standalone',
		background_color: '#09090b',
		theme_color: '#09090b',
		lang: 'es',
		icons: [
			{ src: `${base}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
			{ src: `${base}/icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
			{
				src: `${base}/icons/icon-maskable-192.png`,
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: `${base}/icons/icon-maskable-512.png`,
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	}
}
