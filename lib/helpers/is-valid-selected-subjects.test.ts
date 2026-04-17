import { describe, expect, it } from 'vitest'
import { isValidSelectedSubjects } from './is-valid-selected-subjects'

const validSubject = {
	code: 'MAT010',
	name: 'PRE-CALCULO',
	credits: 4,
	prerequisites: [],
}

describe('isValidSelectedSubjects', () => {
	it('returns true for a valid SelectedSubjects object', () => {
		expect(isValidSelectedSubjects({ TEST01: [validSubject] })).toBe(true)
	})

	it('returns true for an empty object', () => {
		expect(isValidSelectedSubjects({})).toBe(true)
	})

	it('returns true for a pensum with an empty subject array', () => {
		expect(isValidSelectedSubjects({ TEST01: [] })).toBe(true)
	})

	it('returns false for null', () => {
		expect(isValidSelectedSubjects(null)).toBe(false)
	})

	it('returns false for an array', () => {
		expect(isValidSelectedSubjects([])).toBe(false)
	})

	it('returns false for a string', () => {
		expect(isValidSelectedSubjects('invalid')).toBe(false)
	})

	it('returns false when a pensum value is not an array', () => {
		expect(isValidSelectedSubjects({ TEST01: 'not-an-array' })).toBe(false)
	})

	it('returns false when a subject is missing the code field', () => {
		const bad = { ...validSubject, code: undefined }
		expect(isValidSelectedSubjects({ TEST01: [bad] })).toBe(false)
	})

	it('returns false when credits is not a number', () => {
		const bad = { ...validSubject, credits: '4' }
		expect(isValidSelectedSubjects({ TEST01: [bad] })).toBe(false)
	})

	it('returns false when prerequisites contains a non-string', () => {
		const bad = { ...validSubject, prerequisites: [123] }
		expect(isValidSelectedSubjects({ TEST01: [bad] })).toBe(false)
	})
})
