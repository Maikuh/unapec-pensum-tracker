import { describe, expect, it } from 'vitest'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import {
	getAllAncestors,
	getAllDescendants,
	getAllDescendantsMultiple,
} from '@/lib/graph/traversal'
import type { Subject } from '@/types/pensum'

const make = (code: string, prerequisites: string[] = []): Subject => ({
	code,
	name: `Subject ${code}`,
	credits: 3,
	prerequisites,
})

describe('getAllAncestors', () => {
	it('returns empty set for a subject with no prerequisites', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B')])
		expect(getAllAncestors(graph, 'A')).toEqual(new Set())
	})

	it('returns direct prerequisite', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B', ['A'])])
		expect(getAllAncestors(graph, 'B')).toEqual(new Set(['A']))
	})

	it('returns transitive ancestors in a chain A -> B -> C', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['A']),
			make('C', ['B']),
		])
		expect(getAllAncestors(graph, 'C')).toEqual(new Set(['A', 'B']))
	})

	it('returns all ancestors in a diamond (A -> B, A -> C, B -> D, C -> D)', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['A']),
			make('C', ['A']),
			make('D', ['B', 'C']),
		])
		expect(getAllAncestors(graph, 'D')).toEqual(new Set(['A', 'B', 'C']))
	})

	it('does not include the subject itself', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B', ['A'])])
		expect(getAllAncestors(graph, 'B').has('B')).toBe(false)
	})

	it('handles cycles without infinite looping', () => {
		// Manually build a cyclic graph
		const graph = buildPrerequisiteGraph([make('A'), make('B')])
		graph.prerequisites.get('A')?.add('B')
		graph.prerequisites.get('B')?.add('A')
		// Should terminate without error
		const result = getAllAncestors(graph, 'A')
		expect(result).toEqual(new Set(['B']))
	})
})

describe('getAllDescendants', () => {
	it('returns empty set for a leaf subject', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B', ['A'])])
		expect(getAllDescendants(graph, 'B')).toEqual(new Set())
	})

	it('returns direct dependent', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B', ['A'])])
		expect(getAllDescendants(graph, 'A')).toEqual(new Set(['B']))
	})

	it('returns transitive descendants in a chain A -> B -> C', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['A']),
			make('C', ['B']),
		])
		expect(getAllDescendants(graph, 'A')).toEqual(new Set(['B', 'C']))
	})

	it('returns fan-out descendants (A unlocks B, C, D)', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['A']),
			make('C', ['A']),
			make('D', ['A']),
		])
		expect(getAllDescendants(graph, 'A')).toEqual(new Set(['B', 'C', 'D']))
	})

	it('does not include the subject itself', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B', ['A'])])
		expect(getAllDescendants(graph, 'A').has('A')).toBe(false)
	})
})

describe('getAllDescendantsMultiple', () => {
	it('returns empty set when no subjects have dependents', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B')])
		expect(getAllDescendantsMultiple(graph, ['A', 'B'])).toEqual(new Set())
	})

	it('collects descendants from multiple roots', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B'),
			make('C', ['A']),
			make('D', ['B']),
		])
		expect(getAllDescendantsMultiple(graph, ['A', 'B'])).toEqual(
			new Set(['C', 'D']),
		)
	})

	it('deduplicates descendants shared by multiple roots', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B'),
			make('C', ['A', 'B']),
		])
		const result = getAllDescendantsMultiple(graph, ['A', 'B'])
		expect(result).toEqual(new Set(['C']))
	})

	it('does not include the starting codes', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B', ['A'])])
		const result = getAllDescendantsMultiple(graph, ['A'])
		expect(result.has('A')).toBe(false)
	})

	it('handles duplicate start codes without including them in the result', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B', ['A'])])
		// Duplicate 'A' exercises the visited.has(current) continue branch
		const result = getAllDescendantsMultiple(graph, ['A', 'A'])
		expect(result).toEqual(new Set(['B']))
	})
})

describe('dfs: unreachable neighbor branch', () => {
	it('handles a code present in dependents but absent from prerequisites without error', () => {
		// B lists 'A' as a prereq, but 'A' is not in the subjects array.
		// graph.prerequisites has no entry for 'A', so adjacencyMap.get('A') is undefined.
		const graph = buildPrerequisiteGraph([make('B', ['A'])])
		// getAllAncestors for 'A' exercises the if (neighbors) false branch
		expect(getAllAncestors(graph, 'A')).toEqual(new Set())
	})
})
