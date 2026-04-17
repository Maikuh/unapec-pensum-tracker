import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
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

	it('initialises from empty when pensumCode has no entry', () => {
		const subject = makeSubject('A')
		const graph = buildPrerequisiteGraph([subject])
		useSelectedSubjectsStore.setState({ selectedSubjects: {} })
		useSelectedSubjectsStore.getState().selectSubject(PENSUM, subject, graph)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toContainEqual(subject)
	})

	it('adds a subject when not yet selected', () => {
		const subject = makeSubject('A')
		const graph = buildPrerequisiteGraph([subject])
		useSelectedSubjectsStore.getState().selectSubject(PENSUM, subject, graph)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toContainEqual(subject)
	})

	it('removes a subject when already selected', () => {
		const subject = makeSubject('A')
		const graph = buildPrerequisiteGraph([subject])
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM]: [subject] },
		})
		useSelectedSubjectsStore.getState().selectSubject(PENSUM, subject, graph)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toHaveLength(0)
	})

	it('cascade-removes dependent subjects when deselecting', () => {
		const a = makeSubject('A')
		const b = makeSubject('B', ['A'])
		const c = makeSubject('C', ['B'])
		const graph = buildPrerequisiteGraph([a, b, c])
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM]: [a, b, c] },
		})

		useSelectedSubjectsStore.getState().selectSubject(PENSUM, a, graph)

		const selected =
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM]
		expect(selected).toHaveLength(0)
	})
})

describe('bulkSelect', () => {
	const subjects = [makeSubject('A'), makeSubject('B'), makeSubject('C')]
	const graph = buildPrerequisiteGraph(subjects)

	beforeEach(() => {
		useSelectedSubjectsStore.setState({ selectedSubjects: { [PENSUM]: [] } })
	})

	it('initialises from empty when pensumCode has no entry', () => {
		useSelectedSubjectsStore.setState({ selectedSubjects: {} })
		useSelectedSubjectsStore
			.getState()
			.bulkSelect(PENSUM, subjects, 3, 'unchecked', 0, 100, graph)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toHaveLength(3)
	})

	it('adds all selectable subjects when status is unchecked', () => {
		useSelectedSubjectsStore
			.getState()
			.bulkSelect(PENSUM, subjects, 3, 'unchecked', 0, 100, graph)
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
			.bulkSelect(PENSUM, subjects, 3, 'checked', 0, 100, graph)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toHaveLength(0)
	})

	it('does nothing when status is disabled', () => {
		useSelectedSubjectsStore
			.getState()
			.bulkSelect(PENSUM, subjects, 3, 'disabled', 0, 100, graph)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toHaveLength(0)
	})

	it('indeterminate: deselects period subjects when some cannot be selected', () => {
		// A has no prereqs, B and C require an external code 'X' not in subjects
		const a = makeSubject('A')
		const b = makeSubject('B', ['X'])
		const c = makeSubject('C', ['X'])
		const periodSubjects = [a, b, c]
		const g = buildPrerequisiteGraph(periodSubjects)
		// Only A is currently selected (X is never available)
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM]: [a] },
		})
		// selectableCount = 1 (only A) < periodSubjectsCount = 3 → deselect A
		useSelectedSubjectsStore
			.getState()
			.bulkSelect(PENSUM, periodSubjects, 3, 'indeterminate', 0, 100, g)
		expect(
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM],
		).toHaveLength(0)
	})

	it('indeterminate: adds remaining subjects when all can be selected', () => {
		// A, B, C have no prerequisites — all selectable
		const a = makeSubject('A')
		const b = makeSubject('B')
		const c = makeSubject('C')
		const periodSubjects = [a, b, c]
		const g = buildPrerequisiteGraph(periodSubjects)
		// Only A is currently selected
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM]: [a] },
		})
		// selectableCount = 3 = periodSubjectsCount = 3 → add B and C
		useSelectedSubjectsStore
			.getState()
			.bulkSelect(PENSUM, periodSubjects, 3, 'indeterminate', 0, 100, g)
		const selected =
			useSelectedSubjectsStore.getState().selectedSubjects[PENSUM]
		expect(selected).toHaveLength(3)
		expect(selected.map((s) => s.code).sort()).toEqual(['A', 'B', 'C'])
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

describe('exportToFile', () => {
	it('creates a download anchor with the correct attributes and triggers a click', () => {
		const subject = makeSubject('MAT010')
		useSelectedSubjectsStore.setState({
			selectedSubjects: { [PENSUM]: [subject] },
		})

		const anchor = document.createElement('a')
		const clickSpy = vi.spyOn(anchor, 'click').mockImplementation(() => {})
		vi.spyOn(document, 'createElement').mockReturnValueOnce(anchor)

		useSelectedSubjectsStore.getState().exportToFile()

		expect(anchor.getAttribute('download')).toBe('uptracker.json')
		expect(anchor.getAttribute('href')).toContain('application/json')
		expect(anchor.getAttribute('href')).toContain(
			encodeURIComponent(subject.code),
		)
		expect(clickSpy).toHaveBeenCalledOnce()
	})
})
