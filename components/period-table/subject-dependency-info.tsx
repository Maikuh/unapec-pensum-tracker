'use client'

import { Info } from 'lucide-react'
import { useMemo } from 'react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { getAllAncestors, getAllDescendants } from '@/lib/graph/traversal'
import type { Subject } from '@/types'

export interface SubjectDependencyInfoProps {
	code: string
	graph: PrerequisiteGraph
	allSubjects: Subject[]
}

export function SubjectDependencyInfo({
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
