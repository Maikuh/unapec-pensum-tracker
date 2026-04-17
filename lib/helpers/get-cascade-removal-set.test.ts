import { describe, expect, it } from 'vitest'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { getCascadeRemovalSet } from '@/lib/helpers/get-cascade-removal-set'
import type { Subject } from '@/types'

const make = (code: string, prerequisites: string[] = []): Subject => ({
	code,
	name: `Subject ${code}`,
	credits: 3,
	prerequisites,
})

describe('getCascadeRemovalSet', () => {
	it('returns just the code when the subject has no dependents', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B', ['A'])])
		expect(getCascadeRemovalSet(graph, ['B'])).toEqual(new Set(['B']))
	})

	it('cascades to direct dependent', () => {
		const graph = buildPrerequisiteGraph([make('A'), make('B', ['A'])])
		expect(getCascadeRemovalSet(graph, ['A'])).toEqual(new Set(['A', 'B']))
	})

	it('cascades transitively through a chain A -> B -> C', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['A']),
			make('C', ['B']),
		])
		expect(getCascadeRemovalSet(graph, ['A'])).toEqual(new Set(['A', 'B', 'C']))
	})

	it('removing from the middle cascades forward but not backward', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['A']),
			make('C', ['B']),
		])
		const result = getCascadeRemovalSet(graph, ['B'])
		expect(result).toEqual(new Set(['B', 'C']))
		expect(result.has('A')).toBe(false)
	})

	it('handles multiple starting codes and deduplicates', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B'),
			make('C', ['A', 'B']),
		])
		expect(getCascadeRemovalSet(graph, ['A', 'B'])).toEqual(
			new Set(['A', 'B', 'C']),
		)
	})

	it('handles diamond dependency', () => {
		const graph = buildPrerequisiteGraph([
			make('A'),
			make('B', ['A']),
			make('C', ['A']),
			make('D', ['B', 'C']),
		])
		expect(getCascadeRemovalSet(graph, ['A'])).toEqual(
			new Set(['A', 'B', 'C', 'D']),
		)
	})
})
