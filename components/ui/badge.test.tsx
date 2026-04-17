import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge — contract', () => {
	it('renders children', () => {
		render(<Badge>New</Badge>)
		expect(screen.getByText('New')).toBeVisible()
	})

	it('renders each variant without errors', () => {
		const variants = [
			'default',
			'secondary',
			'destructive',
			'outline',
			'ghost',
			'link',
		] as const
		for (const variant of variants) {
			const { unmount } = render(<Badge variant={variant}>{variant}</Badge>)
			expect(screen.getByText(variant)).toBeVisible()
			unmount()
		}
	})

	it('renders as a custom element when render prop is supplied', () => {
		render(<Badge render={<a href="/x">Link badge</a>}>Link badge</Badge>)
		const link = screen.getByRole('link', { name: 'Link badge' })
		expect(link).toBeVisible()
		expect(link).toHaveAttribute('href', '/x')
	})
})
