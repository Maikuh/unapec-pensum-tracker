import type { ElectiveSection } from './elective-section.interface'
import type { Period } from './period.interface'

export interface Pensum {
	carreerName: string
	totalCredits: number
	pensumCode: string
	periods: Period[]
	date: string
	certifications: ElectiveSection
	electives: ElectiveSection
}
