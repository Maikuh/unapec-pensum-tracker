import type { Subject } from '@/types/pensum'

export interface PrerequisiteGraph {
	/** code -> set of codes that are direct prerequisites OF this subject (backward edges) */
	prerequisites: Map<string, Set<string>>
	/** code -> set of codes that this subject directly UNLOCKS (forward edges) */
	dependents: Map<string, Set<string>>
}

export function buildPrerequisiteGraph(subjects: Subject[]): PrerequisiteGraph {
	const prerequisites = new Map<string, Set<string>>()
	const dependents = new Map<string, Set<string>>()

	// Initialize empty sets for every subject
	for (const subject of subjects) {
		prerequisites.set(subject.code, new Set())
		dependents.set(subject.code, new Set())
	}

	// Populate edges from subject prerequisite arrays (skip percentage-based prerequisites)
	for (const subject of subjects) {
		for (const prereq of subject.prerequisites) {
			if (prereq.includes('%')) continue

			prerequisites.get(subject.code)?.add(prereq)

			// Ensure the prerequisite node exists even if not in subjects list
			if (!dependents.has(prereq)) {
				dependents.set(prereq, new Set())
			}
			dependents.get(prereq)?.add(subject.code)
		}
	}

	return { prerequisites, dependents }
}
