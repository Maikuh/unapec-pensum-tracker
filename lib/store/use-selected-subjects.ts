'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { getCascadeRemovalSet } from '@/lib/helpers/get-cascade-removal-set'
import { getSubjectsThatCanBeSelected } from '@/lib/helpers/get-subjects-that-can-be-selected'
import { removePercentPrereqViolators } from '@/lib/helpers/remove-percent-prereq-violators'
import type { SelectedSubjects, Subject } from '@/types'
import type { SelectAllCheckboxStatus } from '@/types/select-all-checkbox-status.type'

interface SelectedSubjectsState {
	selectedSubjects: SelectedSubjects
	initPensum: (pensumCode: string) => void
	selectSubject: (
		pensumCode: string,
		subject: Subject,
		graph: PrerequisiteGraph,
		totalCredits: number,
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
	/**
	 * Replaces saved subjects for a pensum with their current definitions
	 * (name/credits/prerequisites may have changed since they were saved) and
	 * drops codes that are no longer part of the pensum. No-op when up to date.
	 */
	syncPensum: (pensumCode: string, pensumSubjects: Subject[]) => void
	resetPensum: (pensumCode: string) => void
	/** Merges imported data: pensums in the file replace the stored ones. */
	importFromFile: (data: SelectedSubjects) => void
	exportToFile: () => void
}

function isSameSubject(a: Subject, b: Subject): boolean {
	return (
		a.code === b.code &&
		a.name === b.name &&
		a.credits === b.credits &&
		a.prerequisites.length === b.prerequisites.length &&
		a.prerequisites.every((p, i) => p === b.prerequisites[i])
	)
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

			selectSubject: (pensumCode, subject, graph, totalCredits) => {
				const { selectedSubjects } = get()
				const subjects = selectedSubjects[pensumCode] ?? []
				let temp: Subject[]

				if (subjects.some((s) => s.code === subject.code)) {
					const toRemove = getCascadeRemovalSet(graph, [subject.code])
					temp = subjects.filter((s) => !toRemove.has(s.code))
					temp = removePercentPrereqViolators(temp, totalCredits, graph)
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
						temp = removePercentPrereqViolators(temp, totalCredits, graph)
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
					temp = removePercentPrereqViolators(temp, totalCredits, graph)
				}

				set({
					selectedSubjects: { ...selectedSubjects, [pensumCode]: temp },
				})
			},

			syncPensum: (pensumCode, pensumSubjects) => {
				const { selectedSubjects } = get()
				const saved = selectedSubjects[pensumCode]
				if (!saved) return
				const savedCodes = new Set(saved.map((s) => s.code))
				const synced = pensumSubjects.filter((s) => savedCodes.has(s.code))
				const savedByCode = new Map(saved.map((s) => [s.code, s]))
				const upToDate =
					synced.length === saved.length &&
					synced.every((s) => {
						const prev = savedByCode.get(s.code)
						return prev !== undefined && isSameSubject(prev, s)
					})
				if (upToDate) return
				set({
					selectedSubjects: { ...selectedSubjects, [pensumCode]: synced },
				})
			},

			resetPensum: (pensumCode) => {
				const { selectedSubjects } = get()
				set({ selectedSubjects: { ...selectedSubjects, [pensumCode]: [] } })
			},

			importFromFile: (data) => {
				const { selectedSubjects } = get()
				set({ selectedSubjects: { ...selectedSubjects, ...data } })
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
