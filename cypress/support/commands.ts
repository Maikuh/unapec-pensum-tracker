declare namespace Cypress {
	interface Chainable {
		/**
		 * Navigate to a pensum page by visiting it directly.
		 * @example cy.selectCareer()           // defaults to NIN11
		 * @example cy.selectCareer("ISO10")
		 */
		selectCareer(pensumCode?: string): Chainable<void>

		/**
		 * Select a career via the home page combobox.
		 * @example cy.selectCareerFromHome("negocios")
		 */
		selectCareerFromHome(searchText?: string): Chainable<void>
	}
}

Cypress.Commands.add('selectCareer', (pensumCode = 'NIN11') => {
	cy.visit(`/pensums/${pensumCode}`)
	cy.contains('Informacion').should('be.visible')
})

Cypress.Commands.add('selectCareerFromHome', (searchText = 'negocios') => {
	cy.visit('/')
	// Wait for aria-haspopup to confirm React has hydrated and attached event handlers
	cy.get("[data-testid='career-search-trigger']")
		.should('have.attr', 'aria-haspopup', 'dialog')
		.click()
	cy.get("[data-testid='career-search-input']").type(searchText)
	cy.get("[data-testid='career-search-option']").first().click()
	cy.url().should('include', '/pensums/')
	cy.contains('Informacion').should('be.visible')
})
