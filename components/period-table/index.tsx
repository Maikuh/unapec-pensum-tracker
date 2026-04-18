'use client'

import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import { PrerequisiteAlert } from '@/components/prerequisite-alert'
import { PrerequisiteBadges } from '@/components/prerequisite-badges'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { getSubjectsThatCanBeSelected } from '@/lib/helpers/get-subjects-that-can-be-selected'
import { prerequisitesMet } from '@/lib/helpers/prerequisites-met'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import { cn } from '@/lib/utils'
import type { Period, Subject } from '@/types'
import type { SelectAllCheckboxStatus } from '@/types/select-all-checkbox-status.type'
import { SubjectDependencyInfo } from './subject-dependency-info'

interface PeriodTableProps {
	period: Period
	allSubjects: Subject[]
	pensumCode: string
	creditsCount: number
	totalCredits: number
	graph: PrerequisiteGraph
}

export function PeriodTable({
	period,
	allSubjects,
	pensumCode,
	creditsCount,
	totalCredits,
	graph,
}: PeriodTableProps) {
	const { selectedSubjects, selectSubject, bulkSelect } =
		useSelectedSubjectsStore()
	const currentSelected = selectedSubjects[pensumCode] ?? []

	const [checkboxStatus, setCheckboxStatus] =
		useState<SelectAllCheckboxStatus>('unchecked')
	const [alert, setAlert] = useState({
		open: false,
		title: '',
		message: '',
	})

	useEffect(() => {
		let selectedCount = 0
		period.subjects.forEach((subject) => {
			if (currentSelected.some((s) => s.code === subject.code)) selectedCount++
		})

		if (selectedCount > 0 && selectedCount < period.subjects.length) {
			setCheckboxStatus('indeterminate')
		} else if (selectedCount === period.subjects.length) {
			setCheckboxStatus('checked')
		} else if (
			getSubjectsThatCanBeSelected(
				period.subjects,
				currentSelected,
				creditsCount,
				totalCredits,
			).length === 0
		) {
			setCheckboxStatus('disabled')
		} else {
			setCheckboxStatus('unchecked')
		}
	}, [currentSelected, period.subjects, creditsCount, totalCredits])

	function handleSubjectClick(subject: Subject) {
		if (
			prerequisitesMet(subject, currentSelected, creditsCount, totalCredits)
		) {
			const isCurrentlySelected = currentSelected.some(
				(s) => s.code === subject.code,
			)
			posthog.capture('subject_toggled', {
				pensum_code: pensumCode,
				subject_code: subject.code,
				subject_name: subject.name,
				subject_credits: subject.credits,
				period_number: period.number,
				action: isCurrentlySelected ? 'deselected' : 'selected',
			})
			selectSubject(pensumCode, subject, graph, totalCredits)
		} else {
			posthog.capture('prerequisite_alert_shown', {
				pensum_code: pensumCode,
				subject_code: subject.code,
				subject_name: subject.name,
				period_number: period.number,
			})
			setAlert({
				open: true,
				title: 'No puede seleccionar esta materia',
				message:
					'No tienes los prerrequisitos completados para seleccionar esta materia.',
			})
		}
	}

	function handleSelectAll() {
		posthog.capture('period_bulk_selected', {
			pensum_code: pensumCode,
			period_number: period.number,
			previous_status: checkboxStatus,
			subjects_count: period.subjects.length,
		})
		bulkSelect(
			pensumCode,
			period.subjects,
			period.subjects.length,
			checkboxStatus,
			creditsCount,
			totalCredits,
			graph,
		)
	}

	function getSubjectNameFromPrereq(prereqCode: string): string {
		return allSubjects.find((s) => s.code === prereqCode)?.name ?? ''
	}

	return (
		<>
			<PrerequisiteAlert
				open={alert.open}
				onClose={() => setAlert({ open: false, title: '', message: '' })}
				title={alert.title}
				message={alert.message}
			/>

			<div className="rounded-md border overflow-hidden">
				<div className="px-4 py-3 bg-muted/40 border-b">
					<h2 className="font-semibold text-base">
						Cuatrimestre {period.number}
					</h2>
				</div>

				<Table className="overflow-x-visible">
					<TableHeader>
						<TableRow>
							<TableHead className="w-12">
								<Checkbox
									checked={checkboxStatus === 'checked'}
									disabled={checkboxStatus === 'disabled'}
									ref={(el) => {
										if (el) {
											// Simulate indeterminate via data attribute for CSS
											el.dataset.state = checkboxStatus
										}
									}}
									onCheckedChange={handleSelectAll}
									aria-label="select all subjects"
									data-testid="select-all-checkbox"
									data-state={checkboxStatus}
									className={cn(
										checkboxStatus === 'indeterminate' &&
											'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary',
									)}
								/>
							</TableHead>
							<TableHead>Código</TableHead>
							<TableHead>Nombre</TableHead>
							<TableHead className="text-right">Créditos</TableHead>
							<TableHead className="text-right">Pre-requisitos</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{period.subjects.map((subject) => {
							const isSelected = currentSelected.some(
								(s) => s.code === subject.code,
							)
							const canSelect = prerequisitesMet(
								subject,
								currentSelected,
								creditsCount,
								totalCredits,
							)

							return (
								<TableRow
									key={subject.code}
									onClick={() => handleSubjectClick(subject)}
									className={cn(
										'cursor-pointer',
										!canSelect && 'opacity-50 cursor-not-allowed',
										isSelected && 'bg-accent/50 hover:bg-accent/70',
									)}
									data-selected={isSelected}
									data-disabled={!canSelect}
								>
									<TableCell onClick={(e) => e.stopPropagation()}>
										<Checkbox
											checked={isSelected}
											disabled={!canSelect}
											onCheckedChange={() => handleSubjectClick(subject)}
											data-state={isSelected ? 'checked' : 'unchecked'}
											aria-label={`Seleccionar ${subject.name}`}
										/>
									</TableCell>
									<TableCell className="font-mono text-sm">
										{subject.code}
									</TableCell>
									<TableCell className="whitespace-normal wrap-break-word">
										<span className="mr-1.5">{subject.name}</span>
										<SubjectDependencyInfo
											code={subject.code}
											graph={graph}
											allSubjects={allSubjects}
										/>
									</TableCell>
									<TableCell className="text-right">
										{subject.credits}
									</TableCell>
									<TableCell className="text-right">
										<PrerequisiteBadges
											prerequisites={subject.prerequisites}
											isSelected={isSelected}
											getTooltipContent={(pr) =>
												pr.includes('%')
													? `Haber aprobado el ${pr} de los créditos del pensum`
													: getSubjectNameFromPrereq(pr)
											}
										/>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</div>
		</>
	)
}
