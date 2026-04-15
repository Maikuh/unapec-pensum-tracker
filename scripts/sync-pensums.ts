/**
 * sync-pensums.ts
 *
 * Regenerates lib/data/pensums.json from UNAPEC sources:
 *  1. Fetches structured subject data from the Azure API for each hardcoded pensumCode.
 *  2. Fetches each program's static HTML and uses cheerio to parse the
 *     "Certificaciones" and "Asignaturas Electivas" tables.
 *
 * All programs are fetched in parallel.
 *
 * Run: bun scripts/sync-pensums.ts
 */

import * as cheerio from 'cheerio'
import type { AnyNode } from 'domhandler'
import type { Cuatri, ElectiveOption, Pensum, Subject } from '../types/pensum'

const API_BASE = 'https://apiestudiante.azurewebsites.net/pensum'

// Hardcoded mapping: pensumCode → program page URL.
// Codes are stable; only update if UNAPEC adds a new program or retires one.
const PROGRAMS: Record<string, string> = {
	ADMR11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-administracion-de-empresas/',
	ATHR11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-administracion-turistica-y-hotelera/',
	CDG11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-comunicacion-digital/',
	CIN11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-cinematografia/',
	CONR11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-contabilidad/',
	CPM11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-comunicacion-y-periodismo-multiplataforma/',
	DER11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-derecho/',
	DIG11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-diseno-grafico/',
	DIN11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-diseno-de-interiores/',
	ECO11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-econom%C3%ADa-y-ciencia-de-datos/',
	EST11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-estadistica/',
	FINR11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-finanzas/',
	GAS11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-gastronom%C3%ADa-y-arte-culinario/',
	GOL11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-gesti%C3%B3n-de-operaciones-y-log%C3%ADstica/',
	IEL11: 'https://unapec.edu.do/academia/programas-de-grado/ingenieria-electronica/',
	IND11: 'https://unapec.edu.do/academia/programas-de-grado/ingenieria-industrial/',
	INE11: 'https://unapec.edu.do/academia/programas-de-grado/ingenieria-electrica/',
	ISC11: 'https://unapec.edu.do/academia/programas-de-grado/ingenieria-de-sistemas-de-computacion/',
	ISO11: 'https://unapec.edu.do/academia/programas-de-grado/ingenieria-de-software/',
	LEA11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-educacion-artistica/',
	LES11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-lengua-espanola-y-literatura-orientada-a-la-educacion-secundaria/',
	LFE11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-educaci%C3%B3n-lenguas-extranjeras-franc%C3%A9s/',
	LIE11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-educaci%C3%B3n-lenguas-extranjeras-ingl%C3%A9s/',
	LMS11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-matematica-orientada-a-la-educacion-secundaria/',
	MERR11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-mercadotecnia/',
	NINR11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-negocios-internacionales/',
	PSO11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-psicologia-organizacional/',
	PUB11: 'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-publicidad/',
	TSF11: 'https://unapec.edu.do/academia/programas-de-grado/tecnico-superior-en-finanzas/',
}

// ─── API types ────────────────────────────────────────────────────────────────

