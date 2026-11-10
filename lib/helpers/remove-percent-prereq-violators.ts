import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import type { Subject } from '@/types'
import { getCascadeRemovalSet } from './get-cascade-removal-set'
import { prerequisitesMet } from './prerequisites-met'

/**
 * After a deselection, drops subjects whose credit-percentage prerequisite is
 * no longer met (and, by cascade, everything that depends on them). Repeats
 * until stable, since each removal lowers the credit total.
 */
export function removePercentPrereqViolators(
	selected: Subject[],
	totalCredits: number,
	graph: PrerequisiteGraph,
): Subject[] {
	let current = selected
	for (;;) {
		const creditsCount = current.reduce((sum, s) => sum + s.credits, 0)
		// A subject's own credits don't count towards its credit requirement,
		// mirroring how selection is checked before the subject is added.
		const violators = current
			.filter(
				(s) =>
					s.prerequisites.some((p) => p.includes('%')) &&
					!prerequisitesMet(s, current, creditsCount - s.credits, totalCredits),
			)
			.map((s) => s.code)
		if (violators.length === 0) return current
		const toRemove = getCascadeRemovalSet(graph, violators)
		current = current.filter((s) => !toRemove.has(s.code))
	}
}
