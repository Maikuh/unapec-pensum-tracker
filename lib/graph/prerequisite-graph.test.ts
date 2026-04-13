import { describe, expect, it } from 'vitest'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import type { Subject } from '@/types/pensum'

const make = (code: string, prerequisites: string[] = []): Subject => ({
	code,
	name: `Subject ${code}`,
	credits: 3,
	prerequisites,
})

describe('buildPrerequisiteGraph', () => {
	it('returns empty maps for empty input', () => {
		const graph = buildPrerequisiteGraph([])
		expect(graph.prerequisites.size).toBe(0)
		expect(graph.dependents.size).toBe(0)
	})

	it('initializes nodes with empty sets for subjects with no prerequisites', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B')])
		expect(graph.prerequisites.get('A')).toEqual(new Set())
		expect(graph.prerequisites.get('B')).toEqual(new Set())
		expect(graph.dependents.get('A')).toEqual(new Set())
		expect(graph.dependents.get('B')).toEqual(new Set())
	})

	it('builds forward and backward edges for a simple chain A -> B -> C', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['A']),
			make('C', ['B']),
		])
		// B requires A
		expect(graph.prerequisites.get('B')).toEqual(new Set(['A']))
		// C requires B
		expect(graph.prerequisites.get('C')).toEqual(new Set(['B']))
		// A unlocks B
		expect(graph.dependents.get('A')).toEqual(new Set(['B']))
		// B unlocks C
		expect(graph.dependents.get('B')).toEqual(new Set(['C']))
		// C unlocks nothing
		expect(graph.dependents.get('C')).toEqual(new Set())
	})

	it('skips percentage-based prerequisites', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['50% De los créditos aprobados', 'A']),
		])
		expect(graph.prerequisites.get('B')).toEqual(new Set(['A']))
		expect(graph.dependents.get('A')).toEqual(new Set(['B']))
	})

	it('handles diamond dependencies (A->B, A->C, B->D, C->D)', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['A']),
			make('C', ['A']),
			make('D', ['B', 'C']),
		])
		expect(graph.dependents.get('A')).toEqual(new Set(['B', 'C']))
		expect(graph.prerequisites.get('D')).toEqual(new Set(['B', 'C']))
		expect(graph.dependents.get('B')).toEqual(new Set(['D']))
		expect(graph.dependents.get('C')).toEqual(new Set(['D']))
	})

	it('creates prerequisite node entry in dependents even if not in subjects list', () => {
		const graph = buildPrerequisiteGraph([make('B', ['EXTERNAL001'])])
		expect(graph.dependents.has('EXTERNAL001')).toBe(true)
		expect(graph.dependents.get('EXTERNAL001')).toEqual(new Set(['B']))
	})
})
