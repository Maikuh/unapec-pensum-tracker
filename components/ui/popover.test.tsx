import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from './popover'

function TestPopover() {
	return (
		<Popover>
			<PopoverTrigger>Open popover</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>Options</PopoverTitle>
					<PopoverDescription>Choose an option below.</PopoverDescription>
				</PopoverHeader>
				Popover body text
			</PopoverContent>
		</Popover>
	)
}

describe('Popover — contract', () => {
	it('does not render content before trigger is clicked', () => {
		render(<TestPopover />)
		expect(screen.queryByText('Popover body text')).not.toBeInTheDocument()
	})

	it('shows content after trigger is clicked', async () => {
		render(<TestPopover />)
		await userEvent.click(screen.getByText('Open popover'))
		expect(await screen.findByText('Popover body text')).toBeVisible()
		expect(screen.getByText('Options')).toBeVisible()
		expect(screen.getByText('Choose an option below.')).toBeVisible()
	})

	it('closes when Escape is pressed', async () => {
		render(<TestPopover />)
		await userEvent.click(screen.getByText('Open popover'))
		await screen.findByText('Popover body text')
		await userEvent.keyboard('{Escape}')
		await waitFor(() =>
			expect(screen.queryByText('Popover body text')).not.toBeInTheDocument(),
		)
	})

	it('closes when clicking outside', async () => {
		render(
			<>
				<TestPopover />
				<button type="button">Outside</button>
			</>,
		)
		await userEvent.click(screen.getByText('Open popover'))
		await screen.findByText('Popover body text')
		await userEvent.click(screen.getByText('Outside'))
		await waitFor(() =>
			expect(screen.queryByText('Popover body text')).not.toBeInTheDocument(),
		)
	})
})
