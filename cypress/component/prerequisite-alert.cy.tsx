import { PrerequisiteAlert } from '@/components/prerequisite-alert'

describe('PrerequisiteAlert', () => {
	it('is not visible when open=false', () => {
		cy.mount(
			<PrerequisiteAlert
				open={false}
				onClose={cy.stub()}
				title="Test Title"
				message="Test message"
			/>,
		)
		cy.get("[role='alertdialog']").should('not.exist')
	})

	it('shows title and message when open=true', () => {
		cy.mount(
			<PrerequisiteAlert
				open={true}
				onClose={cy.stub()}
				title="No puede seleccionar esta materia"
				message="No tienes los prerrequisitos completados."
			/>,
		)
		cy.get("[role='alertdialog']").should('be.visible')
		cy.contains('No puede seleccionar esta materia').should('be.visible')
		cy.contains('No tienes los prerrequisitos completados.').should('be.visible')
	})

	it('calls onClose when action button is clicked', () => {
		const onClose = cy.stub().as('onClose')
		cy.mount(
			<PrerequisiteAlert
				open={true}
				onClose={onClose}
				title="Test Title"
				message="Test message"
			/>,
		)
		cy.contains('Entendido').click()
		cy.get('@onClose').should('have.been.calledOnce')
	})
})
