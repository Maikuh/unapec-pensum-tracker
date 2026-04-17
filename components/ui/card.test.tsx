import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './card'

describe('Card — contract', () => {
	it('renders children', () => {
		render(<Card>body</Card>)
		expect(screen.getByText('body')).toBeVisible()
	})

	it('sets data-size="sm" when size="sm"', () => {
		const { container } = render(<Card size="sm">x</Card>)
		expect(container.querySelector('[data-slot="card"]')).toHaveAttribute(
			'data-size',
			'sm',
		)
	})

	it('defaults to data-size="default"', () => {
		const { container } = render(<Card>x</Card>)
		expect(container.querySelector('[data-slot="card"]')).toHaveAttribute(
			'data-size',
			'default',
		)
	})
})

describe('Card sub-components — render children', () => {
	it('CardHeader', () => {
		render(<CardHeader>header</CardHeader>)
		expect(screen.getByText('header')).toBeVisible()
	})

	it('CardTitle', () => {
		render(<CardTitle>My Title</CardTitle>)
		expect(screen.getByText('My Title')).toBeVisible()
	})

	it('CardDescription', () => {
		render(<CardDescription>Some description</CardDescription>)
		expect(screen.getByText('Some description')).toBeVisible()
	})

	it('CardContent', () => {
		render(<CardContent>content</CardContent>)
		expect(screen.getByText('content')).toBeVisible()
	})

	it('CardFooter', () => {
		render(<CardFooter>footer</CardFooter>)
		expect(screen.getByText('footer')).toBeVisible()
	})

	it('CardAction', () => {
		render(<CardAction>action</CardAction>)
		expect(screen.getByText('action')).toBeVisible()
	})
})
