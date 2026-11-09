/**
 * Pure parsing helpers used by scripts/sync-pensums.ts.
 * Kept free of network/filesystem access so they can be unit tested.
 */

import * as cheerio from 'cheerio'
import type { AnyNode } from 'domhandler'
import type {
	ElectiveGroup,
	ElectiveOption,
	ElectiveSection,
	Pensum,
	Period,
	Subject,
} from '../../types'

export const UNAPEC_ORIGIN = 'https://unapec.edu.do'
export const PROGRAMS_INDEX_URL = `${UNAPEC_ORIGIN}/academia/programas-de-grado/`

/**
 * The UNAPEC API stores subject names in a 30 character column, so longer
 * names come back cut off (e.g. "INFORMATICA APLICADA A LOS NEG").
 */
export const API_NAME_MAX_LENGTH = 30

export interface ApiRow {
	cuatrimestre: string
	codigo_asignatura: string
	asignatura: string
	creditos: string
	prerequisito: string
	asignatura_secuencia: string
}

// ─── Program discovery ───────────────────────────────────────────────────────

function decodeHtmlEntities(text: string): string {
	return text
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([\da-f]+);/gi, (_, n) =>
			String.fromCodePoint(Number.parseInt(n, 16)),
		)
		.replace(/&amp;/g, '&')
}

/** Extracts every program page URL linked from the "Programas de grado" index. */
export function extractProgramLinks(indexHtml: string): string[] {
	const links = new Set<string>()
	for (const match of indexHtml.matchAll(
		/href="((?:https:\/\/unapec\.edu\.do)?\/academia\/programas-de-grado\/[^"/]+\/)"/g,
	)) {
		const path = decodeHtmlEntities(match[1])
		links.add(new URL(encodeURI(decodeURI(path)), UNAPEC_ORIGIN).href)
	}
	return [...links]
}

/** Each program page embeds its code as `const codigoPesum = "ADMR11"`. */
export function extractPensumCode(html: string): string | null {
	const code = html.match(/codigoPesum\s*=\s*["']([^"']*)["']/)?.[1].trim()
	return code ? code.toUpperCase() : null
}

// ─── API rows ────────────────────────────────────────────────────────────────

export function parsePeriod(cuatrimestre: string): number {
	const match = cuatrimestre.match(/\d+$/)
	return match ? Number.parseInt(match[0], 10) : 0
}

export function parsePrereqs(prerequisito: string): string[] {
	if (!prerequisito.trim()) return []
	return prerequisito
		.split(/[,/]+/)
		.flatMap((s) => s.split(' - '))
		.map((s) => s.trim())
		.filter((s) => s.length > 0)
		.map((s) => {
			if (s.includes('%')) {
				const match = s.match(/(\d+)%/)
				return match ? `${match[1]}%` : s
			}
			return s.toUpperCase()
		})
}

/** Resolves the display name for a subject code; receives the raw API name. */
export type NameResolver = (code: string, apiName: string) => string

export function buildPeriods(
	rows: ApiRow[],
	resolveName: NameResolver = (_code, apiName) => apiName,
): { periods: Period[]; totalCredits: number } {
	const periodMap = new Map<number, Subject[]>()

	for (const row of rows) {
		const period = parsePeriod(row.cuatrimestre)
		if (period === 0) continue

		const code = row.codigo_asignatura.trim()
		const subject: Subject = {
			code,
			name: resolveName(code, row.asignatura.trim()),
			credits: Number(row.creditos),
			prerequisites: parsePrereqs(row.prerequisito),
		}

		const subjects = periodMap.get(period) ?? []
		if (!subjects.some((s) => s.code === subject.code)) {
			subjects.push(subject)
		}
		periodMap.set(period, subjects)
	}

	const periods: Period[] = Array.from(periodMap.entries())
		.sort(([a], [b]) => a - b)
		.map(([number, subjects]) => ({ number, subjects }))

	const totalCredits = periods
		.flatMap((p) => p.subjects)
		.reduce((sum, s) => sum + s.credits, 0)

	return { periods, totalCredits }
}

