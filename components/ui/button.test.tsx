import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button — contract', () => {
	it('renders children', () => {
		render(<Button>Save</Button>)
		expect(screen.getByRole('button', { name: 'Save' })).toBeVisible()
	})

	it('fires onClick when clicked', async () => {
		const onClick = vi.fn()
		render(<Button onClick={onClick}>Click</Button>)
		await userEvent.click(screen.getByRole('button'))
		expect(onClick).toHaveBeenCalledOnce()
	})

	it('does not fire onClick when disabled', async () => {
		const onClick = vi.fn()
		render(
			<Button disabled onClick={onClick}>
				Disabled
			</Button>,
		)
		await userEvent.click(screen.getByRole('button'))
		expect(onClick).not.toHaveBeenCalled()
	})

	it('forwards the type prop', () => {
		render(<Button type="submit">Submit</Button>)
		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
	})
})
