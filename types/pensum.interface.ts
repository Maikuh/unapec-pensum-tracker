import type { ElectiveOption } from './elective-option.interface'
import type { Period } from './period.interface'

export interface Pensum {
	carreerName: string
	totalCredits: number
	pensumCode: string
	periods: Period[]
	date: string
	/** Options the student can fulfill by completing a certification track. */
	certifications: ElectiveOption[]
	/** Standalone elective options, chosen when not pursuing a certification. */
	electives: ElectiveOption[]
}
