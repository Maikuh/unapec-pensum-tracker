'use client'

import { X } from 'lucide-react'
import posthog from 'posthog-js'
import { useEffect, useMemo, useState } from 'react'
import { CertificationsSection } from '@/components/certifications-section'
import { ElectivesSection } from '@/components/electives-section'
import { FloatingProgress } from '@/components/floating-progress'
import { InfoCard } from '@/components/info-card'
import { PeriodTable } from '@/components/period-table'
import { LazyPrerequisiteDiagram } from '@/components/prerequisite-diagram/lazy'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { useInViewport } from '@/lib/hooks/use-in-viewport'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import type { Pensum } from '@/types'

interface PensumContentProps {
	pensum: Pensum
}

export function PensumContent({ pensum }: PensumContentProps) {
	const { selectedSubjects, initPensum } = useSelectedSubjectsStore()
	const [diagramOpen, setDiagramOpen] = useState(false)

	useEffect(() => {
		initPensum(pensum.pensumCode)
		posthog.capture('pensum_viewed', {
			pensum_code: pensum.pensumCode,
			career_name: pensum.carreerName,
			total_subjects: pensum.periods.reduce(
				(sum, p) => sum + p.subjects.length,
				0,
			),
			total_credits: pensum.totalCredits,
		})
	}, [
		pensum.pensumCode,
		pensum.carreerName,
		pensum.periods,
		pensum.totalCredits,
		initPensum,
	])

	const [infoCardRef, infoCardInView] = useInViewport<HTMLDivElement>()
	const currentSelected = selectedSubjects[pensum.pensumCode] ?? []
	const allSubjects = useMemo(
		() => pensum.periods.flatMap((c) => c.subjects),
		[pensum.periods],
	)
	const totalSubjects = allSubjects.length
	const creditsCount = currentSelected.reduce((sum, s) => sum + s.credits, 0)
	const graph = useMemo(
		() => buildPrerequisiteGraph(allSubjects),
		[allSubjects],
	)
	const selectedCodes = useMemo(
		() => new Set(currentSelected.map((s) => s.code)),
		[currentSelected],
	)
	const periodByCode = useMemo(
		() =>
			new Map(
				pensum.periods.flatMap((p) =>
					p.subjects.map((s) => [s.code, p.number]),
				),
			),
		[pensum.periods],
	)

	return (
		<>
			<div className="space-y-8">
				<h1 className="text-2xl font-bold text-center">{pensum.carreerName}</h1>

				<div ref={infoCardRef}>
					<InfoCard
						pensumCode={pensum.pensumCode}
						subjectsCount={currentSelected.length}
						totalSubjects={totalSubjects}
						creditsCount={creditsCount}
						totalCredits={pensum.totalCredits}
						date={pensum.date}
						onDiagramClick={() => {
							posthog.capture('diagram_opened', {
								pensum_code: pensum.pensumCode,
								career_name: pensum.carreerName,
							})
							setDiagramOpen(true)
						}}
					/>
				</div>

				<Dialog open={diagramOpen} onOpenChange={setDiagramOpen}>
					<DialogContent
						className="max-w-[95vw] sm:max-w-[95vw] w-[95vw] h-[90vh] flex flex-col p-0 gap-0"
						showCloseButton={false}
					>
						<DialogHeader className="flex-row items-center justify-between px-6 py-4 shrink-0 border-b">
							<DialogTitle>Diagrama del pensum</DialogTitle>
							<DialogClose
								render={
									<Button
										variant="ghost"
										size="icon-sm"
										className="bg-secondary cursor-pointer"
									/>
								}
							>
								<X />
								<span className="sr-only">Cerrar</span>
							</DialogClose>
						</DialogHeader>
						<div className="flex-1 min-h-0">
							{diagramOpen && (
								<LazyPrerequisiteDiagram
									subjects={allSubjects}
									graph={graph}
									selectedCodes={selectedCodes}
									periodByCode={periodByCode}
									pensumCode={pensum.pensumCode}
								/>
							)}
						</div>
					</DialogContent>
				</Dialog>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{pensum.periods.map((period) => (
						<PeriodTable
							key={period.number}
							period={period}
							allSubjects={allSubjects}
							pensumCode={pensum.pensumCode}
							creditsCount={creditsCount}
							totalCredits={pensum.totalCredits}
							graph={graph}
						/>
					))}
				</div>

				{(pensum.certifications.groups.length > 0 ||
					pensum.electives.groups.length > 0) && <Separator />}

				<CertificationsSection section={pensum.certifications} />
				<ElectivesSection section={pensum.electives} />
			</div>

			<FloatingProgress
				visible={!infoCardInView}
				subjectsCount={currentSelected.length}
				totalSubjects={totalSubjects}
				creditsCount={creditsCount}
				totalCredits={pensum.totalCredits}
			/>
		</>
	)
}
