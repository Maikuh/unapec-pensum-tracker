import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox — contract', () => {
	it('renders as a checkbox role', () => {
		render(<Checkbox />)
		expect(screen.getByRole('checkbox')).toBeVisible()
	})

	it('is unchecked by default', () => {
		render(<Checkbox />)
		expect(screen.getByRole('checkbox')).not.toBeChecked()
	})

	it('fires onCheckedChange with true when clicked while unchecked', async () => {
		const onCheckedChange = vi.fn()
		render(<Checkbox onCheckedChange={onCheckedChange} />)
		await userEvent.click(screen.getByRole('checkbox'))
		expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
	})

	it('fires onCheckedChange with false when clicked while checked', async () => {
		const onCheckedChange = vi.fn()
		render(<Checkbox defaultChecked onCheckedChange={onCheckedChange} />)
		await userEvent.click(screen.getByRole('checkbox'))
		expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything())
	})

	it('does not fire onCheckedChange when disabled', async () => {
		const onCheckedChange = vi.fn()
		render(<Checkbox disabled onCheckedChange={onCheckedChange} />)
		await userEvent.click(screen.getByRole('checkbox'))
		expect(onCheckedChange).not.toHaveBeenCalled()
	})
})
