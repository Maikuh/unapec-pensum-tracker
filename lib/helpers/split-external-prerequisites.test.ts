import { describe, expect, it } from 'vitest'
import type { Period, Subject } from '@/types'
import { splitExternalPrerequisites } from './split-external-prerequisites'

const make = (code: string, prerequisites: string[] = []): Subject => ({
	code,
	name: `Subject ${code}`,
	credits: 3,
	prerequisites,
})

describe('splitExternalPrerequisites', () => {
	it('returns the same period objects when every prerequisite is internal', () => {
		const periods: Period[] = [
			{ number: 1, subjects: [make('A')] },
			{ number: 2, subjects: [make('B', ['A', '50%'])] },
		]
		const result = splitExternalPrerequisites(periods)
		expect(result.periods[0]).toBe(periods[0])
		expect(result.periods[1]).toBe(periods[1])
		expect(result.externalPrerequisites.size).toBe(0)
	})

	it('moves prerequisites outside the pensum to the external map', () => {
		const periods: Period[] = [
			{ number: 1, subjects: [make('A')] },
			{ number: 2, subjects: [make('B', ['A', 'ENG008', '50%']), make('C')] },
		]
		const result = splitExternalPrerequisites(periods)
		expect(result.periods[0]).toBe(periods[0])
		expect(result.periods[1].subjects[0].prerequisites).toEqual(['A', '50%'])
		expect(result.periods[1].subjects[1]).toBe(periods[1].subjects[1])
		expect(result.externalPrerequisites.get('B')).toEqual(['ENG008'])
	})
})
