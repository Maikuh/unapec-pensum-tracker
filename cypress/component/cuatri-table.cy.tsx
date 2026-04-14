import { CuatriTable } from '@/components/cuatri-table'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import {
	PENSUM_CODE,
	TOTAL_CREDITS,
	cuatri1,
	cuatri2,
	graph,
	subjects,
} from './fixtures'

function mountCuatri1(creditsCount = 0) {
	cy.mount(
		<CuatriTable
			cuatri={cuatri1}
			allSubjects={subjects}
			pensumCode={PENSUM_CODE}
			creditsCount={creditsCount}
			totalCredits={TOTAL_CREDITS}
			graph={graph}
		/>,
	)
}

function mountCuatri2(creditsCount = 0) {
	cy.mount(
		<CuatriTable
			cuatri={cuatri2}
			allSubjects={subjects}
			pensumCode={PENSUM_CODE}
			creditsCount={creditsCount}
			totalCredits={TOTAL_CREDITS}
			graph={graph}
		/>,
	)
}

beforeEach(() => {
	useSelectedSubjectsStore.setState({ selectedSubjects: {} })
	useSelectedSubjectsStore.getState().initPensum(PENSUM_CODE)
})

describe('CuatriTable — rendering', () => {
	it('renders the cuatrimestre period heading', () => {
		mountCuatri1()
		cy.contains('Cuatrimestre 1').should('be.visible')
	})

	it('renders all subjects in the cuatri', () => {
		mountCuatri1()
		cy.contains('MAT010').should('be.visible')
		cy.contains('ESP101').should('be.visible')
		cy.contains('HIS010').should('be.visible')
	})

	it('shows subject names, credits, and prerequisite badges', () => {
		mountCuatri2()
		// MAT121 requires MAT010 — badge should appear
		cy.contains('MAT010').should('be.visible') // prereq badge in row
		cy.contains('MAT121').should('be.visible') // subject name
	})
})

describe('CuatriTable — subject selection', () => {
	it('selects a subject with no prerequisites on row click', () => {
		mountCuatri1()
		cy.contains('MAT010').click()
		cy.contains('MAT010')
			.closest('tr')
			.should('have.attr', 'data-selected', 'true')
	})

	it('deselects a selected subject on second click', () => {
		mountCuatri1()
		cy.contains('MAT010').click()
		cy.contains('MAT010').click()
		cy.contains('MAT010')
			.closest('tr')
			.should('have.attr', 'data-selected', 'false')
	})

	it('marks subjects with unmet prerequisites as disabled', () => {
		mountCuatri2()
		// MAT121 requires MAT010, which is not selected → disabled
		cy.contains('MAT121')
			.closest('tr')
			.should('have.attr', 'data-disabled', 'true')
	})

	it('enables a dependent subject after its prerequisite is selected', () => {
		// First select MAT010 in cuatri1
		mountCuatri1()
		cy.contains('MAT010').click()

		// Now mount cuatri2 — MAT121 should be enabled
		mountCuatri2()
		cy.contains('MAT121')
			.closest('tr')
			.should('have.attr', 'data-disabled', 'false')
	})

	it('shows prerequisite alert when clicking a disabled subject', () => {
		mountCuatri2()
		cy.contains('MAT121').click()
		cy.get("[role='alertdialog']").should('be.visible')
		cy.contains('Entendido').click()
		cy.get("[role='alertdialog']").should('not.exist')
	})
})

describe('CuatriTable — cascade deselection', () => {
	it('cascade-deselects dependents when a prerequisite is removed', () => {
		// Select MAT010, then mount cuatri2 and select MAT121
		mountCuatri1()
		cy.contains('MAT010').click()

		mountCuatri2()
		cy.contains('MAT121').click()
		cy.contains('MAT121')
			.closest('tr')
			.should('have.attr', 'data-selected', 'true')

		// Go back to cuatri1 and deselect MAT010
		mountCuatri1()
		cy.contains('MAT010').click()

		// Now re-mount cuatri2 — MAT121 should be deselected and disabled
		mountCuatri2()
		cy.contains('MAT121')
			.closest('tr')
			.should('have.attr', 'data-selected', 'false')
		cy.contains('MAT121')
			.closest('tr')
			.should('have.attr', 'data-disabled', 'true')
	})
})

describe('CuatriTable — select-all checkbox', () => {
	it('selects all available subjects when checkbox is unchecked', () => {
		mountCuatri1()
		cy.get("[data-testid='select-all-checkbox']").click()
		cy.get('tbody tr').each(($row) => {
			cy.wrap($row).should('have.attr', 'data-selected', 'true')
		})
	})

	it('deselects all subjects when checkbox is checked', () => {
		mountCuatri1()
		// Select all first
		cy.get("[data-testid='select-all-checkbox']").click()
		// Click again to deselect all
		cy.get("[data-testid='select-all-checkbox']").click()
		cy.get('tbody tr').each(($row) => {
			cy.wrap($row).should('have.attr', 'data-selected', 'false')
		})
	})

	it('shows indeterminate state when some subjects are selected', () => {
		mountCuatri1()
		// Select just one of three subjects
		cy.contains('MAT010').click()
		cy.get("[data-testid='select-all-checkbox']").should(
			'have.attr',
			'data-state',
			'indeterminate',
		)
	})

	it('shows checked state when all subjects are selected', () => {
		mountCuatri1()
		cy.get("[data-testid='select-all-checkbox']").click()
		cy.get("[data-testid='select-all-checkbox']").should(
			'have.attr',
			'data-state',
			'checked',
		)
	})

	it('does not select disabled subjects via select-all', () => {
		mountCuatri2()
		// MAT121 and ESP106 both have unmet prereqs — checkbox should be disabled
		cy.get("[data-testid='select-all-checkbox']").should(
			'have.attr',
			'data-state',
			'disabled',
		)
	})
})
