import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BackToTop } from './back-to-top'

function setScrollY(value: number) {
	Object.defineProperty(window, 'scrollY', {
		value,
		writable: true,
		configurable: true,
	})
}

describe('BackToTop', () => {
	beforeEach(() => {
		setScrollY(0)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('does not render the button initially', () => {
		render(<BackToTop />)
		expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull()
	})

	it('shows button after scrolling past 100px', () => {
		render(<BackToTop />)
		act(() => {
			setScrollY(101)
			window.dispatchEvent(new Event('scroll'))
		})
		expect(screen.getByRole('button', { name: 'Back to top' })).toBeTruthy()
	})

	it('hides button when scrolled back above 100px', () => {
		render(<BackToTop />)
		act(() => {
			setScrollY(101)
			window.dispatchEvent(new Event('scroll'))
		})
		expect(screen.getByRole('button', { name: 'Back to top' })).toBeTruthy()
		act(() => {
			setScrollY(50)
			window.dispatchEvent(new Event('scroll'))
		})
		expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull()
	})

	it('calls window.scrollTo on click', () => {
		const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
		render(<BackToTop />)
		act(() => {
			setScrollY(101)
			window.dispatchEvent(new Event('scroll'))
		})
		fireEvent.click(screen.getByRole('button', { name: 'Back to top' }))
		expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
	})
})
