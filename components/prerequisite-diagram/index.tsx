'use client'

import {
	Background,
	Controls,
	getNodesBounds,
	MiniMap,
	type NodeTypes,
	Panel,
	ReactFlow,
	useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { toPng } from 'html-to-image'
import { Download } from 'lucide-react'
import { useTheme } from 'next-themes'
import type React from 'react'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { buildDiagramLayout } from '@/lib/graph/build-diagram-layout'
import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import type { Subject } from '@/types'
import { SubjectNode } from './subject-node'

const nodeTypes: NodeTypes = { subjectNode: SubjectNode }

function DownloadButton({ pensumCode }: { pensumCode: string }) {
	const { getNodes } = useReactFlow()

	const handleDownload = async () => {
		const nodes = getNodes()
		if (nodes.length === 0) return

		const bounds = getNodesBounds(nodes)
		const padding = 24
		const captureWidth = bounds.width + padding * 2
		const captureHeight = bounds.height + padding * 2

		const viewportEl = document.querySelector(
			'.react-flow__viewport',
		) as HTMLElement | null
		if (!viewportEl) return

		const bg = window.getComputedStyle(document.body).backgroundColor
		const background = bg === 'rgba(0, 0, 0, 0)' ? '#ffffff' : bg

		const dataUrl = await toPng(viewportEl, {
			backgroundColor: background,
			width: captureWidth,
			height: captureHeight,
			pixelRatio: window.devicePixelRatio || 2,
			skipFonts: true,
			style: {
				width: `${captureWidth}px`,
				height: `${captureHeight}px`,
				transform: `translate(${-(bounds.x - padding)}px, ${-(bounds.y - padding)}px)`,
				transformOrigin: '0 0',
			},
		})

		const a = document.createElement('a')
		a.href = dataUrl
		const date = new Date().toISOString().slice(0, 10)
		a.download = `diagrama-${pensumCode}-${date}.png`
		a.click()
	}

	return (
		<Panel position="top-right">
			<Button variant="outline" size="sm" onClick={handleDownload}>
				<Download className="h-4 w-4 mr-2" />
				Descargar
			</Button>
		</Panel>
	)
}

interface PrerequisiteDiagramProps {
	subjects: Subject[]
	graph: PrerequisiteGraph
	selectedCodes: Set<string>
	periodByCode: Map<string, number>
	pensumCode: string
}

export function PrerequisiteDiagram({
	subjects,
	graph,
	selectedCodes,
	periodByCode,
	pensumCode,
}: PrerequisiteDiagramProps) {
	const { theme } = useTheme()
	const { nodes, edges } = useMemo(
		() => buildDiagramLayout(subjects, graph, selectedCodes, periodByCode),
		[subjects, graph, selectedCodes, periodByCode],
	)

	return (
		<div
			className="h-full w-full"
			style={
				{
					'--xy-controls-button-background-color-default': 'var(--background)',
					'--xy-controls-button-background-color-hover': 'var(--card)',
					'--xy-controls-button-color-default': 'var(--foreground)',
					'--xy-controls-button-border-color-default': 'var(--border)',
					'--xy-minimap-background-color-props': 'var(--muted)',
					'--xy-background-color-props': 'var(--background)',
				} as React.CSSProperties
			}
		>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
				proOptions={{ hideAttribution: true }}
				colorMode={theme === 'dark' ? 'dark' : 'light'}
				fitView
			>
				<Background />
				<Controls />
				<MiniMap />
				<DownloadButton pensumCode={pensumCode} />
			</ReactFlow>
		</div>
	)
}
