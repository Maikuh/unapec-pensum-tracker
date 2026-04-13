import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	output: 'export',
	basePath: '/unapec-pensum-tracker',
	reactCompiler: true,
	images: {
		unoptimized: true,
	},
}

export default nextConfig
