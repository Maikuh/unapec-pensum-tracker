import dagre from '@dagrejs/dagre'
import { type Edge, MarkerType, type Node } from '@xyflow/react'
import type { PrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import type { Subject } from '@/types'

export interface SubjectNodeData extends Record<string, unknown> {
	code: string
	name: string
	credits: number
	period: number | null
	isSelected: boolean
}

const NODE_WIDTH = 190
const NODE_HEIGHT = 88
const GRID_GAP = 10

export function buildDiagramLayout(
	subjects: Subject[],
	graph: PrerequisiteGraph,
	selectedCodes: Set<string>,
	periodByCode: Map<string, number>,
): { nodes: Node<SubjectNodeData>[]; edges: Edge[] } {
	// Split into connected (part of at least one edge) and isolated
	const edgePairs: Array<{ source: string; target: string }> = []
	const codeSet = new Set(subjects.map((s) => s.code))
	const connectedCodes = new Set<string>()

	for (const subject of subjects) {
		const prereqs = graph.prerequisites.get(subject.code)
		if (!prereqs) continue
		for (const prereq of prereqs) {
			if (!codeSet.has(prereq)) continue
			edgePairs.push({ source: prereq, target: subject.code })
			connectedCodes.add(prereq)
			connectedCodes.add(subject.code)
		}
	}

	const connectedSubjects = subjects.filter((s) => connectedCodes.has(s.code))
	const isolatedSubjects = subjects.filter((s) => !connectedCodes.has(s.code))

	// Dagre layout for connected subjects only
	const g = new dagre.graphlib.Graph()
	g.setDefaultEdgeLabel(() => ({}))
	g.setGraph({
		rankdir: 'TB',
		nodesep: 60,
		ranksep: 80,
		ranker: 'longest-path',
	})

	for (const subject of connectedSubjects) {
		g.setNode(subject.code, { width: NODE_WIDTH, height: NODE_HEIGHT })
	}
	for (const { source, target } of edgePairs) {
		g.setEdge(source, target)
	}
	dagre.layout(g)

	const makeData = (subject: Subject) => ({
		code: subject.code,
		name: subject.name,
		credits: subject.credits,
		period: periodByCode.get(subject.code) ?? null,
		isSelected: selectedCodes.has(subject.code),
	})

	const connectedNodes: Node<SubjectNodeData>[] = connectedSubjects.map(
		(subject) => {
			const pos = g.node(subject.code)
			return {
				id: subject.code,
				type: 'subjectNode',
				position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
				width: NODE_WIDTH,
				height: NODE_HEIGHT,
				data: makeData(subject),
			}
		},
	)

	// Place isolated nodes in a square grid below the dagre layout
	let gridStartY = 0
	let centerX = 0

	if (connectedNodes.length > 0) {
		let minX = Number.POSITIVE_INFINITY
		let maxX = Number.NEGATIVE_INFINITY
		let maxY = Number.NEGATIVE_INFINITY
		for (const node of connectedNodes) {
			minX = Math.min(minX, node.position.x)
			maxX = Math.max(maxX, node.position.x + NODE_WIDTH)
			maxY = Math.max(maxY, node.position.y + NODE_HEIGHT)
		}
		gridStartY = maxY + 60
		centerX = (minX + maxX) / 2
	}

	const gridCols = Math.max(1, Math.ceil(Math.sqrt(isolatedSubjects.length)))
	const gridTotalWidth = gridCols * NODE_WIDTH + (gridCols - 1) * GRID_GAP
	const gridOffsetX = centerX - gridTotalWidth / 2

	const isolatedNodes: Node<SubjectNodeData>[] = isolatedSubjects.map(
		(subject, i) => {
			const col = i % gridCols
			const row = Math.floor(i / gridCols)
			return {
				id: subject.code,
				type: 'subjectNode',
				position: {
					x: gridOffsetX + col * (NODE_WIDTH + GRID_GAP),
					y: gridStartY + row * (NODE_HEIGHT + GRID_GAP),
				},
				width: NODE_WIDTH,
				height: NODE_HEIGHT,
				data: makeData(subject),
			}
		},
	)

	const edges: Edge[] = edgePairs.map(({ source, target }) => ({
		id: `${source}->${target}`,
		source,
		target,
		type: 'default',
		style: { stroke: '#94a3b8', strokeWidth: 1.5 },
		markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
	}))

	return { nodes: [...connectedNodes, ...isolatedNodes], edges }
}
