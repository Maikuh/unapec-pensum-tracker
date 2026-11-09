import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CertificationsSection } from '@/components/certifications-section'
import { renderDescItems } from '@/components/elective-table/section-intro'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { ElectiveSection } from '@/types'
import { ElectivesSection } from './index'

const SECTION: ElectiveSection = {
	intro: [
		{ type: 'p', text: 'Elige una opción.' },
		{ type: 'li', text: 'Regla A' },
		{ type: 'li', text: 'Regla B' },
		{ type: 'p', text: 'Nota final.' },
	],
	groups: [
		{
			name: 'DATOS',
			periods: [7, 8],
			footnote: [{ type: 'li', text: 'Pie de tabla' }],
			options: [
				{
					tier: 'E1',
					code: 'DAT101',
					name: 'Datos I',
					credits: 3,
					prerequisite: '50% de los créditos',
				},
			],
		},
	],
}

const EMPTY: ElectiveSection = { intro: [], groups: [] }

function renderWithTooltip(ui: React.ReactElement) {
	return render(<TooltipProvider>{ui}</TooltipProvider>)
}

describe.each([
	['ElectivesSection', ElectivesSection, 'Asignaturas Electivas'],
	['CertificationsSection', CertificationsSection, 'Certificaciones'],
] as const)('%s', (_name, Section, heading) => {
	it('renders nothing when there are no groups', () => {
		const { container } = renderWithTooltip(<Section section={EMPTY} />)
		expect(container).toBeEmptyDOMElement()
	})

	it('renders heading, intro, tables and footnotes', () => {
		renderWithTooltip(<Section section={SECTION} />)
		expect(screen.getByRole('heading', { name: heading })).toBeVisible()
		expect(screen.getByText('Elige una opción.')).toBeVisible()
		expect(screen.getByText('Regla A').tagName).toBe('LI')
		expect(screen.getByText('DATOS')).toBeVisible()
		expect(screen.getByText('Cuatrimestres VII, VIII')).toBeVisible()
		expect(screen.getByText('DAT101')).toBeVisible()
		expect(screen.getByText('Pie de tabla')).toBeVisible()
	})

	it('omits the intro block when empty', () => {
		renderWithTooltip(<Section section={{ ...SECTION, intro: [] }} />)
		expect(screen.queryByText('Elige una opción.')).not.toBeInTheDocument()
	})
})

describe('renderDescItems', () => {
	it('groups consecutive bullets into a single list, keeping order', () => {
		const { container } = render(<div>{renderDescItems(SECTION.intro)}</div>)
		const children = [...(container.firstElementChild?.children ?? [])]
		expect(children.map((el) => el.tagName)).toEqual(['P', 'UL', 'P'])
		expect(children[1].querySelectorAll('li')).toHaveLength(2)
	})

	it('handles repeated text without duplicate keys', () => {
		const items = [
			{ type: 'p' as const, text: 'Igual' },
			{ type: 'p' as const, text: 'Igual' },
			{ type: 'li' as const, text: 'X' },
			{ type: 'li' as const, text: 'X' },
		]
		const { container } = render(<div>{renderDescItems(items)}</div>)
		expect(container.querySelectorAll('p')).toHaveLength(2)
		expect(container.querySelectorAll('li')).toHaveLength(2)
	})
})
