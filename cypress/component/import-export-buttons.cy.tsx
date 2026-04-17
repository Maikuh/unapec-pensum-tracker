import { ImportExportButtons } from '@/components/import-export-buttons'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import type { SelectedSubjects } from '@/types/pensum'

const VALID_DATA: SelectedSubjects = {
	ADMR11: [
		{
			code: 'MAT010',
			name: 'Matemáticas I',
			credits: 4,
			prerequisites: [],
		},
	],
}

function mountButtons() {
	cy.mount(
		<TooltipProvider>
			<ImportExportButtons />
		</TooltipProvider>,
	)
}

beforeEach(() => {
	useSelectedSubjectsStore.setState({ selectedSubjects: {} })
})

describe('ImportExportButtons — rendering', () => {
	it('renders export and import buttons', () => {
		mountButtons()
		cy.get('[aria-label="Exportar datos a archivo"]').should('be.visible')
		cy.get('[aria-label="Importar datos de archivo"]').should('be.visible')
	})
})

describe('ImportExportButtons — export', () => {
	it('shows tooltip on export button hover', () => {
		mountButtons()
		cy.get('[aria-label="Exportar datos a archivo"]').trigger('mouseenter')
		cy.contains('Exportar datos').should('be.visible')
	})
})

describe('ImportExportButtons — import', () => {
	it('calls importFromFile and updates store with valid JSON', () => {
		mountButtons()
		cy.get('input[type=file]').selectFile(
			{
				contents: Cypress.Buffer.from(JSON.stringify(VALID_DATA)),
				fileName: 'uptracker.json',
				mimeType: 'application/json',
			},
			{ force: true },
		)
		cy.wrap(null).should(() => {
			expect(
				useSelectedSubjectsStore.getState().selectedSubjects,
			).to.deep.equal(VALID_DATA)
		})
	})

	it('shows alert for non-JSON file type', () => {
		cy.window().then((win) => cy.stub(win, 'alert').as('alert'))
		mountButtons()
		cy.get('input[type=file]').selectFile(
			{
				contents: Cypress.Buffer.from('hello'),
				fileName: 'test.txt',
				mimeType: 'text/plain',
			},
			{ force: true },
		)
		cy.get('@alert').should(
			'have.been.calledWith',
			'Por favor seleccione un archivo JSON válido',
		)
	})

	it('shows alert for malformed JSON', () => {
		cy.window().then((win) => cy.stub(win, 'alert').as('alert'))
		mountButtons()
		cy.get('input[type=file]').selectFile(
			{
				contents: Cypress.Buffer.from('{ not valid json }'),
				fileName: 'bad.json',
				mimeType: 'application/json',
			},
			{ force: true },
		)
		cy.get('@alert').should(
			'have.been.calledWith',
			'El archivo no es un JSON válido',
		)
	})

	it('shows alert when JSON does not match expected structure', () => {
		cy.window().then((win) => cy.stub(win, 'alert').as('alert'))
		mountButtons()
		cy.get('input[type=file]').selectFile(
			{
				contents: Cypress.Buffer.from(JSON.stringify({ wrong: 'structure' })),
				fileName: 'bad-shape.json',
				mimeType: 'application/json',
			},
			{ force: true },
		)
		cy.get('@alert').should(
			'have.been.calledWith',
			'El archivo no tiene el formato esperado',
		)
	})
})
