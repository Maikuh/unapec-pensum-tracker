import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname, useRouter } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CareerSearch } from './career-search'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn(),
	usePathname: vi.fn(),
}))

const MOCK_PENSUMS = [
	{ pensumCode: 'ADMR11', carreerName: 'Administración de Empresas' },
	{ pensumCode: 'INGE01', carreerName: 'Ingeniería de Software' },
]

const mockPush = vi.fn()

beforeEach(() => {
	vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<
		typeof useRouter
	>)
	vi.mocked(usePathname).mockReturnValue('/')
	mockPush.mockClear()
})

describe('CareerSearch — rendering', () => {
	it('shows placeholder when no career matches the pathname', () => {
		render(<CareerSearch pensums={MOCK_PENSUMS} />)
		expect(screen.getByText('Selecciona una carrera...')).toBeVisible()
	})

	it('syncs selected career from a matching pathname', async () => {
		vi.mocked(usePathname).mockReturnValue('/pensums/ADMR11')
		render(<CareerSearch pensums={MOCK_PENSUMS} />)
		await waitFor(() => {
			expect(screen.getByTestId('career-search-trigger')).toHaveTextContent(
				'ADMR11 - Administración de Empresas',
			)
		})
	})

	it('shows placeholder when pathname does not match any pensum', async () => {
		vi.mocked(usePathname).mockReturnValue('/pensums/UNKNOWN99')
		render(<CareerSearch pensums={MOCK_PENSUMS} />)
		await waitFor(() => {
			expect(screen.getByTestId('career-search-trigger')).toHaveTextContent(
				'Selecciona una carrera...',
			)
		})
	})
})

describe('CareerSearch — interaction', () => {
	it('opens popover with search input on trigger click', async () => {
		render(<CareerSearch pensums={MOCK_PENSUMS} />)
		await userEvent.click(screen.getByTestId('career-search-trigger'))
		await screen.findByTestId('career-search-input')
	})

	it('renders all pensum options in the list', async () => {
		render(<CareerSearch pensums={MOCK_PENSUMS} />)
		await userEvent.click(screen.getByTestId('career-search-trigger'))
		const options = await screen.findAllByTestId('career-search-option')
		expect(options).toHaveLength(2)
	})

	it('navigates to the selected pensum on option click', async () => {
		render(<CareerSearch pensums={MOCK_PENSUMS} />)
		await userEvent.click(screen.getByTestId('career-search-trigger'))
		const options = await screen.findAllByTestId('career-search-option')
		await userEvent.click(options[0])
		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith('/pensums/ADMR11')
		})
	})
})
