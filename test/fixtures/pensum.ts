import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import type { Period, Subject } from '@/types/pensum'

/**
 * A small self-contained set of subjects with prerequisite chains:
 *   MAT010 (no prereqs) -> MAT121 (requires MAT010) -> MAT131 (requires MAT121)
 *   ESP101 (no prereqs, percentage-based also) -> ESP106 (requires ESP101)
 *   HIS010 (no prereqs, standalone)
 */
export const subjects: Subject[] = [
	{ code: 'MAT010', name: 'PRE-CALCULO', credits: 4, prerequisites: [] },
	{
		code: 'MAT121',
		name: 'ALGEBRA UNIVERSITARIA',
		credits: 4,
		prerequisites: ['MAT010'],
	},
	{
		code: 'MAT131',
		name: 'CALCULO DIFERENCIAL',
		credits: 4,
		prerequisites: ['MAT121'],
	},
	{ code: 'ESP101', name: 'ESPAÑOL I', credits: 3, prerequisites: [] },
	{
		code: 'ESP106',
		name: 'ESPAÑOL II',
		credits: 3,
		prerequisites: ['ESP101'],
	},
	{
		code: 'HIS010',
		name: 'HISTORIA DOMINICANA',
		credits: 3,
		prerequisites: [],
	},
]

/** First period — subjects with no prerequisites */
export const period1: Period = {
	number: 1,
	subjects: [subjects[0], subjects[3], subjects[5]], // MAT010, ESP101, HIS010
}

/** Second period — subjects that require period1 subjects */
export const period2: Period = {
	number: 2,
	subjects: [subjects[1], subjects[4]], // MAT121 (req MAT010), ESP106 (req ESP101)
}

/** Third period — subjects with deeper prerequisite chains */
export const period3: Period = {
	number: 3,
	subjects: [subjects[2]], // MAT131 (req MAT121)
}

export const graph = buildPrerequisiteGraph(subjects)

export const PENSUM_CODE = 'TEST01'
export const TOTAL_CREDITS = 100
