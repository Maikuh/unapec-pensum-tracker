import type { Period } from '@/types'

/**
 * Some UNAPEC pensums list prerequisites that are not part of the pensum itself
 * (e.g. an English level taught outside the program). Those can never be ticked
 * in the tracker, which would make the subject impossible to select.
 *
 * Returns the periods with those codes removed from `prerequisites` (so they no
 * longer block selection) and a map of subject code → external prerequisites,
 * so the UI can still show them.
 */
export function splitExternalPrerequisites(periods: Period[]): {
	periods: Period[]
	externalPrerequisites: Map<string, string[]>
} {
	const codes = new Set(
		periods.flatMap((p) => p.subjects.map((subject) => subject.code)),
	)
	const externalPrerequisites = new Map<string, string[]>()

	const normalized = periods.map((period) => {
		let changed = false
		const subjects = period.subjects.map((subject) => {
			const external = subject.prerequisites.filter(
				(p) => !p.includes('%') && !codes.has(p),
			)
			if (external.length === 0) return subject
			changed = true
			externalPrerequisites.set(subject.code, external)
			return {
				...subject,
				prerequisites: subject.prerequisites.filter(
					(p) => !external.includes(p),
				),
			}
		})
		return changed ? { ...period, subjects } : period
	})

	return { periods: normalized, externalPrerequisites }
}
