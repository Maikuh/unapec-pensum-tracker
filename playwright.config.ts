import { defineConfig, devices } from '@playwright/test'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/unapec-pensum-tracker'
const baseURL = `http://localhost:3000${basePath}`

export default defineConfig({
	testDir: './e2e',
	use: {
		baseURL,
	},
	webServer: {
		command: process.env.CI
			? `mkdir -p .e2e-serve && cp -r out .e2e-serve/${basePath.slice(1)} && bunx serve .e2e-serve`
			: 'bun dev',
		url: baseURL,
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
