import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress, ProgressLabel, ProgressValue } from './progress'

describe('Progress — contract', () => {
	it('reflects value in aria-valuenow', () => {
		render(<Progress value={42} aria-label="Loading" />)
		expect(screen.getByRole('progressbar')).toHaveAttribute(
			'aria-valuenow',
			'42',
		)
	})

	it('defaults aria-valuemin to 0 and aria-valuemax to 100', () => {
		render(<Progress value={50} aria-label="Loading" />)
		const bar = screen.getByRole('progressbar')
		expect(bar).toHaveAttribute('aria-valuemin', '0')
		expect(bar).toHaveAttribute('aria-valuemax', '100')
	})

	it('renders children alongside the track', () => {
		render(<Progress value={10} aria-label="Loading">Extra</Progress>)
		expect(screen.getByText('Extra')).toBeVisible()
	})

	it('renders at 0% without errors', () => {
		render(<Progress value={0} aria-label="Empty" />)
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
	})

	it('renders at 100% without errors', () => {
		render(<Progress value={100} aria-label="Full" />)
		expect(screen.getByRole('progressbar')).toHaveAttribute(
			'aria-valuenow',
			'100',
		)
	})
})

describe('ProgressLabel / ProgressValue', () => {
	it('ProgressLabel renders text content', () => {
		render(<Progress value={30} aria-label="x"><ProgressLabel>Uploading</ProgressLabel></Progress>)
		expect(screen.getByText('Uploading')).toBeVisible()
	})

	it('ProgressValue renders its children', () => {
		render(<Progress value={30} aria-label="x"><ProgressValue>30%</ProgressValue></Progress>)
		expect(screen.getByText('30%')).toBeVisible()
	})
})
