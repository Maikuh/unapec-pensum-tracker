import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://localhost:3000'

export default defineConfig({
	testDir: './e2e',
	use: {
		baseURL,
	},
	webServer: {
		command: process.env.CI ? 'bunx serve out' : 'bun dev',
		port: 3000,
		reuseExistingServer: !process.env.CI,
		timeout: process.env.CI ? 60_000 : 120_000,
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
