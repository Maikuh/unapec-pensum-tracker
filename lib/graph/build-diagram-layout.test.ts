import { describe, expect, it } from 'vitest'
import { buildDiagramLayout } from '@/lib/graph/build-diagram-layout'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import type { Subject } from '@/types'

const make = (code: string, prerequisites: string[] = []): Subject => ({
	code,
	name: `Subject ${code}`,
	credits: 3,
	prerequisites,
})

describe('buildDiagramLayout', () => {
	it('returns one node per subject', () => {
		const subjects = [make('A'), make('B', ['A']), make('C', ['B'])]
		const graph = buildPrerequisiteGraph(subjects)
		const { nodes } = buildDiagramLayout(subjects, graph, new Set(), new Map())
		expect(nodes).toHaveLength(3)
		expect(nodes.map((n) => n.id)).toEqual(
			expect.arrayContaining(['A', 'B', 'C']),
		)
	})

	it('returns one edge per code-based prerequisite pair', () => {
		const subjects = [make('A'), make('B', ['A']), make('C', ['B'])]
		const graph = buildPrerequisiteGraph(subjects)
		const { edges } = buildDiagramLayout(subjects, graph, new Set(), new Map())
		expect(edges).toHaveLength(2)
		expect(edges.map((e) => ({ source: e.source, target: e.target }))).toEqual(
			expect.arrayContaining([
				{ source: 'A', target: 'B' },
				{ source: 'B', target: 'C' },
			]),
		)
	})

	it('marks nodes as selected when code is in selectedCodes', () => {
		const subjects = [make('A'), make('B', ['A'])]
		const graph = buildPrerequisiteGraph(subjects)
		const { nodes } = buildDiagramLayout(
			subjects,
			graph,
			new Set(['A']),
			new Map(),
		)
		const a = nodes.find((n) => n.id === 'A')
		const b = nodes.find((n) => n.id === 'B')
		expect(a?.data.isSelected).toBe(true)
		expect(b?.data.isSelected).toBe(false)
	})

	it('ignores percentage-based prerequisites (already filtered by graph)', () => {
		const subjects = [
			make('A', ['70% de créditos']),
			make('B', ['A', '50% créditos']),
		]
		const graph = buildPrerequisiteGraph(subjects)
		const { edges } = buildDiagramLayout(subjects, graph, new Set(), new Map())
		expect(edges).toHaveLength(1)
		expect(edges[0].source).toBe('A')
		expect(edges[0].target).toBe('B')
	})

	it('skips edges for prerequisite codes not present in the subject list', () => {
		const subjects = [make('B', ['UNKNOWN'])]
		const graph = buildPrerequisiteGraph(subjects)
		const { edges } = buildDiagramLayout(subjects, graph, new Set(), new Map())
		expect(edges).toHaveLength(0)
	})

	it('positions dependent nodes below their prerequisites (TB layout)', () => {
		const subjects = [make('A'), make('B', ['A']), make('C', ['B'])]
		const graph = buildPrerequisiteGraph(subjects)
		const { nodes } = buildDiagramLayout(subjects, graph, new Set(), new Map())
		const y = (id: string) => nodes.find((n) => n.id === id)?.position.y ?? 0
		expect(y('A')).toBeLessThan(y('B'))
		expect(y('B')).toBeLessThan(y('C'))
	})

	it('sets the correct node type', () => {
		const subjects = [make('A')]
		const graph = buildPrerequisiteGraph(subjects)
		const { nodes } = buildDiagramLayout(subjects, graph, new Set(), new Map())
		expect(nodes[0].type).toBe('subjectNode')
	})

	it('includes period number from periodByCode map', () => {
		const subjects = [make('A'), make('B', ['A'])]
		const graph = buildPrerequisiteGraph(subjects)
		const periodByCode = new Map([
			['A', 1],
			['B', 2],
		])
		const { nodes } = buildDiagramLayout(
			subjects,
			graph,
			new Set(),
			periodByCode,
		)
		expect(nodes.find((n) => n.id === 'A')?.data.period).toBe(1)
		expect(nodes.find((n) => n.id === 'B')?.data.period).toBe(2)
	})

	it('sets period to null when code is not in periodByCode', () => {
		const subjects = [make('A')]
		const graph = buildPrerequisiteGraph(subjects)
		const { nodes } = buildDiagramLayout(subjects, graph, new Set(), new Map())
		expect(nodes[0].data.period).toBeNull()
	})
})
