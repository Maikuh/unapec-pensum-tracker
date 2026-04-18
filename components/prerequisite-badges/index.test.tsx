import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithTooltip } from '@/test/utils'
import { PrerequisiteBadges } from './index'

describe('PrerequisiteBadges', () => {
	it('renders nothing when prerequisites are empty', () => {
		const { container } = renderWithTooltip(
			<PrerequisiteBadges prerequisites={[]} />,
		)
		expect(container).toBeEmptyDOMElement()
	})

	it('renders a rose badge for a subject code prerequisite', () => {
		renderWithTooltip(<PrerequisiteBadges prerequisites={['MAT010']} />)
		const badge = screen.getByText('MAT010')
		expect(badge).toBeVisible()
		expect(badge).toHaveClass('bg-rose-100')
	})

	it('renders an amber badge for a credit percentage prerequisite', () => {
		renderWithTooltip(<PrerequisiteBadges prerequisites={['60%']} />)
		const badge = screen.getByText('60% créditos')
		expect(badge).toBeVisible()
		expect(badge).toHaveClass('bg-amber-100')
	})

	it('extracts percentage from a longer credit string', () => {
		renderWithTooltip(
			<PrerequisiteBadges prerequisites={['60% de los creditos del pensum']} />,
		)
		expect(screen.getByText('60% créditos')).toBeVisible()
	})

	it('renders multiple badges', () => {
		renderWithTooltip(
			<PrerequisiteBadges prerequisites={['MAT010', 'ESP101']} />,
		)
		expect(screen.getByText('MAT010')).toBeVisible()
		expect(screen.getByText('ESP101')).toBeVisible()
	})

	it('uses indigo badge colors when isSelected=true for a code prereq', () => {
		renderWithTooltip(
			<PrerequisiteBadges prerequisites={['MAT010']} isSelected />,
		)
		const badge = screen.getByText('MAT010')
		expect(badge).toHaveClass('bg-indigo-700/70')
	})

	it('uses white/indigo colors when isSelected=true for a credit prereq', () => {
		renderWithTooltip(<PrerequisiteBadges prerequisites={['60%']} isSelected />)
		const badge = screen.getByText('60% créditos')
		expect(badge).toHaveClass('bg-white')
	})

	it('uses getTooltipContent to customise tooltip text', async () => {
		const user = userEvent.setup()
		renderWithTooltip(
			<PrerequisiteBadges
				prerequisites={['MAT010']}
				getTooltipContent={() => 'PRE-CALCULO'}
			/>,
		)
		await user.hover(screen.getByRole('button'))
		expect(await screen.findByText('PRE-CALCULO')).toBeVisible()
	})
})
