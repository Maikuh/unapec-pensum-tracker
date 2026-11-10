import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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
				onDiagramClick={() => {}}
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
				onDiagramClick={() => {}}
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
				onDiagramClick={() => {}}
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
				onDiagramClick={() => {}}
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
				onDiagramClick={() => {}}
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
				onDiagramClick={() => {}}
			/>,
		)
		expect(screen.getByText(/2021/)).toBeVisible()
		expect(screen.getByText(/enero/i)).toBeVisible()
	})
})

describe('InfoCard — available subjects, reset and legacy', () => {
	const base = {
		pensumCode: 'ADMR11',
		subjectsCount: 2,
		totalSubjects: 50,
		creditsCount: 6,
		totalCredits: 200,
		date: DATE,
		onDiagramClick: () => {},
	}

	it('shows the available count and opens the list', async () => {
		const onAvailableClick = vi.fn()
		render(
			<InfoCard
				{...base}
				availableCount={1}
				onAvailableClick={onAvailableClick}
			/>,
		)
		expect(screen.getByTestId('available-count')).toHaveTextContent('1')
		expect(screen.getByText(/materia con los/)).toBeVisible()
		await userEvent.click(screen.getByRole('button', { name: 'Ver lista' }))
		expect(onAvailableClick).toHaveBeenCalledOnce()
	})

	it('hides the list button when nothing is available', () => {
		render(
			<InfoCard {...base} availableCount={0} onAvailableClick={() => {}} />,
		)
		expect(
			screen.queryByRole('button', { name: 'Ver lista' }),
		).not.toBeInTheDocument()
	})

	it('disables reset when nothing is selected', () => {
		render(<InfoCard {...base} subjectsCount={0} onReset={() => {}} />)
		expect(
			screen.getByRole('button', { name: /reiniciar progreso/i }),
		).toBeDisabled()
	})

	it('does not reset when the confirmation is cancelled', async () => {
		const onReset = vi.fn()
		render(<InfoCard {...base} onReset={onReset} />)
		await userEvent.click(
			screen.getByRole('button', { name: /reiniciar progreso/i }),
		)
		await userEvent.click(
			await screen.findByRole('button', { name: 'Cancelar' }),
		)
		expect(onReset).not.toHaveBeenCalled()
	})

	it('shows the legacy notice only for legacy pensums', () => {
		const { rerender } = render(<InfoCard {...base} />)
		expect(screen.queryByTestId('legacy-notice')).not.toBeInTheDocument()
		rerender(<InfoCard {...base} legacy />)
		expect(screen.getByTestId('legacy-notice')).toBeVisible()
	})

	it('tracks clicks on the original pensum link', async () => {
		const { posthog } = await import('@/lib/analytics')
		const capture = vi
			.spyOn(posthog, 'capture')
			.mockImplementation(() => undefined)
		render(<InfoCard {...base} />)
		await userEvent.click(screen.getByRole('link', { name: 'Link al Pensum' }))
		expect(capture).toHaveBeenCalledWith('original_pensum_link_clicked', {
			pensum_code: 'ADMR11',
		})
	})
})
