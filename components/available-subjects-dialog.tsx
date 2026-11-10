'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import type { Period } from '@/types'

interface AvailableSubjectsDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	/** Periods containing only the subjects that can be taken now */
	periods: Period[]
}

export function AvailableSubjectsDialog({
	open,
	onOpenChange,
	periods,
}: AvailableSubjectsDialogProps) {
	const subjects = periods.flatMap((p) => p.subjects)
	const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Materias disponibles</DialogTitle>
					<DialogDescription>
						{subjects.length === 0
							? 'No hay materias disponibles: ya completaste todas o te faltan prerrequisitos.'
							: `Tienes los prerrequisitos de ${subjects.length} materia${subjects.length === 1 ? '' : 's'} (${totalCredits} créditos) que aún no has marcado.`}
					</DialogDescription>
				</DialogHeader>
				<div className="-mx-6 px-6 overflow-y-auto space-y-4">
					{periods.map((period) => (
						<section key={period.number} className="space-y-1.5">
							<h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
								Cuatrimestre {period.number}
							</h3>
							<ul className="divide-y rounded-md border">
								{period.subjects.map((subject) => (
									<li
										key={subject.code}
										className="flex items-baseline gap-3 px-3 py-2"
										data-testid="available-subject"
									>
										<span className="font-mono text-xs shrink-0">
											{subject.code}
										</span>
										<span className="flex-1">{subject.name}</span>
										<span className="text-xs text-muted-foreground tabular-nums shrink-0">
											{subject.credits} cr.
										</span>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}
