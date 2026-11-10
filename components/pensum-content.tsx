'use client'

import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AvailableSubjectsDialog } from '@/components/available-subjects-dialog'
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
import { posthog } from '@/lib/analytics'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { prerequisitesMet } from '@/lib/helpers/prerequisites-met'
import { splitExternalPrerequisites } from '@/lib/helpers/split-external-prerequisites'
import { useInViewport } from '@/lib/hooks/use-in-viewport'
import { useHydrated } from '@/lib/store/use-hydrated'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import type { Pensum } from '@/types'

interface PensumContentProps {
	pensum: Pensum
}

export function PensumContent({ pensum }: PensumContentProps) {
	const { selectedSubjects, initPensum, syncPensum, resetPensum } =
		useSelectedSubjectsStore()
	const hydrated = useHydrated()
	const [diagramOpen, setDiagramOpen] = useState(false)
	const [availableOpen, setAvailableOpen] = useState(false)

	const { periods, externalPrerequisites } = useMemo(
		() => splitExternalPrerequisites(pensum.periods),
		[pensum.periods],
	)
	const allSubjects = useMemo(
		() => periods.flatMap((c) => c.subjects),
		[periods],
	)
	const storedSelected = selectedSubjects[pensum.pensumCode]

	useEffect(() => {
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
	])

	// Once saved progress is loaded, make sure it matches the current pensum
	// data (names/credits/prerequisites can change between syncs). Re-runs after
	// an import, and is a no-op when everything is already up to date.
	useEffect(() => {
		if (!hydrated) return
		initPensum(pensum.pensumCode)
		if (storedSelected) syncPensum(pensum.pensumCode, allSubjects)
	}, [
		hydrated,
		pensum.pensumCode,
		allSubjects,
		storedSelected,
		initPensum,
		syncPensum,
	])

	const [infoCardRef, infoCardInView] = useInViewport<HTMLDivElement>()
	const currentSelected = storedSelected ?? []
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
				periods.flatMap((p) => p.subjects.map((s) => [s.code, p.number])),
			),
		[periods],
	)
	const availablePeriods = periods
		.map((period) => ({
			...period,
			subjects: period.subjects.filter(
				(s) =>
					!selectedCodes.has(s.code) &&
					prerequisitesMet(
						s,
						currentSelected,
						creditsCount,
						pensum.totalCredits,
					),
			),
		}))
		.filter((period) => period.subjects.length > 0)
	const availableCount = availablePeriods.reduce(
		(sum, p) => sum + p.subjects.length,
		0,
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
						legacy={pensum.legacy}
						availableCount={availableCount}
						onAvailableClick={() => {
							posthog.capture('available_subjects_opened', {
								pensum_code: pensum.pensumCode,
								available_count: availableCount,
							})
							setAvailableOpen(true)
						}}
						onReset={() => {
							posthog.capture('progress_reset', {
								pensum_code: pensum.pensumCode,
								subjects_count: currentSelected.length,
							})
							resetPensum(pensum.pensumCode)
						}}
						onDiagramClick={() => {
							posthog.capture('diagram_opened', {
								pensum_code: pensum.pensumCode,
								career_name: pensum.carreerName,
							})
							setDiagramOpen(true)
						}}
					/>
				</div>

				<AvailableSubjectsDialog
					open={availableOpen}
					onOpenChange={setAvailableOpen}
					periods={availablePeriods}
				/>

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
					{periods.map((period) => (
						<PeriodTable
							key={period.number}
							period={period}
							allSubjects={allSubjects}
							pensumCode={pensum.pensumCode}
							creditsCount={creditsCount}
							totalCredits={pensum.totalCredits}
							graph={graph}
							externalPrerequisites={externalPrerequisites}
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
