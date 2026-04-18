import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { graph, subjects } from '@/test/fixtures/pensum'

vi.mock('@xyflow/react', () => ({
	ReactFlow: ({
		nodes,
	}: {
		nodes: Array<{ id: string; data: { code: string; isSelected: boolean } }>
	}) => (
		<div data-testid="react-flow">
			{nodes.map((n) => (
				<div
					key={n.id}
					data-testid="diagram-node"
					data-code={n.data.code}
					data-selected={String(n.data.isSelected)}
				>
					{n.data.code}
				</div>
			))}
		</div>
	),
	Background: () => null,
	Controls: () => null,
	MiniMap: () => null,
	Handle: () => null,
	Position: { Top: 'top', Bottom: 'bottom' },
	MarkerType: { ArrowClosed: 'arrowclosed', Arrow: 'arrow' },
}))

// Import after mock is set up
const { PrerequisiteDiagram } = await import('./index')

describe('PrerequisiteDiagram', () => {
	it('renders one node per subject', () => {
		render(
			<PrerequisiteDiagram
				subjects={subjects}
				graph={graph}
				selectedCodes={new Set()}
				periodByCode={new Map()}
				pensumCode="NINR11"
			/>,
		)
		const nodes = screen.getAllByTestId('diagram-node')
		expect(nodes).toHaveLength(subjects.length)
	})

	it('marks selected nodes with data-selected="true"', () => {
		render(
			<PrerequisiteDiagram
				subjects={subjects}
				graph={graph}
				selectedCodes={new Set(['MAT010', 'MAT121'])}
				periodByCode={new Map()}
				pensumCode="NINR11"
			/>,
		)
		const selected = screen
			.getAllByTestId('diagram-node')
			.filter((el) => el.dataset.selected === 'true')
		expect(selected).toHaveLength(2)
		expect(selected.map((el) => el.dataset.code)).toEqual(
			expect.arrayContaining(['MAT010', 'MAT121']),
		)
	})

	it('marks unselected nodes with data-selected="false"', () => {
		render(
			<PrerequisiteDiagram
				subjects={subjects}
				graph={graph}
				selectedCodes={new Set()}
				periodByCode={new Map()}
				pensumCode="NINR11"
			/>,
		)
		const nodes = screen.getAllByTestId('diagram-node')
		expect(nodes.every((el) => el.dataset.selected === 'false')).toBe(true)
	})

	it('passes the correct edge count for the fixture graph', () => {
		const simpleSubjects = [
			{ code: 'A', name: 'A', credits: 3, prerequisites: [] },
			{ code: 'B', name: 'B', credits: 3, prerequisites: ['A'] },
		]
		const simpleGraph = buildPrerequisiteGraph(simpleSubjects)
		render(
			<PrerequisiteDiagram
				subjects={simpleSubjects}
				graph={simpleGraph}
				selectedCodes={new Set()}
				periodByCode={new Map()}
				pensumCode="NINR11"
			/>,
		)
		expect(screen.getByTestId('react-flow')).toBeInTheDocument()
	})
})
