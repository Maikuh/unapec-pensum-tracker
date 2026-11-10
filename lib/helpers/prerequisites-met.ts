import type { Subject } from '@/types'

/**
 * Whether `creditsCount` reaches `percent`% of `totalCredits`.
 * Compared exactly (no rounding), so 49.6% does not satisfy a 50% requirement.
 */
function meetsCreditPercentage(
	percentPrereq: string,
	creditsCount: number,
	totalCredits: number,
): boolean {
	const percent = Number(percentPrereq.match(/(\d+)/)?.[1])
	if (Number.isNaN(percent) || totalCredits <= 0) return false
	return creditsCount * 100 >= percent * totalCredits
}

export function prerequisitesMet(
	subject: Subject,
	selectedSubjects: Subject[],
	creditsCount: number,
	totalCredits: number,
): boolean {
	if (subject.prerequisites.length === 0) return true
	const selectedCodes = new Set(selectedSubjects.map((s) => s.code))
	return subject.prerequisites.every((p) =>
		p.includes('%')
			? meetsCreditPercentage(p, creditsCount, totalCredits)
			: selectedCodes.has(p),
	)
}
