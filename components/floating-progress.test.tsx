import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FloatingProgress } from './floating-progress'

const defaultProps = {
	subjectsCount: 0,
	totalSubjects: 10,
	creditsCount: 0,
	totalCredits: 100,
	visible: true,
}

describe('FloatingProgress — rendering', () => {
	it('has correct role and aria-label', () => {
		render(<FloatingProgress {...defaultProps} />)
		const el = screen.getByRole('status')
		expect(el).toBeVisible()
		expect(el).toHaveAttribute('aria-label', 'Progreso del pensum')
	})

	it('displays both progress bars', () => {
		render(<FloatingProgress {...defaultProps} />)
		expect(screen.getAllByRole('progressbar')).toHaveLength(2)
	})
})

describe('FloatingProgress — percentages', () => {
	it('calculates and displays subject percentage', () => {
		render(
			<FloatingProgress
				{...defaultProps}
				subjectsCount={5}
				totalSubjects={10}
			/>,
		)
		expect(screen.getByText('50%')).toBeVisible()
	})

	it('calculates and displays credit percentage', () => {
		render(
			<FloatingProgress
				{...defaultProps}
				creditsCount={75}
				totalCredits={100}
			/>,
		)
		expect(screen.getByText('75%')).toBeVisible()
	})

	it('shows 100% twice when fully completed', () => {
		render(
			<FloatingProgress
				subjectsCount={10}
				totalSubjects={10}
				creditsCount={100}
				totalCredits={100}
				visible={true}
			/>,
		)
		expect(screen.getAllByText('100%')).toHaveLength(2)
	})

	it('rounds fractional percentages', () => {
		render(
			<FloatingProgress
				{...defaultProps}
				subjectsCount={1}
				totalSubjects={3}
			/>,
		)
		expect(screen.getByText('33%')).toBeVisible()
	})
})

describe('FloatingProgress — visibility', () => {
	it('sets aria-hidden to false when visible', () => {
		const { container } = render(
			<FloatingProgress {...defaultProps} visible={true} />,
		)
		expect(container.firstChild).toHaveAttribute('aria-hidden', 'false')
	})

	it('sets aria-hidden to true when not visible', () => {
		const { container } = render(
			<FloatingProgress {...defaultProps} visible={false} />,
		)
		expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
	})
})
