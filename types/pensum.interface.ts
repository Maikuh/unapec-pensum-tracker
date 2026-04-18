import type { ElectiveGroup } from './elective-group.interface'
import type { Period } from './period.interface'

export interface Pensum {
	carreerName: string
	totalCredits: number
	pensumCode: string
	periods: Period[]
	date: string
	certifications: ElectiveGroup[]
	electives: ElectiveGroup[]
}
