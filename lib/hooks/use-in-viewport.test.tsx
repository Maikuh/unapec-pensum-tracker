import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInViewport } from './use-in-viewport'

function TestBox({ options }: { options?: IntersectionObserverInit }) {
	const [ref, isInView] = useInViewport<HTMLDivElement>(options)
	return <div ref={ref} data-testid="box" data-in-view={String(isInView)} />
}

describe('useInViewport — IntersectionObserver unavailable', () => {
	it('returns false without throwing when IntersectionObserver is undefined', () => {
		render(<TestBox />)
		expect(screen.getByTestId('box')).toHaveAttribute('data-in-view', 'false')
	})
})

describe('useInViewport — with IntersectionObserver', () => {
	let triggerIntersection: IntersectionObserverCallback
	const mockObserve = vi.fn()
	const mockDisconnect = vi.fn()

	beforeEach(() => {
		mockObserve.mockClear()
		mockDisconnect.mockClear()
		vi.stubGlobal(
			'IntersectionObserver',
			class {
				constructor(cb: IntersectionObserverCallback) {
					triggerIntersection = cb
				}
				observe = mockObserve
				disconnect = mockDisconnect
				unobserve = vi.fn()
			},
		)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('starts with isInView = false', () => {
		render(<TestBox />)
		expect(screen.getByTestId('box')).toHaveAttribute('data-in-view', 'false')
	})

	it('observes the attached DOM node', () => {
		render(<TestBox />)
		expect(mockObserve).toHaveBeenCalledWith(screen.getByTestId('box'))
	})

	it('sets isInView to true when the element starts intersecting', () => {
		render(<TestBox />)
		act(() => {
			triggerIntersection(
				[{ isIntersecting: true } as IntersectionObserverEntry],
				{} as IntersectionObserver,
			)
		})
		expect(screen.getByTestId('box')).toHaveAttribute('data-in-view', 'true')
	})

	it('sets isInView to false when the element stops intersecting', () => {
		render(<TestBox />)
		act(() => {
			triggerIntersection(
				[{ isIntersecting: true } as IntersectionObserverEntry],
				{} as IntersectionObserver,
			)
		})
		act(() => {
			triggerIntersection(
				[{ isIntersecting: false } as IntersectionObserverEntry],
				{} as IntersectionObserver,
			)
		})
		expect(screen.getByTestId('box')).toHaveAttribute('data-in-view', 'false')
	})

	it('disconnects the observer on unmount', () => {
		const { unmount } = render(<TestBox />)
		unmount()
		expect(mockDisconnect).toHaveBeenCalledOnce()
	})
})
