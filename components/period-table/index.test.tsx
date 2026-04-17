import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import {
	graph,
	PENSUM_CODE,
	period1,
	period2,
	period3,
	subjects,
	TOTAL_CREDITS,
} from '@/test/fixtures/pensum'
import { PeriodTable } from './index'

function getRow(el: Element): Element {
	const row = el.closest('tr')
	if (!row) throw new Error('no <tr> ancestor found')
	return row
}

function tableProps(period: typeof period1) {
	return {
		period,
		allSubjects: subjects,
		pensumCode: PENSUM_CODE,
		creditsCount: 0,
		totalCredits: TOTAL_CREDITS,
		graph,
	}
}

function renderPeriod1() {
	return render(<PeriodTable {...tableProps(period1)} />)
}

function renderPeriod2() {
	return render(<PeriodTable {...tableProps(period2)} />)
}

function renderAllPeriods() {
	return render(
		<>
			<PeriodTable {...tableProps(period1)} />
			<PeriodTable {...tableProps(period2)} />
			<PeriodTable {...tableProps(period3)} />
		</>,
	)
}

beforeEach(() => {
	useSelectedSubjectsStore.setState({ selectedSubjects: {} })
	useSelectedSubjectsStore.getState().initPensum(PENSUM_CODE)
	localStorage.clear()
})

describe('PeriodTable — rendering', () => {
	it('renders the cuatrimestre period heading', () => {
		renderPeriod1()
		expect(screen.getByText('Cuatrimestre 1')).toBeVisible()
	})

	it('renders all subjects in the period', () => {
		renderPeriod1()
		expect(screen.getByText('MAT010')).toBeVisible()
		expect(screen.getByText('ESP101')).toBeVisible()
		expect(screen.getByText('HIS010')).toBeVisible()
	})

	it('shows subject names and prerequisite badges', () => {
		renderPeriod2()
		expect(screen.getByText('MAT010')).toBeVisible()
		expect(screen.getByText('MAT121')).toBeVisible()
	})
})

describe('PeriodTable — subject selection', () => {
	it('selects a subject with no prerequisites on row click', async () => {
		renderPeriod1()
		await userEvent.click(getRow(screen.getByText('MAT010')))
		expect(screen.getByText('MAT010').closest('tr')).toHaveAttribute(
			'data-selected',
			'true',
		)
	})

	it('deselects a selected subject on second click', async () => {
		renderPeriod1()
		await userEvent.click(getRow(screen.getByText('MAT010')))
		await userEvent.click(getRow(screen.getByText('MAT010')))
		expect(screen.getByText('MAT010').closest('tr')).toHaveAttribute(
			'data-selected',
			'false',
		)
	})

	it('marks subjects with unmet prerequisites as disabled', () => {
		renderPeriod2()
		expect(screen.getByText('MAT121').closest('tr')).toHaveAttribute(
			'data-disabled',
			'true',
		)
	})

	it('enables a dependent subject after its prerequisite is selected', async () => {
		renderAllPeriods()
		await userEvent.click(getRow(screen.getAllByText('MAT010')[0]))
		await waitFor(() => {
			expect(screen.getAllByText('MAT121')[0].closest('tr')).toHaveAttribute(
				'data-disabled',
				'false',
			)
		})
	})

	it('shows prerequisite alert when clicking a disabled subject', async () => {
		renderPeriod2()
		await userEvent.click(getRow(screen.getByText('MAT121')))
		await screen.findByRole('alertdialog')
		await userEvent.click(screen.getByText('Entendido'))
		await waitFor(() =>
			expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
		)
	})
})

describe('PeriodTable — cascade deselection', () => {
	it('cascade-deselects dependents when a prerequisite is removed', async () => {
		renderAllPeriods()

		await userEvent.click(getRow(screen.getAllByText('MAT010')[0]))
		await waitFor(() => {
			expect(screen.getAllByText('MAT121')[0].closest('tr')).toHaveAttribute(
				'data-disabled',
				'false',
			)
		})

		await userEvent.click(getRow(screen.getAllByText('MAT121')[0]))
		await waitFor(() => {
			expect(screen.getAllByText('MAT121')[0].closest('tr')).toHaveAttribute(
				'data-selected',
				'true',
			)
		})

		await userEvent.click(getRow(screen.getAllByText('MAT010')[0]))

		await waitFor(() => {
			expect(screen.getAllByText('MAT121')[0].closest('tr')).toHaveAttribute(
				'data-selected',
				'false',
			)
			expect(screen.getAllByText('MAT121')[0].closest('tr')).toHaveAttribute(
				'data-disabled',
				'true',
			)
		})
	})
})

describe('PeriodTable — select-all checkbox', () => {
	it('selects all available subjects when checkbox is unchecked', async () => {
		renderPeriod1()
		await userEvent.click(screen.getByTestId('select-all-checkbox'))
		await waitFor(() => {
			for (const row of screen.getAllByRole('row').slice(1)) {
				expect(row).toHaveAttribute('data-selected', 'true')
			}
		})
	})

	it('deselects all subjects when checkbox is checked', async () => {
		renderPeriod1()
		await userEvent.click(screen.getByTestId('select-all-checkbox'))
		await userEvent.click(screen.getByTestId('select-all-checkbox'))
		await waitFor(() => {
			for (const row of screen.getAllByRole('row').slice(1)) {
				expect(row).toHaveAttribute('data-selected', 'false')
			}
		})
	})

	it('shows indeterminate state when some subjects are selected', async () => {
		renderPeriod1()
		await userEvent.click(getRow(screen.getByText('MAT010')))
		await waitFor(() => {
			expect(screen.getByTestId('select-all-checkbox')).toHaveAttribute(
				'data-state',
				'indeterminate',
			)
		})
	})

	it('shows checked state when all subjects are selected', async () => {
		renderPeriod1()
		await userEvent.click(screen.getByTestId('select-all-checkbox'))
		await waitFor(() => {
			expect(screen.getByTestId('select-all-checkbox')).toHaveAttribute(
				'data-state',
				'checked',
			)
		})
	})

	it('shows disabled state when no subjects can be selected', () => {
		renderPeriod2()
		expect(screen.getByTestId('select-all-checkbox')).toHaveAttribute(
			'data-state',
			'disabled',
		)
	})
})
