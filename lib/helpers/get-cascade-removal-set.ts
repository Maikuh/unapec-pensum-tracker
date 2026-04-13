import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { getAllDescendantsMultiple } from '@/lib/graph/traversal'

/**
 * Returns the complete set of subject codes to remove when deselecting the given codes.
 * Includes the original codes plus all their transitive dependents (subjects that require them).
 */
export function getCascadeRemovalSet(
	graph: PrerequisiteGraph,
	codesToRemove: string[],
): Set<string> {
	const descendants = getAllDescendantsMultiple(graph, codesToRemove)
	return new Set([...codesToRemove, ...descendants])
}
