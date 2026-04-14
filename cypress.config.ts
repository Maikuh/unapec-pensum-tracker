import { defineConfig } from 'cypress'

export default defineConfig({
	allowCypressEnv: false,
	e2e: {
		baseUrl: 'http://localhost:3000/unapec-pensum-tracker',
		viewportWidth: 1280,
		viewportHeight: 768,
		specPattern: 'cypress/e2e/**/*.cy.ts',
		supportFile: 'cypress/support/e2e.ts',
	},

	component: {
		devServer: {
			framework: 'next',
			bundler: 'webpack',
		},
		specPattern: 'cypress/component/**/*.cy.{ts,tsx}',
		supportFile: 'cypress/support/component.ts',
	},
})
