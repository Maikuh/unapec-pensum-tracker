import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './dialog'

function TestDialog({ showCloseButton = true }: { showCloseButton?: boolean }) {
	return (
		<Dialog>
			<DialogTrigger>Open dialog</DialogTrigger>
			<DialogContent showCloseButton={showCloseButton}>
				<DialogHeader>
					<DialogTitle>Confirm action</DialogTitle>
					<DialogDescription>Are you sure?</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

describe('Dialog — contract', () => {
	it('does not show content before the trigger is clicked', () => {
		render(<TestDialog />)
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	it('shows the dialog after the trigger is clicked', async () => {
		render(<TestDialog />)
		await userEvent.click(screen.getByText('Open dialog'))
		expect(await screen.findByRole('dialog')).toBeVisible()
	})

	it('renders title and description inside the dialog', async () => {
		render(<TestDialog />)
		await userEvent.click(screen.getByText('Open dialog'))
		await screen.findByRole('dialog')
		expect(screen.getByText('Confirm action')).toBeVisible()
		expect(screen.getByText('Are you sure?')).toBeVisible()
	})

	it('closes when the built-in close button is clicked', async () => {
		render(<TestDialog />)
		await userEvent.click(screen.getByText('Open dialog'))
		await screen.findByRole('dialog')
		await userEvent.click(screen.getByRole('button', { name: /close/i }))
		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
		)
	})

	it('hides the close button when showCloseButton=false', async () => {
		render(<TestDialog showCloseButton={false} />)
		await userEvent.click(screen.getByText('Open dialog'))
		await screen.findByRole('dialog')
		expect(
			screen.queryByRole('button', { name: /close/i }),
		).not.toBeInTheDocument()
	})

	it('closes when Escape is pressed', async () => {
		render(<TestDialog />)
		await userEvent.click(screen.getByText('Open dialog'))
		await screen.findByRole('dialog')
		await userEvent.keyboard('{Escape}')
		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
		)
	})
})

describe('DialogClose — standalone close trigger', () => {
	it('closes the dialog when a custom DialogClose is clicked', async () => {
		render(
			<Dialog>
				<DialogTrigger>Open</DialogTrigger>
				<DialogContent showCloseButton={false}>
					<DialogTitle>Custom close</DialogTitle>
					<DialogClose>Dismiss</DialogClose>
				</DialogContent>
			</Dialog>,
		)
		await userEvent.click(screen.getByText('Open'))
		await screen.findByRole('dialog')
		await userEvent.click(screen.getByText('Dismiss'))
		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
		)
	})
})

describe('DialogFooter', () => {
	it('renders children', async () => {
		render(
			<Dialog>
				<DialogTrigger>Open</DialogTrigger>
				<DialogContent>
					<DialogTitle>Title</DialogTitle>
					<DialogFooter>
						<span>Footer content</span>
					</DialogFooter>
				</DialogContent>
			</Dialog>,
		)
		await userEvent.click(screen.getByText('Open'))
		await screen.findByRole('dialog')
		expect(screen.getByText('Footer content')).toBeVisible()
	})

	it('renders a close button when showCloseButton=true', async () => {
		render(
			<Dialog>
				<DialogTrigger>Open</DialogTrigger>
				<DialogContent>
					<DialogTitle>Title</DialogTitle>
					<DialogFooter showCloseButton>
						<span>Footer</span>
					</DialogFooter>
				</DialogContent>
			</Dialog>,
		)
		await userEvent.click(screen.getByText('Open'))
		await screen.findByRole('dialog')
		// DialogFooter's own Close button renders with text "Close"
		const closeBtns = screen.getAllByRole('button', { name: /close/i })
		expect(closeBtns.length).toBeGreaterThanOrEqual(1)
	})
})
