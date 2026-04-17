import type { SelectedSubjects } from '@/types/pensum'

export function isValidSelectedSubjects(
	data: unknown,
): data is SelectedSubjects {
	if (typeof data !== 'object' || data === null || Array.isArray(data))
		return false
	return Object.values(data).every(
		(subjects) =>
			Array.isArray(subjects) &&
			subjects.every(
				(s) =>
					typeof s === 'object' &&
					s !== null &&
					typeof s.code === 'string' &&
					typeof s.name === 'string' &&
					typeof s.credits === 'number' &&
					Array.isArray(s.prerequisites) &&
					s.prerequisites.every((p: unknown) => typeof p === 'string'),
			),
	)
}
