import type { Node, NodeProps } from '@xyflow/react'
import { Handle, Position } from '@xyflow/react'
import type { SubjectNodeData } from '@/lib/graph/build-diagram-layout'

export function SubjectNode({ data }: NodeProps<Node<SubjectNodeData>>) {
	return (
		<div
			className={[
				'rounded border px-3 py-2 text-xs shadow-sm w-47.5 select-none',
				data.isSelected
					? 'bg-emerald-500/20 border-emerald-500 dark:bg-emerald-500/30'
					: 'bg-background border-border',
			].join(' ')}
		>
			<Handle type="target" position={Position.Top} className="bg-border!" />
			<div className="flex items-baseline justify-between gap-1">
				<p className="font-mono font-semibold leading-tight">{data.code}</p>
				<p className="text-muted-foreground/70 shrink-0">{data.credits} cr.</p>
			</div>
			<p className="text-muted-foreground leading-tight mt-0.5 wrap-break-word">
				{data.name}
			</p>
			{data.period !== null && (
				<p className="text-muted-foreground/60 mt-1">Cuatri. {data.period}</p>
			)}
			<Handle type="source" position={Position.Bottom} className="bg-border!" />
		</div>
	)
}
