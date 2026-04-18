'use client'

import { useEffect, useMemo } from 'react'
import { CertificationsSection } from '@/components/certifications-section'
import { ElectivesSection } from '@/components/electives-section'
import { FloatingProgress } from '@/components/floating-progress'
import { InfoCard } from '@/components/info-card'
import { PeriodTable } from '@/components/period-table'
import { Separator } from '@/components/ui/separator'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { useInViewport } from '@/lib/hooks/use-in-viewport'
import { useHydrated } from '@/lib/store/use-hydrated'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import type { Pensum } from '@/types'

interface PensumContentProps {
	pensum: Pensum
}

export function PensumContent({ pensum }: PensumContentProps) {
	const { selectedSubjects, initPensum } = useSelectedSubjectsStore()
	const hydrated = useHydrated()

	useEffect(() => {
		initPensum(pensum.pensumCode)
	}, [pensum.pensumCode, initPensum])

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

	if (!hydrated) {
		return (
			<div className="space-y-8 animate-pulse">
				<div className="flex justify-center">
					<div className="h-64 w-full max-w-lg rounded-md bg-muted" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders, no state or reordering
						<div key={i} className="h-48 rounded-md bg-muted" />
					))}
				</div>
			</div>
		)
	}

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
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
