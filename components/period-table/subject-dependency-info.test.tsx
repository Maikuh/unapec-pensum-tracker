import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { graph, subjects } from '@/test/fixtures/pensum'
import { SubjectDependencyInfo } from './subject-dependency-info'

describe('SubjectDependencyInfo — no dependencies', () => {
	it('renders nothing for a subject with no ancestors or descendants', () => {
		const emptyGraph = buildPrerequisiteGraph([
			{
				code: 'HIS010',
				name: 'HISTORIA DOMINICANA',
				credits: 3,
				prerequisites: [],
			},
		])
		const { container } = render(
			<SubjectDependencyInfo
				code="HIS010"
				graph={emptyGraph}
				allSubjects={subjects}
			/>,
		)
		expect(container).toBeEmptyDOMElement()
	})
})

describe('SubjectDependencyInfo — with dependencies', () => {
	it('renders the info icon trigger for a subject with dependencies', () => {
		render(
			<SubjectDependencyInfo
				code="MAT121"
				graph={graph}
				allSubjects={subjects}
			/>,
		)
		expect(
			screen.getByRole('button', { name: 'Ver dependencias' }),
		).toBeVisible()
	})

	it('opens the popover and shows ancestor section on trigger click', async () => {
		render(
			<SubjectDependencyInfo
				code="MAT121"
				graph={graph}
				allSubjects={subjects}
			/>,
		)
		await userEvent.click(
			screen.getByRole('button', { name: 'Ver dependencias' }),
		)
		expect(screen.getByText('Prerrequisitos (cadena completa)')).toBeVisible()
		expect(screen.getByText('MAT010')).toBeVisible()
		expect(screen.getByText('PRE-CALCULO')).toBeVisible()
	})

	it('shows descendant section for a subject that unlocks others', async () => {
		render(
			<SubjectDependencyInfo
				code="MAT121"
				graph={graph}
				allSubjects={subjects}
			/>,
		)
		await userEvent.click(
			screen.getByRole('button', { name: 'Ver dependencias' }),
		)
		expect(screen.getByText('Desbloquea')).toBeVisible()
		expect(screen.getByText('MAT131')).toBeVisible()
		expect(screen.getByText('CALCULO DIFERENCIAL')).toBeVisible()
	})

	it('shows only ancestor section for a subject at the end of a chain', async () => {
		render(
			<SubjectDependencyInfo
				code="MAT131"
				graph={graph}
				allSubjects={subjects}
			/>,
		)
		await userEvent.click(
			screen.getByRole('button', { name: 'Ver dependencias' }),
		)
		expect(screen.getByText('Prerrequisitos (cadena completa)')).toBeVisible()
		expect(screen.queryByText('Desbloquea')).not.toBeInTheDocument()
	})

	it('shows only descendant section for a subject at the start of a chain', async () => {
		render(
			<SubjectDependencyInfo
				code="MAT010"
				graph={graph}
				allSubjects={subjects}
			/>,
		)
		await userEvent.click(
			screen.getByRole('button', { name: 'Ver dependencias' }),
		)
		expect(
			screen.queryByText('Prerrequisitos (cadena completa)'),
		).not.toBeInTheDocument()
		expect(screen.getByText('Desbloquea')).toBeVisible()
	})
})
