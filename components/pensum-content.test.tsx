import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
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

describe('PensumContent — store integration', () => {
	it('initializes an empty selection for the pensum on mount', async () => {
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
