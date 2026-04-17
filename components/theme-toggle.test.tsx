import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithTheme } from '@/test/utils'
import { ThemeToggle } from './theme-toggle'

beforeEach(() => {
	localStorage.clear()
	document.documentElement.className = ''
})

describe('ThemeToggle', () => {
	it('renders the toggle button', async () => {
		renderWithTheme(<ThemeToggle />)
		await waitFor(() =>
			expect(
				screen.getByRole('button', { name: 'Toggle theme' }),
			).toBeVisible(),
		)
	})

	it('switches to dark theme when clicked in light mode', async () => {
		renderWithTheme(<ThemeToggle />, { defaultTheme: 'light' })
		await waitFor(() =>
			expect(document.documentElement).not.toHaveClass('dark'),
		)
		await userEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))
		await waitFor(() => expect(document.documentElement).toHaveClass('dark'))
	})

	it('switches to light theme when clicked in dark mode', async () => {
		renderWithTheme(<ThemeToggle />, { defaultTheme: 'dark' })
		await waitFor(() => expect(document.documentElement).toHaveClass('dark'))
		await userEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))
		await waitFor(() =>
			expect(document.documentElement).not.toHaveClass('dark'),
		)
	})

	it('toggles back and forth correctly', async () => {
		renderWithTheme(<ThemeToggle />, { defaultTheme: 'light' })
		await waitFor(() =>
			expect(document.documentElement).not.toHaveClass('dark'),
		)
		await userEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))
		await waitFor(() => expect(document.documentElement).toHaveClass('dark'))
		await userEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))
		await waitFor(() =>
			expect(document.documentElement).not.toHaveClass('dark'),
		)
	})
})
