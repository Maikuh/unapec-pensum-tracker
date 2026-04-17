import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import {
	cuatri1,
	cuatri2,
	cuatri3,
	graph,
	PENSUM_CODE,
	subjects,
	TOTAL_CREDITS,
} from '@/test/fixtures/pensum'
import { CuatriTable } from './cuatri-table'

function getRow(el: Element): Element {
	const row = el.closest('tr')
	if (!row) throw new Error('no <tr> ancestor found')
	return row
}

function tableProps(cuatri: typeof cuatri1) {
	return {
		cuatri,
		allSubjects: subjects,
		pensumCode: PENSUM_CODE,
		creditsCount: 0,
		totalCredits: TOTAL_CREDITS,
		graph,
	}
}

function renderCuatri1() {
	return render(<CuatriTable {...tableProps(cuatri1)} />)
}

function renderCuatri2() {
	return render(<CuatriTable {...tableProps(cuatri2)} />)
}

function renderAllCuatris() {
	return render(
		<>
			<CuatriTable {...tableProps(cuatri1)} />
			<CuatriTable {...tableProps(cuatri2)} />
			<CuatriTable {...tableProps(cuatri3)} />
		</>,
	)
}

beforeEach(() => {
	useSelectedSubjectsStore.setState({ selectedSubjects: {} })
	useSelectedSubjectsStore.getState().initPensum(PENSUM_CODE)
	localStorage.clear()
})

describe('CuatriTable — rendering', () => {
	it('renders the cuatrimestre period heading', () => {
		renderCuatri1()
		expect(screen.getByText('Cuatrimestre 1')).toBeVisible()
	})

	it('renders all subjects in the cuatri', () => {
		renderCuatri1()
		expect(screen.getByText('MAT010')).toBeVisible()
		expect(screen.getByText('ESP101')).toBeVisible()
		expect(screen.getByText('HIS010')).toBeVisible()
	})

	it('shows subject names and prerequisite badges', () => {
		renderCuatri2()
		expect(screen.getByText('MAT010')).toBeVisible()
		expect(screen.getByText('MAT121')).toBeVisible()
	})
})

describe('CuatriTable — subject selection', () => {
	it('selects a subject with no prerequisites on row click', async () => {
		renderCuatri1()
		await userEvent.click(getRow(screen.getByText('MAT010')))
		expect(screen.getByText('MAT010').closest('tr')).toHaveAttribute(
			'data-selected',
			'true',
		)
	})

	it('deselects a selected subject on second click', async () => {
		renderCuatri1()
		await userEvent.click(getRow(screen.getByText('MAT010')))
		await userEvent.click(getRow(screen.getByText('MAT010')))
		expect(screen.getByText('MAT010').closest('tr')).toHaveAttribute(
			'data-selected',
			'false',
		)
	})

	it('marks subjects with unmet prerequisites as disabled', () => {
		renderCuatri2()
		expect(screen.getByText('MAT121').closest('tr')).toHaveAttribute(
			'data-disabled',
			'true',
		)
	})

	it('enables a dependent subject after its prerequisite is selected', async () => {
		renderAllCuatris()
		await userEvent.click(getRow(screen.getAllByText('MAT010')[0]))
		await waitFor(() => {
			expect(screen.getAllByText('MAT121')[0].closest('tr')).toHaveAttribute(
				'data-disabled',
				'false',
			)
		})
	})

	it('shows prerequisite alert when clicking a disabled subject', async () => {
		renderCuatri2()
		await userEvent.click(getRow(screen.getByText('MAT121')))
		await screen.findByRole('alertdialog')
		await userEvent.click(screen.getByText('Entendido'))
		await waitFor(() =>
			expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
		)
	})
})

describe('CuatriTable — cascade deselection', () => {
	it('cascade-deselects dependents when a prerequisite is removed', async () => {
		renderAllCuatris()

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

describe('CuatriTable — select-all checkbox', () => {
	it('selects all available subjects when checkbox is unchecked', async () => {
		renderCuatri1()
		await userEvent.click(screen.getByTestId('select-all-checkbox'))
		await waitFor(() => {
			for (const row of screen.getAllByRole('row').slice(1)) {
				expect(row).toHaveAttribute('data-selected', 'true')
			}
		})
	})

	it('deselects all subjects when checkbox is checked', async () => {
		renderCuatri1()
		await userEvent.click(screen.getByTestId('select-all-checkbox'))
		await userEvent.click(screen.getByTestId('select-all-checkbox'))
		await waitFor(() => {
			for (const row of screen.getAllByRole('row').slice(1)) {
				expect(row).toHaveAttribute('data-selected', 'false')
			}
		})
	})

	it('shows indeterminate state when some subjects are selected', async () => {
		renderCuatri1()
		await userEvent.click(getRow(screen.getByText('MAT010')))
		await waitFor(() => {
			expect(screen.getByTestId('select-all-checkbox')).toHaveAttribute(
				'data-state',
				'indeterminate',
			)
		})
	})

	it('shows checked state when all subjects are selected', async () => {
		renderCuatri1()
		await userEvent.click(screen.getByTestId('select-all-checkbox'))
		await waitFor(() => {
			expect(screen.getByTestId('select-all-checkbox')).toHaveAttribute(
				'data-state',
				'checked',
			)
		})
	})

	it('shows disabled state when no subjects can be selected', () => {
		renderCuatri2()
		expect(screen.getByTestId('select-all-checkbox')).toHaveAttribute(
			'data-state',
			'disabled',
		)
	})
})