// ─── Subject names ───────────────────────────────────────────────────────────

/**
 * Indexes subject names from a previous snapshot so curated (complete) names
 * survive a sync. `byPensum` is exact; `global` picks the longest name seen for
 * a code across all pensums and is used for subjects shared between careers.
 */
export function buildNameIndex(pensums: Pensum[]) {
	const byPensum = new Map<string, Map<string, string>>()
	const global = new Map<string, string>()

	for (const pensum of pensums) {
		const names = new Map<string, string>()
		for (const period of pensum.periods) {
			for (const subject of period.subjects) {
				names.set(subject.code, subject.name)
				const current = global.get(subject.code)
				if (!current || subject.name.length > current.length) {
					global.set(subject.code, subject.name)
				}
			}
		}
		byPensum.set(pensum.pensumCode, names)
	}

	return { byPensum, global }
}

/**
 * Resolution order for a subject name:
 *  1. Manual override (`PENSUM/CODE`, then `CODE`) — see
 *     scripts/data/subject-name-overrides.ts
 *  2. Previous snapshot (same pensum, then any pensum). The live API now
 *     returns truncated, abbreviated and sometimes misspelled names, so names
 *     we already have win.
 *  3. The API name, reported through `onFallback` so likely truncations can be
 *     flagged for a manual override.
 */
export function createNameResolver(
	index: ReturnType<typeof buildNameIndex>,
	pensumCode: string,
	{
		overrides = {},
		onFallback,
	}: {
		overrides?: Record<string, string>
		onFallback?: (code: string, apiName: string) => void
	} = {},
): NameResolver {
	const own = index.byPensum.get(pensumCode)
	return (code, apiName) => {
		const override = overrides[`${pensumCode}/${code}`] ?? overrides[code]
		if (override) return override
		const known = own?.get(code) ?? index.global.get(code)
		if (known) return known
		onFallback?.(code, apiName)
		return apiName
	}
}

/** Heuristic: names that exactly fill the API's column may be cut off. */
export function isLikelyTruncated(name: string): boolean {
	return name.length === API_NAME_MAX_LENGTH
}

// ─── HTML: program name + electives ──────────────────────────────────────────

export function scrapeProgramName(html: string): string {
	const $ = cheerio.load(html)
	return $('h1').first().text().replace(/\s+/g, ' ').trim()
}

export function romanToInt(roman: string): number {
	const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100 }
	let total = 0
	let prev = 0
	for (const ch of roman.toUpperCase()) {
		const val = map[ch] ?? 0
		total += val > prev ? val - 2 * prev : val
		prev = val
	}
	return total
}

