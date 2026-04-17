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
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 75,
				statements: 80,
				perFile: true,
				autoUpdate: true,
			},
		},
	},
	resolve: {
		tsconfigPaths: true,
	},
})
