export interface Subject {
	code: string
	name: string
	credits: number
	prerequisites: string[]
}

export interface Period {
	number: number
	subjects: Subject[]
}

export interface ElectiveOption {
	tier: string
	code: string
	name: string
	credits: number
	prerequisite: string
}

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

export interface SelectedSubjects {
	[pensumCode: string]: Subject[]
}
