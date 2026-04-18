import type { ElectiveGroup } from './elective-group.interface'

export interface ElectiveSection {
	intro: Array<{ type: 'p' | 'li'; text: string }>
	groups: ElectiveGroup[]
}
