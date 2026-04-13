import { beforeEach, describe, expect, it } from 'vitest'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import type { SelectedSubjects, Subject } from '@/types/pensum'

const makeSubject = (
	code: string,
	prerequisites: string[] = [],
	credits = 3,
): Subject => ({
	code,
	name: `Subject ${code}`,
	credits,
	prerequisites,
})

const PENSUM = 'TEST01'

beforeEach(() => {
	// Reset store state before each test
	useSelectedSubjectsStore.setState({ selectedSubjects: {} })
})

describe('initPensum', () => {
	it('creates an empty array for a new pensumCode', () => {
		useSelectedSubjectsStore.getState().initPensum(PENSUM)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toEqual([])
	})

	it('does not overwrite existing selection', () => {
		const existing = [makeSubject('A')]
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM]: existing },
		})
		useSelectedSubjectsStore.getState().initPensum(PENSUM)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toEqual(existing)
	})
})

describe('selectSubject', () => {
	beforeEach(() => {
		useSelectedSubjectsStore.setState({ selectedSubjects: { [PENSUM]: [] } })
	})

	it('adds a subject when not yet selected', () => {
		const subject = makeSubject('A')
		useSelectedSubjectsStore
			.getState()
			.selectSubject(PENSUM, subject, [subject])
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toContainEqual(subject)
	})

	it('removes a subject when already selected', () => {
		const subject = makeSubject('A')
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM]: [subject] },
		})
		useSelectedSubjectsStore
			.getState()
			.selectSubject(PENSUM, subject, [subject])
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toHaveLength(0)
	})

	it('cascade-removes dependent subjects when deselecting', () => {
		const a = makeSubject('A')
		const b = makeSubject('B', ['A'])
		const c = makeSubject('C', ['B'])
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM]: [a, b, c] },
		})

		useSelectedSubjectsStore.getState().selectSubject(PENSUM, a, [a, b, c])

		const selected =
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM]
		expect(selected).toHaveLength(0)
	})
})

describe('bulkSelect', () => {
	const subjects = [makeSubject('A'), makeSubject('B'), makeSubject('C')]

	beforeEach(() => {
		useSelectedSubjectsStore.setState({ selectedSubjects: { [PENSUM]: [] } })
	})

	it('adds all selectable subjects when status is unchecked', () => {
		useSelectedSubjectsStore
			.getState()
			.bulkSelect(PENSUM, subjects, 3, 'unchecked', 0, 100)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toHaveLength(3)
	})

	it('removes all subjects when status is checked', () => {
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM]: subjects },
		})
		useSelectedSubjectsStore
			.getState()
			.bulkSelect(PENSUM, subjects, 3, 'checked', 0, 100)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toHaveLength(0)
	})

	it('does nothing when status is disabled', () => {
		useSelectedSubjectsStore
			.getState()
			.bulkSelect(PENSUM, subjects, 3, 'disabled', 0, 100)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toHaveLength(0)
	})
})

describe('importFromFile', () => {
	it('replaces entire selectedSubjects state', () => {
		const newData: SelectedSubjects = {
			ADM11: [makeSubject('X')],
			ISO10: [makeSubject('Y')],
		}
		useSelectedSubjectsStore.getState().importFromFile(newData)
		expect(useSelectedSubjectsStore.getState().selectedSubjects).toEqual(
			newData,
		)
	})
})
