import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InfoCard } from './info-card'

const DATE = '2021-01-01T04:00:00.000Z'

describe('InfoCard', () => {
	it('renders subject and credit counts', () => {
		render(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={10}
				totalSubjects={50}
				creditsCount={40}
				totalCredits={200}
				date={DATE}
			/>,
		)
		expect(screen.getByTestId('subjects-count')).toHaveTextContent('10')
		expect(screen.getByTestId('total-subjects')).toHaveTextContent('50')
		expect(screen.getByTestId('credits-count')).toHaveTextContent('40')
		expect(screen.getByTestId('total-credits')).toHaveTextContent('200')
	})

	it('shows correct percentage for subjects and credits', () => {
		render(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={25}
				totalSubjects={50}
				creditsCount={100}
				totalCredits={200}
				date={DATE}
			/>,
		)
		const percentages = document.querySelectorAll('.subject-credits-percentage')
		expect(percentages).toHaveLength(2)
		for (const el of percentages) {
			expect(el).toHaveTextContent('50%')
		}
	})

	it('renders progress bar reflecting credit percentage', () => {
		render(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={0}
				totalSubjects={50}
				creditsCount={80}
				totalCredits={200}
				date={DATE}
			/>,
		)
		expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0)
	})

	it('shows external pensum link when pensumCode is in pensum-pages', () => {
		render(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={0}
				totalSubjects={50}
				creditsCount={0}
				totalCredits={200}
				date={DATE}
			/>,
		)
		const link = screen.getByRole('link', { name: 'Link al Pensum' })
		expect(link).toBeVisible()
		expect(link).toHaveAttribute('target', '_blank')
		expect(link).toHaveAttribute('rel', 'noopener noreferrer')
	})

	it('hides external pensum link when pensumCode has no entry', () => {
		render(
			<InfoCard
				pensumCode="UNKNOWN99"
				subjectsCount={0}
				totalSubjects={50}
				creditsCount={0}
				totalCredits={200}
				date={DATE}
			/>,
		)
		expect(
			screen.queryByRole('link', { name: 'Link al Pensum' }),
		).not.toBeInTheDocument()
	})

	it('formats date in Spanish locale', () => {
		render(
			<InfoCard
				pensumCode="ADMR11"
				subjectsCount={0}
				totalSubjects={50}
				creditsCount={0}
				totalCredits={200}
				date={DATE}
			/>,
		)
		expect(screen.getByText(/2021/)).toBeVisible()
		expect(screen.getByText(/enero/i)).toBeVisible()
	})
})
