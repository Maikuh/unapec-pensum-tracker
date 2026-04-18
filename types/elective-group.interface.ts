import type { ElectiveOption } from './elective-option.interface'

export interface ElectiveGroup {
	name: string
	periods: number[]
	footnote: Array<{ type: 'p' | 'li'; text: string }>
	options: ElectiveOption[]
}
