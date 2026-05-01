'use client'

import posthog from 'posthog-js'
import { useEffect, useState } from 'react'

const PERIOD_COLORS = [
	{
		text: 'text-blue-700 dark:text-blue-400',
		bg: 'bg-blue-100/60 dark:bg-blue-900/20',
		selectedBg:
			'bg-blue-100/80 hover:bg-blue-200/60 dark:bg-blue-900/35 dark:hover:bg-blue-900/50',
		checkboxColor:
			'data-checked:bg-blue-600 data-checked:border-blue-600 dark:data-checked:bg-blue-500 dark:data-checked:border-blue-500 data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:border-blue-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-blue-500 dark:data-[state=indeterminate]:border-blue-500',
	},
	{
		text: 'text-indigo-700 dark:text-indigo-400',
		bg: 'bg-indigo-100/60 dark:bg-indigo-900/20',
		selectedBg:
			'bg-indigo-100/80 hover:bg-indigo-200/60 dark:bg-indigo-900/35 dark:hover:bg-indigo-900/50',
		checkboxColor:
			'data-checked:bg-indigo-600 data-checked:border-indigo-600 dark:data-checked:bg-indigo-500 dark:data-checked:border-indigo-500 data-[state=indeterminate]:bg-indigo-600 data-[state=indeterminate]:border-indigo-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-indigo-500 dark:data-[state=indeterminate]:border-indigo-500',
	},
	{
		text: 'text-violet-700 dark:text-violet-400',
		bg: 'bg-violet-100/60 dark:bg-violet-900/20',
		selectedBg:
			'bg-violet-100/80 hover:bg-violet-200/60 dark:bg-violet-900/35 dark:hover:bg-violet-900/50',
		checkboxColor:
			'data-checked:bg-violet-600 data-checked:border-violet-600 dark:data-checked:bg-violet-500 dark:data-checked:border-violet-500 data-[state=indeterminate]:bg-violet-600 data-[state=indeterminate]:border-violet-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-violet-500 dark:data-[state=indeterminate]:border-violet-500',
	},
	{
		text: 'text-sky-700 dark:text-sky-400',
		bg: 'bg-sky-100/60 dark:bg-sky-900/20',
		selectedBg:
			'bg-sky-100/80 hover:bg-sky-200/60 dark:bg-sky-900/35 dark:hover:bg-sky-900/50',
		checkboxColor:
			'data-checked:bg-sky-600 data-checked:border-sky-600 dark:data-checked:bg-sky-500 dark:data-checked:border-sky-500 data-[state=indeterminate]:bg-sky-600 data-[state=indeterminate]:border-sky-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-sky-500 dark:data-[state=indeterminate]:border-sky-500',
	},
	{
		text: 'text-teal-700 dark:text-teal-400',
		bg: 'bg-teal-100/60 dark:bg-teal-900/20',
		selectedBg:
			'bg-teal-100/80 hover:bg-teal-200/60 dark:bg-teal-900/35 dark:hover:bg-teal-900/50',
		checkboxColor:
			'data-checked:bg-teal-600 data-checked:border-teal-600 dark:data-checked:bg-teal-500 dark:data-checked:border-teal-500 data-[state=indeterminate]:bg-teal-600 data-[state=indeterminate]:border-teal-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-teal-500 dark:data-[state=indeterminate]:border-teal-500',
	},
	{
		text: 'text-emerald-700 dark:text-emerald-400',
		bg: 'bg-emerald-100/60 dark:bg-emerald-900/20',
		selectedBg:
			'bg-emerald-100/80 hover:bg-emerald-200/60 dark:bg-emerald-900/35 dark:hover:bg-emerald-900/50',
		checkboxColor:
			'data-checked:bg-emerald-600 data-checked:border-emerald-600 dark:data-checked:bg-emerald-500 dark:data-checked:border-emerald-500 data-[state=indeterminate]:bg-emerald-600 data-[state=indeterminate]:border-emerald-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-emerald-500 dark:data-[state=indeterminate]:border-emerald-500',
	},
	{
		text: 'text-cyan-700 dark:text-cyan-400',
		bg: 'bg-cyan-100/60 dark:bg-cyan-900/20',
		selectedBg:
			'bg-cyan-100/80 hover:bg-cyan-200/60 dark:bg-cyan-900/35 dark:hover:bg-cyan-900/50',
		checkboxColor:
			'data-checked:bg-cyan-600 data-checked:border-cyan-600 dark:data-checked:bg-cyan-500 dark:data-checked:border-cyan-500 data-[state=indeterminate]:bg-cyan-600 data-[state=indeterminate]:border-cyan-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-cyan-500 dark:data-[state=indeterminate]:border-cyan-500',
	},
	{
		text: 'text-amber-700 dark:text-amber-400',
		bg: 'bg-amber-100/60 dark:bg-amber-900/20',
		selectedBg:
			'bg-amber-100/80 hover:bg-amber-200/60 dark:bg-amber-900/35 dark:hover:bg-amber-900/50',
		checkboxColor:
			'data-checked:bg-amber-600 data-checked:border-amber-600 dark:data-checked:bg-amber-500 dark:data-checked:border-amber-500 data-[state=indeterminate]:bg-amber-600 data-[state=indeterminate]:border-amber-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-amber-500 dark:data-[state=indeterminate]:border-amber-500',
	},
	{
		text: 'text-orange-700 dark:text-orange-400',
		bg: 'bg-orange-100/60 dark:bg-orange-900/20',
		selectedBg:
			'bg-orange-100/80 hover:bg-orange-200/60 dark:bg-orange-900/35 dark:hover:bg-orange-900/50',
		checkboxColor:
			'data-checked:bg-orange-600 data-checked:border-orange-600 dark:data-checked:bg-orange-500 dark:data-checked:border-orange-500 data-[state=indeterminate]:bg-orange-600 data-[state=indeterminate]:border-orange-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-orange-500 dark:data-[state=indeterminate]:border-orange-500',
	},
	{
		text: 'text-rose-700 dark:text-rose-400',
		bg: 'bg-rose-100/60 dark:bg-rose-900/20',
		selectedBg:
			'bg-rose-100/80 hover:bg-rose-200/60 dark:bg-rose-900/35 dark:hover:bg-rose-900/50',
		checkboxColor:
			'data-checked:bg-rose-600 data-checked:border-rose-600 dark:data-checked:bg-rose-500 dark:data-checked:border-rose-500 data-[state=indeterminate]:bg-rose-600 data-[state=indeterminate]:border-rose-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-rose-500 dark:data-[state=indeterminate]:border-rose-500',
	},
	{
		text: 'text-pink-700 dark:text-pink-400',
		bg: 'bg-pink-100/60 dark:bg-pink-900/20',
		selectedBg:
			'bg-pink-100/80 hover:bg-pink-200/60 dark:bg-pink-900/35 dark:hover:bg-pink-900/50',
		checkboxColor:
			'data-checked:bg-pink-600 data-checked:border-pink-600 dark:data-checked:bg-pink-500 dark:data-checked:border-pink-500 data-[state=indeterminate]:bg-pink-600 data-[state=indeterminate]:border-pink-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-pink-500 dark:data-[state=indeterminate]:border-pink-500',
	},
	{
		text: 'text-fuchsia-700 dark:text-fuchsia-400',
		bg: 'bg-fuchsia-100/60 dark:bg-fuchsia-900/20',
		selectedBg:
			'bg-fuchsia-100/80 hover:bg-fuchsia-200/60 dark:bg-fuchsia-900/35 dark:hover:bg-fuchsia-900/50',
		checkboxColor:
			'data-checked:bg-fuchsia-600 data-checked:border-fuchsia-600 dark:data-checked:bg-fuchsia-500 dark:data-checked:border-fuchsia-500 data-[state=indeterminate]:bg-fuchsia-600 data-[state=indeterminate]:border-fuchsia-600 data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-fuchsia-500 dark:data-[state=indeterminate]:border-fuchsia-500',
	},
]

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

	const color = PERIOD_COLORS[(period.number - 1) % PERIOD_COLORS.length]

	return (
		<>
			<PrerequisiteAlert
				open={alert.open}
				onClose={() => setAlert({ open: false, title: '', message: '' })}
				title={alert.title}
				message={alert.message}
			/>

			<div className="rounded-md border overflow-hidden">
				<div className={cn('px-4 py-3 border-b', color.bg)}>
					<h2 className={cn('font-semibold text-base', color.text)}>
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
									className={color.checkboxColor}
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
										isSelected && color.selectedBg,
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
											className={color.checkboxColor}
										/>
									</TableCell>
									<TableCell className={cn('font-mono text-sm', color.text)}>
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
