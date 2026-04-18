import type { ElectiveOption } from './elective-option.interface'

export interface ElectiveGroup {
	name: string
	periods: number[]
	options: ElectiveOption[]
}
