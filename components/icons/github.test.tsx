import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Github } from './github'

describe('Github icon', () => {
	it('renders like a Lucide icon (stroke style, class, decorative by default)', () => {
		const { container } = render(<Github className="h-5 w-5" />)
		const svg = container.querySelector('svg')
		expect(svg).toHaveClass('lucide', 'h-5', 'w-5')
		expect(svg).toHaveAttribute('stroke', 'currentColor')
		expect(svg).toHaveAttribute('fill', 'none')
		expect(svg).toHaveAttribute('aria-hidden', 'true')
		expect(svg?.querySelectorAll('path')).toHaveLength(2)
	})

	it('drops aria-hidden when given an accessible label', () => {
		const { container } = render(<Github aria-label="GitHub" />)
		expect(container.querySelector('svg')).not.toHaveAttribute('aria-hidden')
	})
})
