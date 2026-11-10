import { render, screen } from '@testing-library/react'
import type { Node, NodeProps } from '@xyflow/react'
import { describe, expect, it, vi } from 'vitest'
import type { SubjectNodeData } from '@/lib/graph/build-diagram-layout'
import { SubjectNode } from './subject-node'

vi.mock('@xyflow/react', () => ({
	Handle: () => null,
	Position: { Top: 'top', Bottom: 'bottom' },
}))

function renderNode(data: Partial<SubjectNodeData>) {
	const props = {
		data: {
			code: 'MAT010',
			name: 'PRE-CALCULO',
			credits: 4,
			period: 1,
			isSelected: false,
			...data,
		},
	} as unknown as NodeProps<Node<SubjectNodeData>>
	return render(<SubjectNode {...props} />)
}

describe('SubjectNode', () => {
	it('renders code, name, credits and period', () => {
		renderNode({})
		expect(screen.getByText('MAT010')).toBeVisible()
		expect(screen.getByText('PRE-CALCULO')).toBeVisible()
		expect(screen.getByText('4 cr.')).toBeVisible()
		expect(screen.getByText('Cuatri. 1')).toBeVisible()
	})

	it('hides the period when unknown', () => {
		renderNode({ period: null })
		expect(screen.queryByText(/Cuatri\./)).not.toBeInTheDocument()
	})

	it('highlights selected subjects', () => {
		const { container } = renderNode({ isSelected: true })
		expect(container.firstElementChild?.className).toContain('emerald')
	})
})
