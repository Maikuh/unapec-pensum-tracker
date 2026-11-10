import { describe, expect, it } from 'vitest'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { removePercentPrereqViolators } from '@/lib/helpers/remove-percent-prereq-violators'
import type { Subject } from '@/types'

const make = (
	code: string,
	credits: number,
	prerequisites: string[] = [],
): Subject => ({ code, name: `Subject ${code}`, credits, prerequisites })

describe('removePercentPrereqViolators', () => {
	it('returns list unchanged when no % prerequisites', () => {
		const subjects = [make('A', 3), make('B', 3, ['A'])]
		const graph = buildPrerequisiteGraph(subjects)
		expect(removePercentPrereqViolators(subjects, 100, graph)).toEqual(subjects)
	})

	it('returns list unchanged when % threshold is still met', () => {
		const a = make('A', 50)
		const b = make('B', 10, ['50%'])
		const graph = buildPrerequisiteGraph([a, b])
		// 50 / 100 * 100 = 50 >= 50
		expect(removePercentPrereqViolators([a, b], 100, graph)).toEqual([a, b])
	})

	it('removes subject when % threshold is no longer met', () => {
		const a = make('A', 30)
		const b = make('B', 10, ['50%'])
		const graph = buildPrerequisiteGraph([a, b])
		// 40 / 100 * 100 = 40 < 50
		const result = removePercentPrereqViolators([a, b], 100, graph)
		expect(result).toEqual([a])
	})

	it('cascades removal to dependents of the removed subject', () => {
		const a = make('A', 30)
		const b = make('B', 10, ['50%'])
		const c = make('C', 5, ['B'])
		const graph = buildPrerequisiteGraph([a, b, c])
		// 45 / 100 * 100 = 45 < 50, so B (and its dependent C) removed
		const result = removePercentPrereqViolators([a, b, c], 100, graph)
		expect(result).toEqual([a])
	})

	it('handles full-text % strings like those in pensums.json', () => {
		const a = make('A', 30)
		const b = make('B', 10, ['50% de los créditos aprobados'])
		const graph = buildPrerequisiteGraph([a, b])
		const result = removePercentPrereqViolators([a, b], 100, graph)
		expect(result).toEqual([a])
	})

	it('is a fixpoint: runs until no more violations', () => {
		// B needs 40%, C needs 60% (a subject's own credits don't count)
		// A(40) + B(10) + C(5) = 55: C sees 50% < 60% and is removed.
		// Then B sees 40% >= 40% and survives.
		const a = make('A', 40)
		const b = make('B', 10, ['40%'])
		const c = make('C', 5, ['60%'])
		const graph = buildPrerequisiteGraph([a, b, c])
		const result = removePercentPrereqViolators([a, b, c], 100, graph)
		expect(result).toEqual([a, b])
	})

	it('removes a subject that only met the threshold by rounding', () => {
		// 124 / 250 = 49.6%: below 50% even though it rounds to 50
		const a = make('A', 114)
		const b = make('B', 10, ['50%'])
		const graph = buildPrerequisiteGraph([a, b])
		expect(removePercentPrereqViolators([a, b], 250, graph)).toEqual([a])
	})

	it("does not count a subject's own credits towards its requirement", () => {
		// A1 + A2 = 50% → B was selectable. Dropping A2 leaves 40% without B;
		// B's own 10 credits must not keep it at 50%.
		const a1 = make('A1', 40)
		const b = make('B', 10, ['50%'])
		const graph = buildPrerequisiteGraph([a1, b])
		expect(removePercentPrereqViolators([a1, b], 100, graph)).toEqual([a1])
	})
})
