import { describe, expect, it } from 'vitest'
import { prerequisitesMet } from '@/lib/helpers/prerequisites-met'
import type { Subject } from '@/types'

const makeSubject = (code: string, prerequisites: string[] = []): Subject => ({
	code,
	name: `Subject ${code}`,
	credits: 3,
	prerequisites,
})

describe('prerequisitesMet', () => {
	it('returns true when subject has no prerequisites', () => {
		const subject = makeSubject('MAT001')
		expect(prerequisitesMet(subject, [], 0, 100)).toBe(true)
	})

	it('returns true when code prerequisite is in selectedSubjects', () => {
		const subject = makeSubject('MAT002', ['MAT001'])
		const selected = [makeSubject('MAT001')]
		expect(prerequisitesMet(subject, selected, 0, 100)).toBe(true)
	})

	it('returns false when code prerequisite is NOT in selectedSubjects', () => {
		const subject = makeSubject('MAT002', ['MAT001'])
		expect(prerequisitesMet(subject, [], 0, 100)).toBe(false)
	})

	it('returns true when percentage prerequisite is met', () => {
		const subject = makeSubject('ADV001', ['70%'])
		// 70 / 100 * 100 = 70 >= 70
		expect(prerequisitesMet(subject, [], 70, 100)).toBe(true)
	})

	it('returns false when percentage prerequisite is not met', () => {
		const subject = makeSubject('ADV001', ['70%'])
		// 60 / 100 * 100 = 60 < 70
		expect(prerequisitesMet(subject, [], 60, 100)).toBe(false)
	})

	it('returns true when full-text percentage prerequisite is met', () => {
		const subject = makeSubject('ADV001', ['50% de los créditos aprobados'])
		expect(prerequisitesMet(subject, [], 50, 100)).toBe(true)
	})

	it('returns false when full-text percentage prerequisite is not met', () => {
		const subject = makeSubject('ADV001', ['50% de los créditos aprobados'])
		expect(prerequisitesMet(subject, [], 49, 100)).toBe(false)
	})

	it('returns true when all mixed prerequisites are met', () => {
		const subject = makeSubject('ADV002', ['MAT001', '70%'])
		const selected = [makeSubject('MAT001')]
		expect(prerequisitesMet(subject, selected, 70, 100)).toBe(true)
	})

	it('returns false when only some mixed prerequisites are met', () => {
		const subject = makeSubject('ADV002', ['MAT001', '70%'])
		const selected = [makeSubject('MAT001')]
		// credits not met
		expect(prerequisitesMet(subject, selected, 50, 100)).toBe(false)
	})

	it('returns false when multiple code prerequisites and one is missing', () => {
		const subject = makeSubject('ADV003', ['MAT001', 'MAT002'])
		const selected = [makeSubject('MAT001')]
		expect(prerequisitesMet(subject, selected, 0, 100)).toBe(false)
	})
})
