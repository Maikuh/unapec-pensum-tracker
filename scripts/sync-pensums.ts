/**
 * sync-pensums.ts
 *
 * Regenerates lib/data/pensums.json and lib/data/pensum-pages.ts from UNAPEC:
 *  1. Discovers every program from the "Programas de grado" index page and reads
 *     each program's pensum code from its page (`const codigoPesum = "..."`).
 *  2. Fetches structured subject data from the Azure API for each pensum code.
 *  3. Parses the "Certificaciones" and "Asignaturas Electivas" tables from the
 *     program page HTML.
 *
 * Merge rules with the previous snapshot (lib/data/pensums.json):
 *  - Subject names from the previous snapshot win over the API's, which are
 *    now truncated to 30 chars and often abbreviated/misspelled. Pass
 *    `--refresh-names` to take the API names as-is.
 *  - Pensums no longer listed by UNAPEC are kept unchanged and flagged
 *    `legacy: true`, so students tracking them keep their progress.
 *  - A pensum's `date` only changes when its content changes.
 *
 * Run: bun scripts/sync-pensums.ts [--refresh-names]
 */

import type { Pensum } from '../types'
import { SUBJECT_NAME_OVERRIDES } from './data/subject-name-overrides'
import {
	type ApiRow,
	buildNameIndex,
	buildPeriods,
	createNameResolver,
	extractPensumCode,
	extractProgramLinks,
	isLikelyTruncated,
	isSamePensumContent,
	PROGRAMS_INDEX_URL,
	scrapeElectives,
	scrapeProgramName,
} from './lib/pensum-parsers'

const API_BASE = 'https://apiestudiante.azurewebsites.net/pensum'
const ROOT = `${import.meta.dir}/..`
const PENSUMS_PATH = `${ROOT}/lib/data/pensums.json`
const PENSUM_PAGES_PATH = `${ROOT}/lib/data/pensum-pages.ts`
const REFRESH_NAMES = process.argv.includes('--refresh-names')

async function fetchText(url: string): Promise<string> {
	const res = await fetch(url)
	if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
	return res.text()
}

async function loadPreviousSnapshot(): Promise<{
	pensums: Pensum[]
	pages: Record<string, string>
}> {
	const file = Bun.file(PENSUMS_PATH)
	const pensums: Pensum[] = (await file.exists()) ? await file.json() : []
	let pages: Record<string, string> = {}
	try {
		pages = (await import(PENSUM_PAGES_PATH)).pensumPages
	} catch {
		// First run — no previous pages map
	}
	return { pensums, pages }
}

interface DiscoveredProgram {
	pensumCode: string
	pageUrl: string
	html: string
}

async function discoverPrograms(): Promise<{
	programs: DiscoveredProgram[]
	skipped: string[]
}> {
	const links = extractProgramLinks(await fetchText(PROGRAMS_INDEX_URL))
	if (links.length === 0) {
		throw new Error(`No program links found on ${PROGRAMS_INDEX_URL}`)
	}

	const skipped: string[] = []
	const byCode = new Map<string, DiscoveredProgram>()
	await Promise.all(
		links.map(async (pageUrl) => {
			const html = await fetchText(pageUrl)
			const pensumCode = extractPensumCode(html)
			if (!pensumCode) {
				skipped.push(pageUrl)
				return
			}
			byCode.set(pensumCode, { pensumCode, pageUrl, html })
		}),
	)

	return { programs: [...byCode.values()], skipped }
}

async function fetchProgram(
	{ pensumCode, html }: DiscoveredProgram,
	nameIndex: ReturnType<typeof buildNameIndex>,
	truncatedNames: string[],
): Promise<Pensum> {
	const apiRes = await fetch(`${API_BASE}/${pensumCode}`)
	if (!apiRes.ok) throw new Error(`API ${apiRes.status} for ${pensumCode}`)

	const apiRows: ApiRow[] = await apiRes.json()
	if (apiRows.length === 0) {
		throw new Error(`API returned no rows for ${pensumCode}`)
	}

	const resolveName = createNameResolver(
		// --refresh-names: ignore the previous snapshot, keep manual overrides
		REFRESH_NAMES ? buildNameIndex([]) : nameIndex,
		pensumCode,
		{
			overrides: SUBJECT_NAME_OVERRIDES,
			onFallback: (code, apiName) => {
				if (isLikelyTruncated(apiName)) {
					truncatedNames.push(`${pensumCode}/${code}: ${apiName}`)
				}
			},
		},
	)
	const { periods, totalCredits } = buildPeriods(apiRows, resolveName)
	const { certifications, electives } = scrapeElectives(html)

	return {
		carreerName: scrapeProgramName(html) || pensumCode,
		totalCredits,
		pensumCode,
		periods,
		date: new Date().toISOString(),
		certifications,
		electives,
	}
}

