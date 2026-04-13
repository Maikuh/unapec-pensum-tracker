import { describe, expect, it } from 'vitest'
import { getAllPrerequisiteSubjects } from '@/lib/helpers/get-all-prerequisite-subjects'
import type { Subject } from '@/types/pensum'

const makeSubject = (code: string, prerequisites: string[] = []): Subject => ({
	code,
	name: `Subject ${code}`,
	credits: 3,
	prerequisites,
})

describe('getAllPrerequisiteSubjects', () => {
	it('returns unchanged list when no subjects depend on the given code', () => {
		const subjects = [makeSubject('A'), makeSubject('B')]
		const result = getAllPrerequisiteSubjects(subjects, 'C', ['C'])
		expect(result).toEqual(['C'])
	})

	it('adds direct dependents to the removal list', () => {
		const subjects = [
			makeSubject('A'),
			makeSubject('B', ['A']),
			makeSubject('C'),
		]
		const result = getAllPrerequisiteSubjects(subjects, 'A', ['A'])
		expect(result).toContain('B')
	})

	it('adds multiple direct dependents', () => {
		const subjects = [
			makeSubject('A'),
			makeSubject('B', ['A']),
			makeSubject('C', ['A']),
		]
		const result = getAllPrerequisiteSubjects(subjects, 'A', ['A'])
		expect(result).toContain('B')
		expect(result).toContain('C')
	})

	it('does not add subjects with different prerequisites', () => {
		const subjects = [makeSubject('A'), makeSubject('B', ['X'])]
		const result = getAllPrerequisiteSubjects(subjects, 'A', ['A'])
		expect(result).not.toContain('B')
	})
})
