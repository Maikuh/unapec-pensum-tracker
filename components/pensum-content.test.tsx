import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import {
	PENSUM_CODE,
	period1,
	period2,
	period3,
	TOTAL_CREDITS,
} from '@/test/fixtures/pensum'
import type { Pensum } from '@/types'
import { PensumContent } from './pensum-content'

vi.mock('@/components/prerequisite-diagram/lazy', () => ({
	LazyPrerequisiteDiagram: ({
		selectedCodes,
	}: {
		selectedCodes: Set<string>
		periodByCode: Map<string, number>
	}) => <div data-testid="diagram" data-selected-count={selectedCodes.size} />,
}))

const MOCK_PENSUM: Pensum = {
	pensumCode: PENSUM_CODE,
	carreerName: 'Carrera de Prueba',
	date: '2021-01-01T04:00:00.000Z',
	totalCredits: TOTAL_CREDITS,
	periods: [period1, period2, period3],
	certifications: { intro: [], groups: [] },
	electives: { intro: [], groups: [] },
}

beforeEach(() => {
	useSelectedSubjectsStore.setState({ selectedSubjects: {} })
	localStorage.clear()
})

describe('PensumContent — rendering', () => {
	it('renders the career name heading', () => {
		render(<PensumContent pensum={MOCK_PENSUM} />)
		expect(
			screen.getByRole('heading', { name: 'Carrera de Prueba' }),
		).toBeVisible()
	})

	it('renders a table section for each cuatrimestre', () => {
		render(<PensumContent pensum={MOCK_PENSUM} />)
		expect(screen.getByText('Cuatrimestre 1')).toBeVisible()
		expect(screen.getByText('Cuatrimestre 2')).toBeVisible()
		expect(screen.getByText('Cuatrimestre 3')).toBeVisible()
	})

	it('renders the floating progress indicator', () => {
		render(<PensumContent pensum={MOCK_PENSUM} />)
		expect(screen.getByRole('status')).toBeInTheDocument()
	})

	it('renders an InfoCard with totals', () => {
		render(<PensumContent pensum={MOCK_PENSUM} />)
		expect(screen.getByTestId('total-subjects')).toHaveTextContent(
			String(MOCK_PENSUM.periods.flatMap((c) => c.subjects).length),
		)
		expect(screen.getByTestId('total-credits')).toHaveTextContent(
			String(TOTAL_CREDITS),
		)
	})
})

describe('PensumContent — diagram', () => {
	it('renders a "Ver diagrama" button', () => {
		render(<PensumContent pensum={MOCK_PENSUM} />)
		expect(
			screen.getByRole('button', { name: /ver diagrama/i }),
		).toBeInTheDocument()
	})

	it('opens the diagram dialog when the button is clicked', async () => {
		render(<PensumContent pensum={MOCK_PENSUM} />)
		await userEvent.click(screen.getByRole('button', { name: /ver diagrama/i }))
		expect(screen.getByTestId('diagram')).toBeInTheDocument()
	})

	it('passes selected subjects count to the diagram', async () => {
		useSelectedSubjectsStore.setState({
			selectedSubjects: {
				[PENSUM_CODE]: [
					{
						code: 'MAT010',
						name: 'PRE-CALCULO',
						credits: 4,
						prerequisites: [],
					},
					{ code: 'ESP101', name: 'ESPAÑOL I', credits: 3, prerequisites: [] },
				],
			},
		})
		render(<PensumContent pensum={MOCK_PENSUM} />)
		await userEvent.click(screen.getByRole('button', { name: /ver diagrama/i }))
		expect(screen.getByTestId('diagram')).toHaveAttribute(
			'data-selected-count',
			'2',
		)
	})
})

describe('PensumContent — store integration', () => {
	it('initializes an empty selection for the pensum once the store is hydrated', async () => {
		await useSelectedSubjectsStore.persist.rehydrate()
		render(<PensumContent pensum={MOCK_PENSUM} />)
		await waitFor(() => {
			expect(
				useSelectedSubjectsStore.getState().selectedSubjects[PENSUM_CODE],
			).toEqual([])
		})
	})

	it('does not overwrite existing selections when remounted', async () => {
		const existing = [
			{ code: 'MAT010', name: 'PRE-CALCULO', credits: 4, prerequisites: [] },
		]
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM_CODE]: existing },
		})
		render(<PensumContent pensum={MOCK_PENSUM} />)
		await waitFor(() => {
			expect(
				useSelectedSubjectsStore.getState().selectedSubjects[PENSUM_CODE],
			).toEqual(existing)
		})
	})
})

