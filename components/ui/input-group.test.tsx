import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from './input-group'

describe('InputGroup — addon focus delegation', () => {
	it('clicking the addon focuses the associated input', async () => {
		render(
			<InputGroup>
				<InputGroupAddon align="inline-start">@</InputGroupAddon>
				<InputGroupInput placeholder="username" />
			</InputGroup>,
		)
		await userEvent.click(screen.getByText('@'))
		expect(screen.getByPlaceholderText('username')).toHaveFocus()
	})

	it('clicking a button inside the addon does NOT focus the input', async () => {
		render(
			<InputGroup>
				<InputGroupAddon align="inline-end">
					<InputGroupButton>Clear</InputGroupButton>
				</InputGroupAddon>
				<InputGroupInput placeholder="search" />
			</InputGroup>,
		)
		await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
		expect(screen.getByPlaceholderText('search')).not.toHaveFocus()
	})
})

describe('InputGroupInput', () => {
	it('renders an input element', () => {
		render(<InputGroupInput placeholder="type here" />)
		expect(screen.getByPlaceholderText('type here')).toBeVisible()
	})

	it('fires onChange when typing', async () => {
		const onChange = vi.fn()
		render(<InputGroupInput onChange={onChange} />)
		await userEvent.type(screen.getByRole('textbox'), 'abc')
		expect(onChange).toHaveBeenCalled()
	})
})

describe('InputGroupTextarea', () => {
	it('renders a textarea element', () => {
		render(<InputGroupTextarea placeholder="write here" />)
		expect(screen.getByPlaceholderText('write here')).toBeVisible()
	})
})

describe('InputGroupButton', () => {
	it('renders a button with type="button" by default', () => {
		render(<InputGroupButton>Go</InputGroupButton>)
		const btn = screen.getByRole('button', { name: 'Go' })
		expect(btn).toBeVisible()
		expect(btn).toHaveAttribute('type', 'button')
	})

	it('can be given type="submit"', () => {
		render(<InputGroupButton type="submit">Submit</InputGroupButton>)
		expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
			'type',
			'submit',
		)
	})

	it('fires onClick when clicked', async () => {
		const onClick = vi.fn()
		render(<InputGroupButton onClick={onClick}>Action</InputGroupButton>)
		await userEvent.click(screen.getByRole('button', { name: 'Action' }))
		expect(onClick).toHaveBeenCalledOnce()
	})
})

describe('InputGroupText', () => {
	it('renders its children', () => {
		render(<InputGroupText>USD</InputGroupText>)
		expect(screen.getByText('USD')).toBeVisible()
	})
})
