import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { version } from '@/package.json'
import { Footer } from './footer'
import { ServiceWorkerRegister } from './service-worker-register'
import { StoreInitializer } from './store-initializer'

afterEach(() => {
	vi.unstubAllEnvs()
	vi.restoreAllMocks()
})

describe('Footer', () => {
	it('shows the app version and author link', () => {
		render(<Footer />)
		expect(screen.getByText(new RegExp(`v${version}`))).toBeVisible()
		expect(screen.getByRole('link', { name: 'Maikuh' })).toHaveAttribute(
			'href',
			'https://github.com/maikuh',
		)
	})
})

describe('StoreInitializer', () => {
	it('rehydrates the persisted store on mount and renders nothing', async () => {
		const { useSelectedSubjectsStore } = await import(
			'@/lib/store/use-selected-subjects'
		)
		const spy = vi.spyOn(useSelectedSubjectsStore.persist, 'rehydrate')
		const { container } = render(<StoreInitializer />)
		expect(spy).toHaveBeenCalledOnce()
		expect(container).toBeEmptyDOMElement()
	})
})

describe('ServiceWorkerRegister', () => {
	function mockServiceWorker() {
		const register = vi.fn().mockResolvedValue(undefined)
		Object.defineProperty(navigator, 'serviceWorker', {
			value: { register },
			configurable: true,
		})
		return register
	}

	it('registers the service worker in production, scoped to the base path', () => {
		vi.stubEnv('NODE_ENV', 'production')
		const register = mockServiceWorker()
		render(<ServiceWorkerRegister />)
		expect(register).toHaveBeenCalledWith(
			expect.stringMatching(/\/sw\.js$/),
			expect.objectContaining({ scope: expect.stringMatching(/\/$/) }),
		)
	})

	it('does not register outside production', () => {
		const register = mockServiceWorker()
		render(<ServiceWorkerRegister />)
		expect(register).not.toHaveBeenCalled()
	})
})