describe('PensumContent — saved data sync', () => {
	it('refreshes stale saved subjects and drops codes no longer in the pensum', async () => {
		localStorage.setItem(
			'selectedSubjects',
			JSON.stringify({
				state: {
					selectedSubjects: {
						[PENSUM_CODE]: [
							{
								code: 'MAT010',
								name: 'OLD NAME',
								credits: 1,
								prerequisites: [],
							},
							{
								code: 'GONE01',
								name: 'REMOVED',
								credits: 9,
								prerequisites: [],
							},
						],
					},
				},
				version: 0,
			}),
		)
		await useSelectedSubjectsStore.persist.rehydrate()
		render(<PensumContent pensum={MOCK_PENSUM} />)
		await waitFor(() => {
			expect(
				useSelectedSubjectsStore.getState().selectedSubjects[PENSUM_CODE],
			).toEqual([
				{ code: 'MAT010', name: 'PRE-CALCULO', credits: 4, prerequisites: [] },
			])
		})
		expect(screen.getByTestId('credits-count')).toHaveTextContent('4')
	})
})

describe('PensumContent — available subjects', () => {
	it('counts subjects whose prerequisites are met and lists them', async () => {
		useSelectedSubjectsStore.setState({
			selectedSubjects: {
				[PENSUM_CODE]: [
					{
						code: 'MAT010',
						name: 'PRE-CALCULO',
						credits: 4,
						prerequisites: [],
					},
				],
			},
		})
		render(<PensumContent pensum={MOCK_PENSUM} />)
		// ESP101, HIS010 (no prereqs) + MAT121 (MAT010 done)
		expect(screen.getByTestId('available-count')).toHaveTextContent('3')
		await userEvent.click(screen.getByRole('button', { name: /ver lista/i }))
		const items = await screen.findAllByTestId('available-subject')
		expect(items.map((li) => li.textContent)).toEqual([
			expect.stringContaining('ESP101'),
			expect.stringContaining('HIS010'),
			expect.stringContaining('MAT121'),
		])
	})
})

describe('PensumContent — reset progress', () => {
	it('clears the selection for this pensum only after confirming', async () => {
		useSelectedSubjectsStore.setState({
			selectedSubjects: {
				[PENSUM_CODE]: [
					{
						code: 'MAT010',
						name: 'PRE-CALCULO',
						credits: 4,
						prerequisites: [],
					},
				],
				OTHER1: [{ code: 'X', name: 'X', credits: 3, prerequisites: [] }],
			},
		})
		render(<PensumContent pensum={MOCK_PENSUM} />)
		await userEvent.click(
			screen.getByRole('button', { name: /reiniciar progreso/i }),
		)
		await userEvent.click(
			await screen.findByRole('button', { name: /^reiniciar$/i }),
		)
		const { selectedSubjects } = useSelectedSubjectsStore.getState()
		expect(selectedSubjects[PENSUM_CODE]).toEqual([])
		expect(selectedSubjects.OTHER1).toHaveLength(1)
	})
})

describe('PensumContent — external prerequisites', () => {
	it('does not block subjects whose prerequisite is outside the pensum', async () => {
		const pensum: Pensum = {
			...MOCK_PENSUM,
			periods: [
				{
					number: 1,
					subjects: [
						{
							code: 'ENG010',
							name: 'INGLES AVANZADO',
							credits: 3,
							prerequisites: ['ENG008'],
						},
					],
				},
			],
		}
		render(<PensumContent pensum={pensum} />)
		expect(screen.getByTestId('external-prerequisite')).toHaveTextContent(
			'ENG008',
		)
		await userEvent.click(screen.getByText('INGLES AVANZADO'))
		expect(
			useSelectedSubjectsStore
				.getState()
				.selectedSubjects[PENSUM_CODE]?.map((s) => s.code),
		).toEqual(['ENG010'])
	})
})

describe('PensumContent — legacy pensum', () => {
	it('shows a notice for pensums UNAPEC no longer lists', () => {
		render(<PensumContent pensum={{ ...MOCK_PENSUM, legacy: true }} />)
		expect(screen.getByTestId('legacy-notice')).toBeVisible()
	})

	it('hides the notice for current pensums', () => {
		render(<PensumContent pensum={MOCK_PENSUM} />)
		expect(screen.queryByTestId('legacy-notice')).not.toBeInTheDocument()
	})
})
