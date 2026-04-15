'use client'

import { Info } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { PrerequisiteAlert } from '@/components/prerequisite-alert'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { getAllAncestors, getAllDescendants } from '@/lib/graph/traversal'
import { getSubjectsThatCanBeSelected } from '@/lib/helpers/get-subjects-that-can-be-selected'
import { prerequisitesMet } from '@/lib/helpers/prerequisites-met'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import { cn } from '@/lib/utils'
import type { SelectAllCheckboxStatus } from '@/types/checkbox'
import type { Cuatri, Subject } from '@/types/pensum'

interface CuatriTableProps {
	cuatri: Cuatri
	allSubjects: Subject[]
	pensumCode: string
	creditsCount: number
	totalCredits: number
	graph: PrerequisiteGraph
}

interface SubjectDependencyInfoProps {
	code: string
	graph: PrerequisiteGraph
	allSubjects: Subject[]
}

function SubjectDependencyInfo({
	code,
	graph,
	allSubjects,
}: SubjectDependencyInfoProps) {
	const ancestors = useMemo(() => getAllAncestors(graph, code), [graph, code])
	const descendants = useMemo(
		() => getAllDescendants(graph, code),
		[graph, code],
	)

	if (ancestors.size === 0 && descendants.size === 0) return null

	function getSubjectName(subjectCode: string): string {
		return allSubjects.find((s) => s.code === subjectCode)?.name ?? subjectCode
	}

	return (
		<Popover>
			<PopoverTrigger
				onClick={(e) => e.stopPropagation()}
				className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
				aria-label="Ver dependencias"
			>
				<Info className="h-3.5 w-3.5" />
			</PopoverTrigger>
			<PopoverContent
				className="w-72 text-sm"
				onClick={(e) => e.stopPropagation()}
			>
				{ancestors.size > 0 && (
					<div className="mb-3">
						<p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
							Prerrequisitos (cadena completa)
						</p>
						<ul className="space-y-0.5">
							{[...ancestors].map((ancestorCode) => (
								<li key={ancestorCode} className="flex gap-1.5 text-xs">
									<span className="font-mono shrink-0">{ancestorCode}</span>
									<span className="text-muted-foreground">
										{getSubjectName(ancestorCode)}
									</span>
								</li>
							))}
						</ul>
					</div>
				)}
				{descendants.size > 0 && (
					<div>
						<p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
							Desbloquea
						</p>
						<ul className="space-y-0.5">
							{[...descendants].map((descendantCode) => (
								<li key={descendantCode} className="flex gap-1.5 text-xs">
									<span className="font-mono shrink-0">{descendantCode}</span>
									<span className="text-muted-foreground">
										{getSubjectName(descendantCode)}
									</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}

export function CuatriTable({
	cuatri,
	allSubjects,
	pensumCode,
	creditsCount,
	totalCredits,
	graph,
}: CuatriTableProps) {
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
		cuatri.subjects.forEach((subject) => {
			if (currentSelected.some((s) => s.code === subject.code)) selectedCount++
		})

		if (selectedCount > 0 && selectedCount < cuatri.subjects.length) {
			setCheckboxStatus('indeterminate')
		} else if (selectedCount === cuatri.subjects.length) {
			setCheckboxStatus('checked')
		} else if (
			getSubjectsThatCanBeSelected(
				cuatri.subjects,
				currentSelected,
				creditsCount,
				totalCredits,
			).length === 0
		) {
			setCheckboxStatus('disabled')
		} else {
			setCheckboxStatus('unchecked')
		}
	}, [currentSelected, cuatri.subjects, creditsCount, totalCredits])

	function handleSubjectClick(subject: Subject) {
		if (
			prerequisitesMet(subject, currentSelected, creditsCount, totalCredits)
		) {
			selectSubject(pensumCode, subject, graph)
		} else {
			setAlert({
				open: true,
				title: 'No puede seleccionar esta materia',
				message:
					'No tienes los prerrequisitos completados para seleccionar esta materia.',
			})
		}
	}

	function handleSelectAll() {
		const selectable = getSubjectsThatCanBeSelected(
			cuatri.subjects,
			currentSelected,
			creditsCount,
			totalCredits,
		)
		bulkSelect(
			pensumCode,
			selectable,
			cuatri.subjects.length,
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
					<h3 className="font-semibold text-base">
						Cuatrimestre {cuatri.period}
					</h3>
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
						{cuatri.subjects.map((subject) => {
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
										isSelected && 'bg-accent',
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
										<div className="flex flex-wrap justify-end gap-1">
											{subject.prerequisites.map((pr) =>
												pr.includes('%') ? (
													<span
														key={pr}
														className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground"
													>
														{pr}
													</span>
												) : (
													<Tooltip key={pr}>
														<TooltipTrigger className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 cursor-help">
															{pr}
														</TooltipTrigger>
														<TooltipContent>
															{getSubjectNameFromPrereq(pr)}
														</TooltipContent>
													</Tooltip>
												),
											)}
										</div>
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