export function parseCaption(text: string): {
	name: string
	periods: number[]
} {
	const cleaned = text.replace(/\s+/g, ' ').trim()
	const quoted = cleaned.match(/["“]([^"”]+)["”]/)
	let name: string
	if (quoted) {
		name = quoted[1].trim()
	} else {
		name = cleaned.split(/\s*[(,]\s*cuatrimestre|\s*\(/i)[0].trim()
	}
	const periods: number[] = []
	const periodsBlock = cleaned.match(/cuatrimestres?\s*([IVXLC,\s\-y]+)/i)
	if (periodsBlock) {
		const tokens = periodsBlock[1].match(/[IVXLC]+/gi) ?? []
		for (const t of tokens) {
			const n = romanToInt(t)
			if (n > 0) periods.push(n)
		}
	}
	return { name, periods }
}

function parseElectivesTable(
	$: cheerio.CheerioAPI,
	table: AnyNode,
): ElectiveOption[] {
	const results: ElectiveOption[] = []
	let lastTier = ''

	$(table)
		.find('tr')
		.each((_i, tr) => {
			const cells = $(tr).find('td')
			if (cells.length < 4) return // header-only row

			let tier: string
			let code: string
			let name: string
			let credits: number
			let prerequisite: string

			if (cells.length >= 5) {
				// Full row: Electiva | Código | Asignatura | Crédito | Pre-requisito
				tier = $(cells[0]).text().trim()
				code = $(cells[1]).text().trim()
				name = $(cells[2]).text().trim()
				credits = Number.parseInt($(cells[3]).text().trim(), 10) || 0
				prerequisite = $(cells[4]).text().trim()
				if (tier) lastTier = tier
			} else {
				// Continuation row — tier cell uses rowspan
				tier = lastTier
				code = $(cells[0]).text().trim()
				name = $(cells[1]).text().trim()
				credits = Number.parseInt($(cells[2]).text().trim(), 10) || 0
				prerequisite = $(cells[3]).text().trim()
			}

			if (code && name) {
				results.push({ tier, code, name, credits, prerequisite })
			}
		})

	return results
}

export function scrapeElectives(html: string): {
	certifications: ElectiveSection
	electives: ElectiveSection
} {
	const $ = cheerio.load(html)

	type DescItem = { type: 'p' | 'li'; text: string }
	type SectionState = {
		intro: DescItem[]
		groups: ElectiveGroup[]
		seenFirstTable: boolean
		pending: DescItem[]
	}

	function makeSection(): SectionState {
		return { intro: [], groups: [], seenFirstTable: false, pending: [] }
	}

	type SectionKey = 'certifications' | 'electives' | null
	let sectionKey: SectionKey = null
	const sections: Record<'certifications' | 'electives', SectionState> = {
		certifications: makeSection(),
		electives: makeSection(),
	}

	$('h1,h2,h3,h4,h5,h6,p,ul,table').each((_i, el) => {
		const tag = el.type === 'tag' ? el.name.toLowerCase() : ''

		if (/^h[1-6]$/.test(tag)) {
			const text = $(el).text().trim()
			if (/certificaciones/i.test(text)) {
				sectionKey = 'certifications'
			} else if (/asignaturas\s+electivas/i.test(text)) {
				sectionKey = 'electives'
			} else if (/^h[1-3]$/.test(tag) && sectionKey !== null) {
				sectionKey = null
			}
			return
		}

		if (sectionKey === null) return
		const sec = sections[sectionKey]

		if (tag === 'p') {
			const text = $(el).text().trim()
			if (text) sec.pending.push({ type: 'p', text })
			return
		}

		if (tag === 'ul') {
			$(el)
				.find('li')
				.each((_, li) => {
					const text = $(li).text().trim()
					if (text) sec.pending.push({ type: 'li', text })
				})
			return
		}

		// tag === 'table'
		const firstTh = $(el).find('thead th, tr th').first().text().trim()
		if (!/electiva/i.test(firstTh)) return

		const options = parseElectivesTable($, el)
		if (options.length === 0) return

		if (!sec.seenFirstTable) {
			// Pending items before the first table are the section intro
			sec.intro = sec.pending
			sec.seenFirstTable = true
		} else {
			// Pending items after a previous table are that table's footnote
			sec.groups[sec.groups.length - 1].footnote = sec.pending
		}
		sec.pending = []

		const captionText = $(el).find('caption').text()
		const { name, periods } = parseCaption(captionText)
		sec.groups.push({ name, periods, footnote: [], options })
	})

	return {
		certifications: {
			intro: sections.certifications.intro,
			groups: sections.certifications.groups,
		},
		electives: {
			intro: sections.electives.intro,
			groups: sections.electives.groups,
		},
	}
}

function canonicalJson(value: unknown): string {
	return JSON.stringify(value, (_key, val) =>
		val && typeof val === 'object' && !Array.isArray(val)
			? Object.fromEntries(
					Object.entries(val).sort(([a], [b]) => a.localeCompare(b)),
				)
			: val,
	)
}

/** True when two snapshots of a pensum differ only by their `date`. */
export function isSamePensumContent(a: Pensum, b: Pensum): boolean {
	const { date: _a, ...restA } = a
	const { date: _b, ...restB } = b
	return canonicalJson(restA) === canonicalJson(restB)
}
