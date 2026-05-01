import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT ?? '3000')

const baseURL = `http://localhost:${PORT}`

export default defineConfig({
	testDir: './e2e',
	use: {
		baseURL,
	},
	webServer: {
		command: process.env.CI ? 'bunx serve out' : `bun dev -- -p ${PORT}`,
		port: PORT,
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
