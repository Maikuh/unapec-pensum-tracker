import type { Subject } from './subject.interface'

export interface SelectedSubjects {
	[pensumCode: string]: Subject[]
}
