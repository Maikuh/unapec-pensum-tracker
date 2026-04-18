import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface PrerequisiteBadgesProps {
	prerequisites: string[]
	isSelected?: boolean
	getTooltipContent?: (prereq: string) => string
}

export function PrerequisiteBadges({
	prerequisites,
	isSelected = false,
	getTooltipContent,
}: PrerequisiteBadgesProps) {
	if (prerequisites.length === 0) return null

	return (
		<div className="flex flex-wrap justify-end gap-1">
			{prerequisites.map((pr) =>
				pr.includes('%') ? (
					<Tooltip key={pr}>
						<TooltipTrigger
							className={cn(
								'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium cursor-help',
								isSelected
									? 'bg-white text-indigo-700 dark:bg-indigo-300 dark:text-indigo-950'
									: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
							)}
						>
							{pr.match(/\d+%/)?.[0] ?? pr} créditos
						</TooltipTrigger>
						<TooltipContent>{getTooltipContent?.(pr) ?? pr}</TooltipContent>
					</Tooltip>
				) : (
					<Tooltip key={pr}>
						<TooltipTrigger
							className={cn(
								'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium cursor-help',
								isSelected
									? 'bg-indigo-700/70 text-indigo-100 dark:bg-indigo-900 dark:text-indigo-200'
									: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
							)}
						>
							{pr}
						</TooltipTrigger>
						<TooltipContent>{getTooltipContent?.(pr) ?? pr}</TooltipContent>
					</Tooltip>
				),
			)}
		</div>
	)
}
