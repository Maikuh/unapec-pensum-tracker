import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './sheet'

function TestSheet({
	side = 'right',
	showCloseButton = true,
}: {
	side?: 'top' | 'right' | 'bottom' | 'left'
	showCloseButton?: boolean
}) {
	return (
		<Sheet>
			<SheetTrigger>Open sheet</SheetTrigger>
			<SheetContent side={side} showCloseButton={showCloseButton}>
				<SheetHeader>
					<SheetTitle>Settings</SheetTitle>
					<SheetDescription>Adjust your preferences.</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}

describe('Sheet — contract', () => {
	it('does not render content before trigger is clicked', () => {
		render(<TestSheet />)
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	it('shows the sheet after the trigger is clicked', async () => {
		render(<TestSheet />)
		await userEvent.click(screen.getByText('Open sheet'))
		expect(await screen.findByRole('dialog')).toBeVisible()
	})

	it('renders title and description when open', async () => {
		render(<TestSheet />)
		await userEvent.click(screen.getByText('Open sheet'))
		await screen.findByRole('dialog')
		expect(screen.getByText('Settings')).toBeVisible()
		expect(screen.getByText('Adjust your preferences.')).toBeVisible()
	})

	it('sets the data-side attribute from the side prop', async () => {
		render(<TestSheet side="left" />)
		await userEvent.click(screen.getByText('Open sheet'))
		const content = await screen.findByRole('dialog')
		expect(content).toHaveAttribute('data-side', 'left')
	})

	it('closes when the built-in close button is clicked', async () => {
		render(<TestSheet />)
		await userEvent.click(screen.getByText('Open sheet'))
		await screen.findByRole('dialog')
		await userEvent.click(screen.getByRole('button', { name: /close/i }))
		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
		)
	})

	it('hides the close button when showCloseButton=false', async () => {
		render(<TestSheet showCloseButton={false} />)
		await userEvent.click(screen.getByText('Open sheet'))
		await screen.findByRole('dialog')
		expect(
			screen.queryByRole('button', { name: /close/i }),
		).not.toBeInTheDocument()
	})

	it('closes when Escape is pressed', async () => {
		render(<TestSheet />)
		await userEvent.click(screen.getByText('Open sheet'))
		await screen.findByRole('dialog')
		await userEvent.keyboard('{Escape}')
		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
		)
	})
})

describe('SheetClose — standalone close trigger', () => {
	it('closes the sheet when clicked', async () => {
		render(
			<Sheet>
				<SheetTrigger>Open</SheetTrigger>
				<SheetContent showCloseButton={false}>
					<SheetTitle>Title</SheetTitle>
					<SheetClose>Dismiss</SheetClose>
				</SheetContent>
			</Sheet>,
		)
		await userEvent.click(screen.getByText('Open'))
		await screen.findByRole('dialog')
		await userEvent.click(screen.getByText('Dismiss'))
		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
		)
	})
})

describe('SheetFooter', () => {
	it('renders children in the footer', async () => {
		render(
			<Sheet>
				<SheetTrigger>Open</SheetTrigger>
				<SheetContent>
					<SheetTitle>Title</SheetTitle>
					<SheetFooter>
						<span>Footer text</span>
					</SheetFooter>
				</SheetContent>
			</Sheet>,
		)
		await userEvent.click(screen.getByText('Open'))
		await screen.findByRole('dialog')
		expect(screen.getByText('Footer text')).toBeVisible()
	})
})
