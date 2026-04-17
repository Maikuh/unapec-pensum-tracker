import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname, useRouter } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Navbar } from './navbar'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn(),
	usePathname: vi.fn(),
}))

vi.mock('next/link', () => ({
	default: ({
		children,
		href,
		onClick,
		className,
	}: {
		children: React.ReactNode
		href: string
		onClick?: () => void
		className?: string
	}) => (
		<a href={href} onClick={onClick} className={className}>
			{children}
		</a>
	),
}))

function renderNavbar() {
	return render(
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
			<TooltipProvider>
				<Navbar />
			</TooltipProvider>
		</ThemeProvider>,
	)
}

beforeEach(() => {
	vi.mocked(useRouter).mockReturnValue({
		push: vi.fn(),
	} as ReturnType<typeof useRouter>)
	vi.mocked(usePathname).mockReturnValue('/')
})

describe('Navbar — rendering', () => {
	it('renders the mobile menu button', () => {
		renderNavbar()
		expect(
			screen.getByRole('button', { name: 'Abrir menú' }),
		).toBeInTheDocument()
	})

	it('renders the career search trigger', () => {
		renderNavbar()
		expect(screen.getByTestId('career-search-trigger')).toBeInTheDocument()
	})
})

describe('Navbar — mobile drawer', () => {
	it('opens the drawer when mobile menu button is clicked', async () => {
		renderNavbar()
		await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
		await screen.findByRole('dialog')
	})

	it('shows navigation links inside the drawer', async () => {
		renderNavbar()
		await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
		await screen.findByRole('dialog')
		expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
	})

	it('closes the drawer when the Inicio link is clicked', async () => {
		renderNavbar()
		await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
		await screen.findByRole('dialog')
		await userEvent.click(screen.getByRole('link', { name: 'Inicio' }))
		await screen.findByRole('button', { name: 'Abrir menú' })
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})
})