interface ApiRow {
	cuatrimestre: string
	codigo_asignatura: string
	asignatura: string
	creditos: string
	prerequisito: string
	asignatura_secuencia: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parsePeriod(cuatrimestre: string): number {
	const match = cuatrimestre.match(/\d+$/)
	return match ? Number.parseInt(match[0], 10) : 0
}

function parsePrereqs(prerequisito: string): string[] {
	if (!prerequisito.trim()) return []
	return prerequisito
		.split(/[,/\s]+/)
		.map((s) => s.trim().toUpperCase())
		.filter((s) => s.length > 0)
}

function buildCuatris(rows: ApiRow[]): { cuatris: Cuatri[]; totalCredits: number } {
	const periodMap = new Map<number, Subject[]>()

	for (const row of rows) {
		const period = parsePeriod(row.cuatrimestre)
		if (period === 0) continue

		const subject: Subject = {
			code: row.codigo_asignatura.trim(),
			name: row.asignatura.trim(),
			credits: Number(row.creditos),
			prerequisites: parsePrereqs(row.prerequisito),
		}

		const subjects = periodMap.get(period) ?? []
		if (!subjects.some((s) => s.code === subject.code)) {
			subjects.push(subject)
		}
		periodMap.set(period, subjects)
	}

	const cuatris: Cuatri[] = Array.from(periodMap.entries())
		.sort(([a], [b]) => a - b)
		.map(([period, subjects]) => ({ period, subjects }))

	const totalCredits = cuatris
		.flatMap((c) => c.subjects)
		.reduce((sum, s) => sum + s.credits, 0)

	return { cuatris, totalCredits }
}

function parseElectivesTable($: cheerio.CheerioAPI, table: AnyNode): ElectiveOption[] {
	const results: ElectiveOption[] = []
	let lastTier = ''

	$(table)
		.find('tbody tr, tr')
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

function scrapeProgramName(html: string): string {
	const $ = cheerio.load(html)
	const h1 = $('h1').first().text().trim()
	return h1 || ''
}

function scrapeElectives(html: string): { certifications: ElectiveOption[]; electives: ElectiveOption[] } {
	const $ = cheerio.load(html)
	const certifications: ElectiveOption[] = []
	const electives: ElectiveOption[] = []

	// Walk all headings and tables in document order, routing tables to the
	// appropriate bucket based on the last-seen section heading.
	type Section = 'certifications' | 'electives' | null
	let section: Section = null

	$('h1,h2,h3,h4,h5,h6,table').each((_i, el) => {
		const tag = el.type === 'tag' ? el.name.toLowerCase() : ''

		if (tag !== 'table') {
			const text = $(el).text().trim()
			if (/certificaciones/i.test(text)) {
				section = 'certifications'
			} else if (/asignaturas\s+electivas/i.test(text)) {
				section = 'electives'
			} else if (/^h[1-3]$/.test(tag) && section !== null) {
				section = null
			}
			return
		}

		if (section === null) return

		// Only tables whose first <th> says "Electiva" — distinguishes elective
		// tables from the main pensum table (first <th>: "Cuatrimestre" / "Código")
		const firstTh = $(el).find('thead th, tr th').first().text().trim()
		if (!/electiva/i.test(firstTh)) return

		const bucket = section === 'certifications' ? certifications : electives
		bucket.push(...parseElectivesTable($, el))
	})

	return { certifications, electives }
}

// ─── Per-program fetch ────────────────────────────────────────────────────────

async function fetchProgram(pensumCode: string, pageUrl: string): Promise<Pensum> {
	const [apiRes, htmlRes] = await Promise.all([
		fetch(`${API_BASE}/${pensumCode}`),
		fetch(pageUrl),
	])

	if (!apiRes.ok) throw new Error(`API ${apiRes.status} for ${pensumCode}`)
	if (!htmlRes.ok) throw new Error(`Page ${htmlRes.status} for ${pageUrl}`)

	const apiRows: ApiRow[] = await apiRes.json()
	if (apiRows.length === 0) throw new Error(`API returned no rows for ${pensumCode}`)

	const html = await htmlRes.text()

	const { cuatris, totalCredits } = buildCuatris(apiRows)
	const { certifications, electives } = scrapeElectives(html)

	// Prefer the full program name from the HTML <h1>; fall back to pensumCode.
	const carreerName = scrapeProgramName(html) || pensumCode

	return {
		carreerName,
		totalCredits,
		pensumCode,
		cuatris,
		date: new Date().toISOString(),
		certifications,
		electives,
	}
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
	const entries = Object.entries(PROGRAMS)

	console.log(`Fetching ${entries.length} programs in parallel…\n`)

	const pensums: Pensum[] = []
	const errors: { code: string; error: string }[] = []

	await Promise.all(
		entries.map(([code, url]) =>
			fetchProgram(code, url).then(
				(p) => {
					console.log(`  ✓ ${p.pensumCode} — ${p.cuatris.length} cuatris, ${p.certifications.length} certifications, ${p.electives.length} electives`)
					pensums.push(p)
				},
				(err) => {
					const msg = err instanceof Error ? err.message : String(err)
					console.error(`  ✗ ${code} — ${msg}`)
					errors.push({ code, error: msg })
				},
			),
		),
	)

	pensums.sort((a, b) => a.pensumCode.localeCompare(b.pensumCode))

	if (pensums.length === 0) {
		console.error('\nNo pensums collected — aborting write.')
		process.exit(1)
	}

	const pensumPagesTs = `// Maps pensumCode to the official UNAPEC pensum page URL
// Auto-generated by scripts/sync-pensums.ts — do not edit by hand
export const pensumPages: Record<string, string> = ${JSON.stringify(PROGRAMS, null, '\t')}
`

	await Bun.write(`${import.meta.dir}/../lib/data/pensums.json`, JSON.stringify(pensums, null, '\t'))
	await Bun.write(`${import.meta.dir}/../lib/data/pensum-pages.ts`, pensumPagesTs)

	console.log(`\n✓ Wrote ${pensums.length} pensums to lib/data/pensums.json`)
	console.log(`✓ Wrote ${Object.keys(PROGRAMS).length} entries to lib/data/pensum-pages.ts`)

	if (errors.length > 0) {
		console.error(`\n${errors.length} error(s) — see above`)
		process.exit(1)
	}
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
