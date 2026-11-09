/**
 * Sanity checks on the scraped dataset. These run against the real
 * lib/data/pensums.json so a bad `bun sync:pensums` fails CI instead of
 * shipping a pensum students can't use.
 */
import { describe, expect, it } from 'vitest'
import { buildPrerequisiteGraph } from '@/lib/graph/prerequisite-graph'
import { getAllAncestors } from '@/lib/graph/traversal'
import { splitExternalPrerequisites } from '@/lib/helpers/split-external-prerequisites'
import type { Pensum } from '@/types'
import { pensumPages } from './pensum-pages'
import { pensumSummaries } from './pensum-summaries'
import pensumsData from './pensums.json'

const pensums = pensumsData as Pensum[]

describe('pensums.json', () => {
	it('has unique pensum codes, sorted', () => {
		const codes = pensums.map((p) => p.pensumCode)
		expect(new Set(codes).size).toBe(codes.length)
		expect(codes).toEqual([...codes].sort((a, b) => a.localeCompare(b)))
	})

	it('links every pensum to its official page', () => {
		for (const { pensumCode } of pensums) {
			expect(pensumPages[pensumCode], pensumCode).toMatch(
				/^https:\/\/unapec\.edu\.do\//,
			)
		}
	})

	describe.each(pensums.map((p) => [p.pensumCode, p] as const))(
		'%s',
		(_code, pensum) => {
			const subjects = pensum.periods.flatMap((p) => p.subjects)

			it('has a name, a valid date and consecutive periods starting at 1', () => {
				expect(pensum.carreerName.trim()).not.toBe('')
				expect(Number.isNaN(Date.parse(pensum.date))).toBe(false)
				expect(pensum.periods.map((p) => p.number)).toEqual(
					pensum.periods.map((_, i) => i + 1),
				)
			})

			it('has unique subject codes and non-empty names', () => {
				const codes = subjects.map((s) => s.code)
				expect(new Set(codes).size).toBe(codes.length)
				for (const s of subjects) expect(s.name.trim(), s.code).not.toBe('')
			})

			it('totalCredits equals the sum of subject credits', () => {
				expect(pensum.totalCredits).toBe(
					subjects.reduce((sum, s) => sum + s.credits, 0),
				)
			})

			it('has valid credit-percentage prerequisites', () => {
				for (const s of subjects) {
					for (const p of s.prerequisites.filter((x) => x.includes('%'))) {
						expect(p, s.code).toMatch(/^\d{1,3}%$/)
						expect(Number.parseInt(p, 10)).toBeLessThanOrEqual(100)
					}
				}
			})

			it('has no prerequisite cycles (every subject is reachable)', () => {
				const { periods } = splitExternalPrerequisites(pensum.periods)
				const graph = buildPrerequisiteGraph(periods.flatMap((p) => p.subjects))
				for (const s of subjects) {
					// A cycle means s is among the ancestors of one of its own prereqs
					for (const prereq of graph.prerequisites.get(s.code) ?? []) {
						const reachable = getAllAncestors(graph, prereq).add(prereq)
						expect(reachable.has(s.code), `${s.code} <- ${prereq}`).toBe(false)
					}
				}
			})
		},
	)
})

describe('pensumSummaries', () => {
	it('exposes only code, name and the legacy flag for every pensum', () => {
		expect(pensumSummaries).toHaveLength(pensums.length)
		for (const summary of pensumSummaries) {
			expect(Object.keys(summary).sort()).toEqual(
				summary.legacy
					? ['carreerName', 'legacy', 'pensumCode']
					: ['carreerName', 'pensumCode'],
			)
		}
		expect(pensumSummaries.find((p) => p.pensumCode === 'LEA11')?.legacy).toBe(
			true,
		)
	})
})
