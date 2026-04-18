import type { NextConfig } from 'next'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/unapec-pensum-tracker'

const nextConfig: NextConfig = {
	/* config options here */
	output: 'export',
	basePath,
	reactCompiler: true,
	images: {
		unoptimized: true,
	},
	async headers() {
		return [
			{
				source: '/_next/static/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						// Cache for 1 year (31536000 seconds)
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		]
	},
}

export default nextConfig
