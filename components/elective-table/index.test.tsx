import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { ElectiveGroup } from '@/types'
import { ElectiveTable } from './index'

function renderElectiveTable(group: ElectiveGroup) {
	return render(
		<TooltipProvider>
			<ElectiveTable group={group} />
		</TooltipProvider>,
	)
}

const baseGroup: ElectiveGroup = {
	name: 'Electivas Generales',
	periods: [3, 4],
	footnote: [],
	options: [
		{
			tier: 'A',
			code: 'ELE101',
			name: 'Introducción al Arte',
			credits: 3,
			prerequisite: '',
		},
		{
			tier: 'A',
			code: 'ELE102',
			name: 'Historia del Arte',
			credits: 3,
			prerequisite: 'ELE101',
		},
		{
			tier: 'B',
			code: 'ELE201',
			name: 'Arte Avanzado',
			credits: 3,
			prerequisite: '60%',
		},
	],
}

describe('ElectiveTable — rendering', () => {
	it('renders the group name', () => {
		renderElectiveTable(baseGroup)
		expect(screen.getByText('Electivas Generales')).toBeVisible()
	})

	it('renders period label in roman numerals', () => {
		renderElectiveTable(baseGroup)
		expect(screen.getByText('Cuatrimestres III, IV')).toBeVisible()
	})

	it('renders singular period label for a single period', () => {
		renderElectiveTable({ ...baseGroup, periods: [2] })
		expect(screen.getByText('Cuatrimestre II')).toBeVisible()
	})

	it('omits period label when periods array is empty', () => {
		renderElectiveTable({ ...baseGroup, periods: [] })
		expect(screen.queryByText(/Cuatrimestre/)).not.toBeInTheDocument()
	})

	it('renders all elective options', () => {
		renderElectiveTable(baseGroup)
		expect(screen.getByText('Introducción al Arte')).toBeVisible()
		expect(screen.getByText('Historia del Arte')).toBeVisible()
		expect(screen.getByText('Arte Avanzado')).toBeVisible()
	})

	it('renders a prerequisite badge for a code prerequisite', () => {
		renderElectiveTable(baseGroup)
		// ELE101 appears as both a code cell and a prerequisite badge for ELE102
		const matches = screen.getAllByText('ELE101')
		expect(matches.length).toBeGreaterThanOrEqual(2)
		const badge = matches.find((el) => el.tagName === 'BUTTON')
		expect(badge).toBeVisible()
	})

	it('renders a prerequisite badge for a credit-percentage prerequisite', () => {
		renderElectiveTable(baseGroup)
		expect(screen.getByText('60% créditos')).toBeVisible()
	})

	it('renders footnote items', () => {
		const groupWithFootnote: ElectiveGroup = {
			...baseGroup,
			footnote: [{ type: 'p', text: 'Nota importante sobre las electivas.' }],
		}
		renderElectiveTable(groupWithFootnote)
		expect(
			screen.getByText('Nota importante sobre las electivas.'),
		).toBeVisible()
	})
})
