import { defineConfig, devices } from '@playwright/test'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/unapec-pensum-tracker'

export default defineConfig({
	testDir: './e2e',
	use: {
		baseURL: `http://localhost:3000${basePath}`,
	},
	webServer: {
		command: 'bun dev',
		port: 3000,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 768 },
			},
		},
	],
})
