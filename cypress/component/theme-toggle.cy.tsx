import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

function mount(defaultTheme: 'light' | 'dark' = 'light') {
	cy.mount(
		<ThemeProvider
			attribute="class"
			defaultTheme={defaultTheme}
			enableSystem={false}
		>
			<ThemeToggle />
		</ThemeProvider>,
	)
}

describe('ThemeToggle', () => {
	it('renders the toggle button', () => {
		mount()
		cy.get('[aria-label="Toggle theme"]').should('be.visible')
	})

	it('switches to dark theme when clicked in light mode', () => {
		mount('light')
		cy.get('html').should('not.have.class', 'dark')
		cy.get('[aria-label="Toggle theme"]').click()
		cy.get('html').should('have.class', 'dark')
	})

	it('switches to light theme when clicked in dark mode', () => {
		mount('dark')
		cy.get('html').should('have.class', 'dark')
		cy.get('[aria-label="Toggle theme"]').click()
		cy.get('html').should('not.have.class', 'dark')
	})

	it('toggles back and forth correctly', () => {
		mount('light')
		cy.get('[aria-label="Toggle theme"]').click()
		cy.get('html').should('have.class', 'dark')
		cy.get('[aria-label="Toggle theme"]').click()
		cy.get('html').should('not.have.class', 'dark')
	})
})
