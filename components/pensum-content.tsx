'use client'

import { useEffect } from 'react'
import { CuatriTable } from '@/components/cuatri-table'
import { InfoCard } from '@/components/info-card'
import { useHydrated } from '@/lib/store/use-hydrated'
import { useSelectedSubjectsStore } from '@/lib/store/use-selected-subjects'
import type { Pensum } from '@/types/pensum'

interface PensumContentProps {
	pensum: Pensum
}

export function PensumContent({ pensum }: PensumContentProps) {
	const { selectedSubjects, initPensum } = useSelectedSubjectsStore()
	const hydrated = useHydrated()

	useEffect(() => {
		initPensum(pensum.pensumCode)
	}, [pensum.pensumCode, initPensum])

	const currentSelected = selectedSubjects[pensum.pensumCode] ?? []
	const allSubjects = pensum.cuatris.flatMap((c) => c.subjects)
	const totalSubjects = allSubjects.length
	const creditsCount = currentSelected.reduce((sum, s) => sum + s.credits, 0)

	if (!hydrated) {
		return (
			<div className="space-y-8 animate-pulse">
				<div className="flex justify-center">
					<div className="h-64 w-full max-w-lg rounded-md bg-muted" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-48 rounded-md bg-muted" />
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-bold text-center">{pensum.carreerName}</h1>

			<InfoCard
				pensumCode={pensum.pensumCode}
				subjectsCount={currentSelected.length}
				totalSubjects={totalSubjects}
				creditsCount={creditsCount}
				totalCredits={pensum.totalCredits}
				date={pensum.date}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{pensum.cuatris.map((cuatri) => (
					<CuatriTable
						key={cuatri.period}
						cuatri={cuatri}
						allSubjects={allSubjects}
						pensumCode={pensum.pensumCode}
						creditsCount={creditsCount}
						totalCredits={pensum.totalCredits}
					/>
				))}
			</div>
		</div>
	)
}
