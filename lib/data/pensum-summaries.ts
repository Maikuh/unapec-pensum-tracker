import type { Pensum } from '@/types'
import pensumsData from './pensums.json'

export type PensumSummary = Pick<Pensum, 'pensumCode' | 'carreerName'> & {
	legacy?: boolean
}

/**
 * Only the fields the career picker needs. Import this from Server Components
 * and pass it down: importing pensums.json from a Client Component ships every
 * pensum (hundreds of KB) to the browser.
 */
export const pensumSummaries: PensumSummary[] = (pensumsData as Pensum[]).map(
	({ pensumCode, carreerName, legacy }) =>
		legacy ? { pensumCode, carreerName, legacy } : { pensumCode, carreerName },
)
