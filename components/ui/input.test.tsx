import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './input'
import { Textarea } from './textarea'

describe('Input — contract', () => {
	it('renders with a placeholder', () => {
		render(<Input placeholder="Search…" />)
		expect(screen.getByPlaceholderText('Search…')).toBeVisible()
	})

	it('fires onChange when the user types', async () => {
		const onChange = vi.fn()
		render(<Input onChange={onChange} />)
		await userEvent.type(screen.getByRole('textbox'), 'hello')
		expect(onChange).toHaveBeenCalled()
	})

	it('reflects a controlled value', () => {
		render(<Input value="preset" onChange={vi.fn()} />)
		expect(screen.getByRole('textbox')).toHaveValue('preset')
	})

	it('is not interactive when disabled', async () => {
		const onChange = vi.fn()
		render(<Input disabled onChange={onChange} />)
		await userEvent.type(screen.getByRole('textbox'), 'x')
		expect(onChange).not.toHaveBeenCalled()
	})

	it('forwards the type prop', () => {
		render(<Input type="email" />)
		expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
	})
})

describe('Textarea — contract', () => {
	it('renders with a placeholder', () => {
		render(<Textarea placeholder="Enter description" />)
		expect(screen.getByPlaceholderText('Enter description')).toBeVisible()
	})

	it('fires onChange when the user types', async () => {
		const onChange = vi.fn()
		render(<Textarea onChange={onChange} />)
		await userEvent.type(screen.getByRole('textbox'), 'note')
		expect(onChange).toHaveBeenCalled()
	})

	it('reflects a controlled value', () => {
		render(<Textarea value="preset" onChange={vi.fn()} />)
		expect(screen.getByRole('textbox')).toHaveValue('preset')
	})

	it('is not interactive when disabled', async () => {
		const onChange = vi.fn()
		render(<Textarea disabled onChange={onChange} />)
		await userEvent.type(screen.getByRole('textbox'), 'x')
		expect(onChange).not.toHaveBeenCalled()
	})
})
