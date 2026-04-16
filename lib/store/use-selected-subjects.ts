'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { getCascadeRemovalSet } from '@/lib/helpers/get-cascade-removal-set'
import { getSubjectsThatCanBeSelected } from '@/lib/helpers/get-subjects-that-can-be-selected'
import type { SelectAllCheckboxStatus } from '@/types/checkbox'
import type { SelectedSubjects, Subject } from '@/types/pensum'

interface SelectedSubjectsState {
	selectedSubjects: SelectedSubjects
	initPensum: (pensumCode: string) => void
	selectSubject: (
		pensumCode: string,
		subject: Subject,
		graph: PrerequisiteGraph,
	) => void
	bulkSelect: (
		pensumCode: string,
		newSelectedSubjects: Subject[],
		periodSubjectsCount: number,
		checkboxStatus: SelectAllCheckboxStatus,
		creditsCount: number,
		totalCredits: number,
		graph: PrerequisiteGraph,
	) => void
	importFromFile: (data: SelectedSubjects) => void
	exportToFile: () => void
}

export const useSelectedSubjectsStore = create<SelectedSubjectsState>()(
	persist(
		(set, get) => ({
			selectedSubjects: {},

			initPensum: (pensumCode) => {
				const { selectedSubjects } = get()
				if (!selectedSubjects[pensumCode]) {
					set({
						selectedSubjects: { ...selectedSubjects, [pensumCode]: [] },
					})
				}
			},

			selectSubject: (pensumCode, subject, graph) => {
				const { selectedSubjects } = get()
				const subjects = selectedSubjects[pensumCode] ?? []
				let temp: Subject[]

				if (subjects.some((s) => s.code === subject.code)) {
					// Remove subject and cascade-remove its dependents
					const toRemove = getCascadeRemovalSet(graph, [subject.code])
					temp = subjects.filter((s) => !toRemove.has(s.code))
				} else {
					temp = subjects.concat(subject)
				}

				set({
					selectedSubjects: { ...selectedSubjects, [pensumCode]: temp },
				})
			},

			bulkSelect: (
				pensumCode,
				periodSubjects,
				periodSubjectsCount,
				checkboxStatus,
				creditsCount,
				totalCredits,
				graph,
			) => {
				const { selectedSubjects } = get()
				const subjects = selectedSubjects[pensumCode] ?? []
				let temp: Subject[] = []

				if (checkboxStatus === 'unchecked') {
					const selectable = getSubjectsThatCanBeSelected(
						periodSubjects,
						subjects,
						creditsCount,
						totalCredits,
					)
					temp = subjects.concat(...selectable)
				} else if (checkboxStatus === 'indeterminate') {
					const selectableCount = getSubjectsThatCanBeSelected(
						periodSubjects,
						subjects,
						creditsCount,
						totalCredits,
					).length
					if (selectableCount < periodSubjectsCount) {
						// Some can't be selected — deselect whatever is currently selected from this period
						const periodSelectedCodes = periodSubjects
							.filter((ps) => subjects.some((s) => s.code === ps.code))
							.map((s) => s.code)
						const toRemove = getCascadeRemovalSet(graph, periodSelectedCodes)
						temp = subjects.filter((s) => !toRemove.has(s.code))
					} else {
						// All can be selected — add the ones not yet selected
						const notInSelected = periodSubjects.filter(
							(ps) => !subjects.some((s) => s.code === ps.code),
						)
						temp = subjects.concat(...notInSelected)
					}
				} else if (checkboxStatus === 'checked') {
					// Deselect all from this period with cascade
					const toRemove = getCascadeRemovalSet(
						graph,
						periodSubjects.map((s) => s.code),
					)
					temp = subjects.filter((s) => !toRemove.has(s.code))
				}

				set({
					selectedSubjects: { ...selectedSubjects, [pensumCode]: temp },
				})
			},

			importFromFile: (data) => {
				set({ selectedSubjects: data })
			},

			exportToFile: () => {
				const { selectedSubjects } = get()
				const dataStr = JSON.stringify(selectedSubjects)
				const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
				const link = document.createElement('a')
				link.setAttribute('href', dataUri)
				link.setAttribute('download', 'uptracker.json')
				link.click()
			},
		}),
		{
			name: 'selectedSubjects',
			skipHydration: true,
		},
	),
)
