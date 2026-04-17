import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './alert-dialog'

function TestAlertDialog({
	onAction = vi.fn(),
	onCancel = vi.fn(),
}: {
	onAction?: () => void
	onCancel?: () => void
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger>Delete item</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle>Are you sure?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone.
				</AlertDialogDescription>
				<AlertDialogAction onClick={onAction}>Confirm</AlertDialogAction>
				<AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
			</AlertDialogContent>
		</AlertDialog>
	)
}

describe('AlertDialogMedia', () => {
	it('renders icon content inside the media slot', async () => {
		render(
			<AlertDialog>
				<AlertDialogTrigger>Open</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogMedia>
						<span>⚠️</span>
					</AlertDialogMedia>
					<AlertDialogTitle>Warning</AlertDialogTitle>
					<AlertDialogAction>OK</AlertDialogAction>
				</AlertDialogContent>
			</AlertDialog>,
		)
		await userEvent.click(screen.getByText('Open'))
		await screen.findByRole('alertdialog')
		expect(screen.getByText('⚠️')).toBeVisible()
	})
})

describe('AlertDialog — contract', () => {
	it('does not render the dialog before the trigger is clicked', () => {
		render(<TestAlertDialog />)
		expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
	})

	it('shows the dialog after the trigger is clicked', async () => {
		render(<TestAlertDialog />)
		await userEvent.click(screen.getByText('Delete item'))
		expect(await screen.findByRole('alertdialog')).toBeVisible()
	})

	it('renders title and description inside the dialog', async () => {
		render(<TestAlertDialog />)
		await userEvent.click(screen.getByText('Delete item'))
		await screen.findByRole('alertdialog')
		expect(screen.getByText('Are you sure?')).toBeVisible()
		expect(screen.getByText('This action cannot be undone.')).toBeVisible()
	})

	it('fires onAction callback and closes when action button is clicked', async () => {
		const onAction = vi.fn()
		render(<TestAlertDialog onAction={onAction} />)
		await userEvent.click(screen.getByText('Delete item'))
		await screen.findByRole('alertdialog')
		await userEvent.click(screen.getByText('Confirm'))
		expect(onAction).toHaveBeenCalledOnce()
		await waitFor(() =>
			expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
		)
	})

	it('fires onCancel callback and closes when cancel button is clicked', async () => {
		const onCancel = vi.fn()
		render(<TestAlertDialog onCancel={onCancel} />)
		await userEvent.click(screen.getByText('Delete item'))
		await screen.findByRole('alertdialog')
		await userEvent.click(screen.getByText('Cancel'))
		expect(onCancel).toHaveBeenCalledOnce()
		await waitFor(() =>
			expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
		)
	})
})
