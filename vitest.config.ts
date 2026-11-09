import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		include: ['**/*.test.ts', '**/*.test.tsx'],
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		coverage: {
			provider: 'istanbul',
			include: ['components/**', 'lib/**', 'scripts/lib/**'],
			exclude: [
				'**/*.test.{ts,tsx}',
				'**/*.json',
				'lib/data/pensum-pages.ts', // generated
				// ReactFlow needs real layout; covered by e2e/diagram.spec.ts
				'components/prerequisite-diagram/index.tsx',
				'components/prerequisite-diagram/lazy.tsx',
			],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 75,
				statements: 80,
				perFile: true,
				autoUpdate: false,
			},
		},
	},
	resolve: {
		tsconfigPaths: true,
	},
})
