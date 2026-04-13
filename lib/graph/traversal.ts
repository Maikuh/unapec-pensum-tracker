import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'

function dfs(
	adjacencyMap: Map<string, Set<string>>,
	startCodes: string[],
): Set<string> {
	const visited = new Set<string>()
	const stack = [...startCodes]

	while (stack.length > 0) {
		const current = stack[stack.length - 1]
		stack.length -= 1
		if (visited.has(current)) continue
		visited.add(current)
		const neighbors = adjacencyMap.get(current)
		if (neighbors) {
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor)) stack.push(neighbor)
			}
		}
	}

	// Remove the start codes from the result
	for (const code of startCodes) {
		visited.delete(code)
	}

	return visited
}

/**
 * Get all transitive prerequisites (ancestors) of a subject via DFS.
 * Does not include the subject itself.
 */
export function getAllAncestors(
	graph: PrerequisiteGraph,
	code: string,
): Set<string> {
	return dfs(graph.prerequisites, [code])
}

/**
 * Get all transitive dependents (descendants) of a subject via DFS.
 * Does not include the subject itself.
 */
export function getAllDescendants(
	graph: PrerequisiteGraph,
	code: string,
): Set<string> {
	return dfs(graph.dependents, [code])
}

/**
 * Get all transitive dependents for multiple starting codes via DFS.
 * Used for cascade removal. Does not include the starting codes themselves.
 */
export function getAllDescendantsMultiple(
	graph: PrerequisiteGraph,
	codes: string[],
): Set<string> {
	return dfs(graph.dependents, codes)
}
