import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PrerequisiteAlert } from './prerequisite-alert'

describe('PrerequisiteAlert', () => {
	it('is not visible when open=false', () => {
		render(
			<PrerequisiteAlert
				open={false}
				onClose={vi.fn()}
				title="Test Title"
				message="Test message"
			/>,
		)
		expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
	})

	it('shows title and message when open=true', async () => {
		render(
			<PrerequisiteAlert
				open={true}
				onClose={vi.fn()}
				title="No puede seleccionar esta materia"
				message="No tienes los prerrequisitos completados."
			/>,
		)
		const dialog = await screen.findByRole('alertdialog')
		expect(dialog).toBeVisible()
		expect(screen.getByText('No puede seleccionar esta materia')).toBeVisible()
		expect(
			screen.getByText('No tienes los prerrequisitos completados.'),
		).toBeVisible()
	})

	it('calls onClose when action button is clicked', async () => {
		const onClose = vi.fn()
		render(
			<PrerequisiteAlert
				open={true}
				onClose={onClose}
				title="Test Title"
				message="Test message"
			/>,
		)
		await screen.findByRole('alertdialog')
		await userEvent.click(screen.getByText('Entendido'))
		await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
	})
})
