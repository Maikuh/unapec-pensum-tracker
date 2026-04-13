import { describe, expect, it } from 'vitest'
import { getSubjectsThatCanBeSelected } from '@/lib/helpers/get-subjects-that-can-be-selected'
import type { Subject } from '@/types/pensum'

const makeSubject = (code: string, prerequisites: string[] = []): Subject => ({
	code,
	name: `Subject ${code}`,
	credits: 3,
	prerequisites,
})

describe('getSubjectsThatCanBeSelected', () => {
	it('returns all subjects when none have prerequisites', () => {
		const subjects = [makeSubject('A'), makeSubject('B'), makeSubject('C')]
		expect(getSubjectsThatCanBeSelected(subjects, [], 0, 100)).toEqual(subjects)
	})

	it('filters out subjects whose prerequisites are not met', () => {
		const subjects = [makeSubject('A'), makeSubject('B', ['A'])]
		// A is not selected
		const result = getSubjectsThatCanBeSelected(subjects, [], 0, 100)
		expect(result).toHaveLength(1)
		expect(result[0].code).toBe('A')
	})

	it('includes subjects whose prerequisites are met', () => {
		const subjects = [makeSubject('B', ['A'])]
		const selected = [makeSubject('A')]
		const result = getSubjectsThatCanBeSelected(subjects, selected, 0, 100)
		expect(result).toHaveLength(1)
		expect(result[0].code).toBe('B')
	})

	it('returns empty array when no subjects can be selected', () => {
		const subjects = [makeSubject('B', ['A']), makeSubject('C', ['A'])]
		expect(getSubjectsThatCanBeSelected(subjects, [], 0, 100)).toHaveLength(0)
	})

	it('handles percentage prerequisites', () => {
		const subjects = [makeSubject('ADV', ['70%'])]
		expect(getSubjectsThatCanBeSelected(subjects, [], 69, 100)).toHaveLength(0)
		expect(getSubjectsThatCanBeSelected(subjects, [], 70, 100)).toHaveLength(1)
	})
})
