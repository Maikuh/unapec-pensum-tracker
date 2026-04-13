'use client'

import { useEffect, useState } from 'react'
import { PrerequisiteAlert } from '@/components/prerequisite-alert'
import { Checkbox } from '@/components/ui/checkbox'
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
}

export function CuatriTable({
	cuatri,
	allSubjects,
	pensumCode,
	creditsCount,
	totalCredits,
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
			selectSubject(pensumCode, subject, allSubjects)
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
											el.dataset.state =
												checkboxStatus === 'indeterminate'
													? 'indeterminate'
													: checkboxStatus === 'checked'
														? 'checked'
														: 'unchecked'
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
									<TableCell>
										<Checkbox
											checked={isSelected}
											disabled={!canSelect}
											onCheckedChange={() => handleSubjectClick(subject)}
											onClick={(e) => e.stopPropagation()}
											data-state={isSelected ? 'checked' : 'unchecked'}
										/>
									</TableCell>
									<TableCell className="font-mono text-sm">
										{subject.code}
									</TableCell>
									<TableCell className="whitespace-normal wrap-break-word">
										{subject.name}
									</TableCell>
									<TableCell className="text-right">
										{subject.credits}
									</TableCell>
									<TableCell className="text-right">
										{subject.prerequisites.map((pr) =>
											pr.includes('%') ? (
												<span key={pr} className="block text-xs">
													{pr}
												</span>
											) : (
												<Tooltip key={pr}>
													<TooltipTrigger className="block text-xs cursor-help underline decoration-dotted bg-transparent p-0 h-auto font-normal">
														{pr}
													</TooltipTrigger>
													<TooltipContent>
														{getSubjectNameFromPrereq(pr)}
													</TooltipContent>
												</Tooltip>
											),
										)}
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
