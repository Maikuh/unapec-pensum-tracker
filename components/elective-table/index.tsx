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
import type { ElectiveGroup } from '@/types'
import { renderDescItems } from './section-intro'

function PrerequisiteBadges({ value }: { value: string }) {
	if (!value) return null
	const parts = value
		.split(',')
		.map((p) => p.trim())
		.filter(Boolean)
	return (
		<div className="flex flex-wrap justify-end gap-1">
			{parts.map((pr) =>
				pr.includes('%') ? (
					<Tooltip key={pr}>
						<TooltipTrigger className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium cursor-help bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
							{pr.match(/\d+%/)?.[0] ?? pr} créditos
						</TooltipTrigger>
						<TooltipContent>{pr}</TooltipContent>
					</Tooltip>
				) : (
					<Tooltip key={pr}>
						<TooltipTrigger className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium cursor-help bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
							{pr}
						</TooltipTrigger>
						<TooltipContent>{pr}</TooltipContent>
					</Tooltip>
				),
			)}
		</div>
	)
}

function toRoman(n: number): string {
	const vals = [
		[1000, 'M'],
		[900, 'CM'],
		[500, 'D'],
		[400, 'CD'],
		[100, 'C'],
		[90, 'XC'],
		[50, 'L'],
		[40, 'XL'],
		[10, 'X'],
		[9, 'IX'],
		[5, 'V'],
		[4, 'IV'],
		[1, 'I'],
	] as [number, string][]
	let result = ''
	let remaining = n
	for (const [val, sym] of vals) {
		while (remaining >= val) {
			result += sym
			remaining -= val
		}
	}
	return result
}

interface ElectiveTableProps {
	group: ElectiveGroup
}

export function ElectiveTable({ group }: ElectiveTableProps) {
	const periodLabel =
		group.periods.length > 0
			? `Cuatrimestre${group.periods.length > 1 ? 's' : ''} ${group.periods.map(toRoman).join(', ')}`
			: null

	return (
		<div className="rounded-md border overflow-hidden">
			<div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between gap-2">
				<h3 className="font-semibold text-base">{group.name}</h3>
				{periodLabel && (
					<span className="text-sm text-muted-foreground shrink-0">
						{periodLabel}
					</span>
				)}
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Electiva</TableHead>
						<TableHead>Código</TableHead>
						<TableHead>Asignatura</TableHead>
						<TableHead className="text-right">Créditos</TableHead>
						<TableHead className="text-right">Pre-requisito</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{(() => {
						let tierIndex = -1
						let lastTier = ''
						return group.options.map((opt) => {
							if (opt.tier !== lastTier) {
								tierIndex++
								lastTier = opt.tier
							}
							return (
								<TableRow
									key={opt.code}
									className={tierIndex % 2 === 1 ? 'bg-muted/40' : undefined}
								>
									<TableCell className="font-mono text-sm">
										{opt.tier}
									</TableCell>
									<TableCell className="font-mono text-sm">
										{opt.code}
									</TableCell>
									<TableCell className="whitespace-normal wrap-break-word">
										{opt.name}
									</TableCell>
									<TableCell className="text-right">{opt.credits}</TableCell>
									<TableCell className="text-right">
										<PrerequisiteBadges value={opt.prerequisite} />
									</TableCell>
								</TableRow>
							)
						})
					})()}
				</TableBody>
			</Table>

			{group.footnote.length > 0 && (
				<div className="px-4 py-3 border-t text-sm text-muted-foreground space-y-1.5">
					{renderDescItems(group.footnote)}
				</div>
			)}
		</div>
	)
}
