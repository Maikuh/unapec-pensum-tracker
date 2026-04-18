'use client'

import { CreditCard, FileText } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface FloatingProgressProps {
	subjectsCount: number
	totalSubjects: number
	creditsCount: number
	totalCredits: number
	visible: boolean
}

export function FloatingProgress({
	subjectsCount,
	totalSubjects,
	creditsCount,
	totalCredits,
	visible,
}: FloatingProgressProps) {
	const subjectsPercent = Math.round((subjectsCount / totalSubjects) * 100)
	const creditsPercent = Math.round((creditsCount / totalCredits) * 100)

	return (
		<div
			role="status"
			aria-live="polite"
			aria-label="Progreso del pensum"
			aria-hidden={!visible}
			tabIndex={visible ? undefined : -1}
			className={`fixed bottom-6 left-6 z-50 w-56 rounded-lg border bg-card/95 backdrop-blur shadow-lg p-3 space-y-2 transition-all duration-200 motion-reduce:transition-none ${
				visible
					? 'opacity-100 translate-y-0'
					: 'opacity-0 translate-y-2 pointer-events-none'
			}`}
		>
			<div className="flex items-center gap-2">
				<FileText
					className="h-4 w-4 text-muted-foreground shrink-0"
					aria-hidden="true"
				/>
				<Progress
					value={subjectsPercent}
					className="flex-1 h-1.5"
					indicatorClassName="bg-amber-500"
				/>
				<span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
					{subjectsPercent}%
				</span>
			</div>
			<div className="flex items-center gap-2">
				<CreditCard
					className="h-4 w-4 text-muted-foreground shrink-0"
					aria-hidden="true"
				/>
				<Progress
					value={creditsPercent}
					className="flex-1 h-1.5"
					indicatorClassName="bg-emerald-500"
				/>
				<span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
					{creditsPercent}%
				</span>
			</div>
		</div>
	)
}
