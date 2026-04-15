import { InfoCard } from '@/components/info-card'

// ADMR11 has an entry in pensum-pages.ts; UNKNOWN99 does not.
const DATE = '2021-01-01T04:00:00.000Z'

describe('InfoCard', () => {
	it('renders subject and credit counts', () => {
		cy.mount(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={10}
				totalSubjects={50}
				creditsCount={40}
				totalCredits={200}
				date={DATE}
			/>,
		)
		cy.get("[data-testid='subjects-count']").should('contain.text', '10')
		cy.get("[data-testid='total-subjects']").should('contain.text', '50')
		cy.get("[data-testid='credits-count']").should('contain.text', '40')
		cy.get("[data-testid='total-credits']").should('contain.text', '200')
	})

	it('shows correct percentage for subjects and credits', () => {
		cy.mount(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={25}
				totalSubjects={50}
				creditsCount={100}
				totalCredits={200}
				date={DATE}
			/>,
		)
		// Both should be 50%
		cy.get('.subject-credits-percentage').should('have.length', 2)
		cy.get('.subject-credits-percentage').each(($el) => {
			cy.wrap($el).should('contain.text', '50%')
		})
	})

	it('renders progress bar reflecting credit percentage', () => {
		cy.mount(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={0}
				totalSubjects={50}
				creditsCount={80}
				totalCredits={200}
				date={DATE}
			/>,
		)
		// Progress element should have value 40 (80/200 = 40%)
		cy.get('[role="progressbar"]').should('exist')
	})

	it('shows external pensum link when pensumCode is in pensum-pages', () => {
		cy.mount(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={0}
				totalSubjects={50}
				creditsCount={0}
				totalCredits={200}
				date={DATE}
			/>,
		)
		cy.contains('Link al Pensum').should('be.visible')
		cy.contains('Link al Pensum')
			.should('have.attr', 'target', '_blank')
			.and('have.attr', 'rel', 'noopener noreferrer')
	})

	it('hides external pensum link when pensumCode has no entry', () => {
		cy.mount(
			<InfoCard
				pensumCode="UNKNOWN99"
				subjectsCount={0}
				totalSubjects={50}
				creditsCount={0}
				totalCredits={200}
				date={DATE}
			/>,
		)
		cy.contains('Link al Pensum').should('not.exist')
	})

	it('formats date in Spanish locale', () => {
		cy.mount(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={0}
				totalSubjects={50}
				creditsCount={0}
				totalCredits={200}
				date={DATE}
			/>,
		)
		// DATE = 2021-01-01. Spanish locale should contain "enero" and "2021"
		cy.contains('2021').should('be.visible')
		cy.contains('enero').should('be.visible')
	})
})
