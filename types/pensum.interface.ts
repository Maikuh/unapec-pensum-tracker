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
	/**
	 * Set when UNAPEC no longer lists this pensum (e.g. replaced by a newer
	 * version). Kept so students already tracking it don't lose their progress.
	 */
	legacy?: boolean
}
