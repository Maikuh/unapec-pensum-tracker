import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import type { Subject } from '@/types'
import { getCascadeRemovalSet } from './get-cascade-removal-set'
import { prerequisitesMet } from './prerequisites-met'

export function removePercentPrereqViolators(
	selected: Subject[],
	totalCredits: number,
	graph: PrerequisiteGraph,
): Subject[] {
	let current = selected
	for (;;) {
		const creditsCount = current.reduce((sum, s) => sum + s.credits, 0)
		const violators = current
			.filter(
				(s) =>
					s.prerequisites.some((p) => p.includes('%')) &&
					!prerequisitesMet(s, current, creditsCount, totalCredits),
			)
			.map((s) => s.code)
		if (violators.length === 0) return current
		const toRemove = getCascadeRemovalSet(graph, violators)
		current = current.filter((s) => !toRemove.has(s.code))
	}
}
