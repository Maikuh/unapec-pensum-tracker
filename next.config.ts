import type { NextConfig } from 'next'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/unapec-pensum-tracker'

const nextConfig: NextConfig = {
	output: 'export',
	basePath,
	reactCompiler: true,
	images: {
		unoptimized: true,
	},
}

export default nextConfig