async function main() {
	const previous = await loadPreviousSnapshot()
	const previousByCode = new Map(previous.pensums.map((p) => [p.pensumCode, p]))
	const nameIndex = buildNameIndex(previous.pensums)

	console.log('Discovering programs…')
	const { programs, skipped } = await discoverPrograms()
	console.log(`Found ${programs.length} programs with a pensum code.`)
	for (const url of skipped) console.warn(`  ! No pensum code yet: ${url}`)
	console.log()

	const pensums: Pensum[] = []
	const pages: Record<string, string> = {}
	const errors: { code: string; error: string }[] = []
	const truncatedNames: string[] = []

	await Promise.all(
		programs.map(async (program) => {
			const { pensumCode } = program
			try {
				const fresh = await fetchProgram(program, nameIndex, truncatedNames)
				const prev = previousByCode.get(pensumCode)
				const unchanged = prev && isSamePensumContent(prev, fresh)
				pensums.push(unchanged ? prev : fresh)
				pages[pensumCode] = program.pageUrl
				const status = !prev ? 'new' : unchanged ? 'unchanged' : 'updated'
				console.log(
					`  ✓ ${pensumCode} (${status}) — ${fresh.periods.length} periods, ${fresh.certifications.groups.length} certifications, ${fresh.electives.groups.length} electives`,
				)
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err)
				console.error(`  ✗ ${pensumCode} — ${msg}`)
				errors.push({ code: pensumCode, error: msg })
				// Keep the previous snapshot rather than dropping the pensum
				const prev = previousByCode.get(pensumCode)
				if (prev) {
					pensums.push(prev)
					pages[pensumCode] = program.pageUrl
				}
			}
		}),
	)

	// Pensums UNAPEC no longer lists: keep them so existing progress isn't lost
	const listed = new Set(programs.map((p) => p.pensumCode))
	for (const prev of previous.pensums) {
		if (listed.has(prev.pensumCode)) continue
		console.log(`  ~ ${prev.pensumCode} (legacy) — no longer listed, kept`)
		pensums.push({ ...prev, legacy: true })
		const page = previous.pages[prev.pensumCode]
		if (page) pages[prev.pensumCode] = page
	}

	if (pensums.length === 0) {
		console.error('\nNo pensums collected — aborting write.')
		process.exit(1)
	}

	pensums.sort((a, b) => a.pensumCode.localeCompare(b.pensumCode))
	const pageEntries = Object.entries(pages).sort(([a], [b]) =>
		a.localeCompare(b),
	)

	const pensumPagesTs = `// Maps pensumCode to the official UNAPEC pensum page URL
// Auto-generated by scripts/sync-pensums.ts — do not edit by hand
export const pensumPages: Record<string, string> = {
${pageEntries.map(([k, v]) => `\t${k}: '${v}',`).join('\n')}
}
`

	await Bun.write(PENSUMS_PATH, JSON.stringify(pensums))
	await Bun.write(PENSUM_PAGES_PATH, pensumPagesTs)
	Bun.spawnSync(['bun', 'lint:fix', PENSUM_PAGES_PATH], { cwd: ROOT })

	console.log(`\n✓ Wrote ${pensums.length} pensums to lib/data/pensums.json`)
	console.log(
		`✓ Wrote ${pageEntries.length} entries to lib/data/pensum-pages.ts`,
	)

	if (truncatedNames.length > 0) {
		console.warn(
			`\n! ${truncatedNames.length} new subject name(s) fill the API's 30 char limit and may be truncated.\n  Check the official pensum PDF and add full names to scripts/data/subject-name-overrides.ts:`,
		)
		for (const line of truncatedNames.sort()) console.warn(`    ${line}`)
	}

	if (errors.length > 0) {
		console.error(`\n${errors.length} error(s) — see above`)
		process.exit(1)
	}
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
