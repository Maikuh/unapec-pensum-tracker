import { describe, expect, it } from 'vitest'
import type { Pensum } from '../../types'
import {
	type ApiRow,
	buildNameIndex,
	buildPeriods,
	createNameResolver,
	extractPensumCode,
	extractProgramLinks,
	isLikelyTruncated,
	isSamePensumContent,
	parseCaption,
	parsePeriod,
	parsePrereqs,
	scrapeElectives,
	scrapeProgramName,
} from './pensum-parsers'

const row = (overrides: Partial<ApiRow>): ApiRow => ({
	cuatrimestre: 'ADMR CUATRIMESTRE 1',
	codigo_asignatura: 'MAT010',
	asignatura: 'MATEMATICA BASICA UNIVERSITARI',
	creditos: '3',
	prerequisito: '',
	asignatura_secuencia: '1',
	...overrides,
})

const pensum = (overrides: Partial<Pensum> = {}): Pensum => ({
	carreerName: 'Licenciatura en Pruebas',
	totalCredits: 3,
	pensumCode: 'TST11',
	periods: [
		{
			number: 1,
			subjects: [
				{
					code: 'MAT010',
					name: 'MATEMATICA BASICA UNIVERSITARIA',
					credits: 3,
					prerequisites: [],
				},
			],
		},
	],
	date: '2024-01-01T00:00:00.000Z',
	certifications: { intro: [], groups: [] },
	electives: { intro: [], groups: [] },
	...overrides,
})

describe('extractProgramLinks', () => {
	it('returns unique absolute, percent-encoded program URLs', () => {
		const html = `
			<a href="/academia/programas-de-grado/ingenieria-de-software/">ISO</a>
			<a href="/academia/programas-de-grado/ingenieria-de-software/">ISO again</a>
			<a href="/academia/programas-de-grado/licenciatura-en-econom&#237;a-y-ciencia-de-datos/">ECO</a>
			<a href="https://unapec.edu.do/academia/programas-de-grado/">index</a>
			<a href="/academia/otra-cosa/">other</a>`
		expect(extractProgramLinks(html)).toEqual([
			'https://unapec.edu.do/academia/programas-de-grado/ingenieria-de-software/',
			'https://unapec.edu.do/academia/programas-de-grado/licenciatura-en-econom%C3%ADa-y-ciencia-de-datos/',
		])
	})
})

describe('extractPensumCode', () => {
	it('reads and normalizes the embedded pensum code', () => {
		expect(
			extractPensumCode('<script>const codigoPesum = " tsm12 "</script>'),
		).toBe('TSM12')
	})

	it('returns null when the page has no code', () => {
		expect(extractPensumCode('<script>const codigoPesum = ""</script>')).toBe(
			null,
		)
		expect(extractPensumCode('<p>nada</p>')).toBe(null)
	})
})

describe('parsePrereqs', () => {
	it('splits codes and normalizes percentage requirements', () => {
		expect(parsePrereqs('mat010, ESP101 / 50% de los créditos')).toEqual([
			'MAT010',
			'ESP101',
			'50%',
		])
		expect(parsePrereqs('  ')).toEqual([])
	})
})

describe('buildPeriods', () => {
	it('groups by period, dedupes codes and sums credits', () => {
		const { periods, totalCredits } = buildPeriods([
			row({ cuatrimestre: 'X CUATRIMESTRE 2', codigo_asignatura: 'B' }),
			row({ codigo_asignatura: 'A' }),
			row({ codigo_asignatura: 'A' }),
		])
		expect(periods.map((p) => p.number)).toEqual([1, 2])
		expect(periods[0].subjects).toHaveLength(1)
		expect(totalCredits).toBe(6)
	})

	it('uses the name resolver for subject names', () => {
		const { periods } = buildPeriods([row({})], (code) => `NAME ${code}`)
		expect(periods[0].subjects[0].name).toBe('NAME MAT010')
	})
})

describe('createNameResolver', () => {
	const index = buildNameIndex([
		pensum(),
		pensum({
			pensumCode: 'OTR11',
			periods: [
				{
					number: 1,
					subjects: [
						{ code: 'ESP101', name: 'ANALISIS', credits: 3, prerequisites: [] },
					],
				},
			],
		}),
	])

	it('prefers the previous name for the same pensum', () => {
		const resolve = createNameResolver(index, 'TST11')
		expect(resolve('MAT010', 'MATEMATICA BASICA UNIVERSITARI')).toBe(
			'MATEMATICA BASICA UNIVERSITARIA',
		)
	})

	it('falls back to names from other pensums, then the API name', () => {
		const fallbacks: string[] = []
		const resolve = createNameResolver(index, 'NEW12', {
			onFallback: (code) => fallbacks.push(code),
		})
		expect(resolve('ESP101', 'ANALISIS DE TEXTOS')).toBe('ANALISIS')
		expect(resolve('NEW001', 'NUEVA MATERIA')).toBe('NUEVA MATERIA')
		expect(fallbacks).toEqual(['NEW001'])
	})
})

describe('createNameResolver overrides', () => {
	const index = buildNameIndex([pensum()])
	const overrides = {
		MAT010: 'GLOBAL OVERRIDE',
		'TST11/MAT010': 'PENSUM OVERRIDE',
		ESP101: 'ESPAÑOL',
	}

	it('prefers a pensum-scoped override, then a global one', () => {
		expect(
			createNameResolver(index, 'TST11', { overrides })('MAT010', 'X'),
		).toBe('PENSUM OVERRIDE')
		expect(
			createNameResolver(index, 'OTR11', { overrides })('MAT010', 'X'),
		).toBe('GLOBAL OVERRIDE')
	})

	it('applies overrides even for codes never seen before', () => {
		const fallbacks: string[] = []
		const resolve = createNameResolver(index, 'NEW12', {
			overrides,
			onFallback: (code) => fallbacks.push(code),
		})
		expect(resolve('ESP101', 'ESPANOL CORTAD')).toBe('ESPAÑOL')
		expect(fallbacks).toEqual([])
	})
})

describe('isLikelyTruncated', () => {
	it('flags names that exactly fill the 30 char API column', () => {
		expect(isLikelyTruncated('ANALISIS OCUPACIONAL Y DE PUES')).toBe(true)
		expect(isLikelyTruncated('ANALISIS OCUPACIONAL')).toBe(false)
		expect(isLikelyTruncated('ANALISIS OCUPACIONAL Y DE PUESTOS')).toBe(false)
	})
})

describe('parseCaption', () => {
	it('extracts quoted names and roman numeral periods', () => {
		expect(
			parseCaption(
				'"DESARROLLO EN EMPRENDIMIENTO", cuatrimestre VII, VIII y IX',
			),
		).toEqual({ name: 'DESARROLLO EN EMPRENDIMIENTO', periods: [7, 8, 9] })
	})
})

describe('scrapeProgramName', () => {
	it('returns the first h1 with collapsed whitespace', () => {
		expect(scrapeProgramName('<h1>  Ingeniería\n de Software </h1>')).toBe(
			'Ingeniería de Software',
		)
	})
})

describe('scrapeElectives', () => {
	it('parses certification tables, intro text and rowspan continuation rows', () => {
		const html = `
			<h3>Certificaciones</h3>
			<p>Elige una certificación.</p>
			<table>
				<caption>"DATOS", cuatrimestre VII y VIII</caption>
				<thead><tr><th>Electiva</th><th>Código</th><th>Asignatura</th><th>Crédito</th><th>Pre-requisito</th></tr></thead>
				<tbody>
					<tr><td rowspan="2">E1</td><td>DAT101</td><td>Datos I</td><td>3</td><td>50% de los créditos</td></tr>
					<tr><td>DAT102</td><td>Datos II</td><td>3</td><td>DAT101</td></tr>
				</tbody>
			</table>
			<p>Nota al pie.</p>
			<h2>Otra sección</h2>`
		const { certifications, electives } = scrapeElectives(html)
		expect(electives.groups).toEqual([])
		expect(certifications.intro).toEqual([
			{ type: 'p', text: 'Elige una certificación.' },
		])
		expect(certifications.groups).toHaveLength(1)
		expect(certifications.groups[0]).toMatchObject({
			name: 'DATOS',
			periods: [7, 8],
			options: [
				{ tier: 'E1', code: 'DAT101', credits: 3 },
				{ tier: 'E1', code: 'DAT102', prerequisite: 'DAT101' },
			],
		})
	})
})

describe('isSamePensumContent', () => {
	it('ignores the date and key order', () => {
		const a = pensum()
		const { carreerName, ...rest } = pensum({ date: '2026-01-01' })
		expect(isSamePensumContent(a, { ...rest, carreerName })).toBe(true)
	})

	it('detects content changes', () => {
		expect(isSamePensumContent(pensum(), pensum({ totalCredits: 4 }))).toBe(
			false,
		)
	})
})

describe('edge cases', () => {
	it('extractProgramLinks treats absolute and relative links as the same page', () => {
		const html = `
			<a href="https://unapec.edu.do/academia/programas-de-grado/derecho/">a</a>
			<a href="/academia/programas-de-grado/derecho/">b</a>`
		expect(extractProgramLinks(html)).toEqual([
			'https://unapec.edu.do/academia/programas-de-grado/derecho/',
		])
	})

	it('extractProgramLinks returns nothing for an unexpected page', () => {
		expect(
			extractProgramLinks('<html><body>Mantenimiento</body></html>'),
		).toEqual([])
	})

	it('extractPensumCode accepts single quotes', () => {
		expect(extractPensumCode("const codigoPesum = 'isc11'")).toBe('ISC11')
	})

	it('parsePeriod handles two-digit periods and missing numbers', () => {
		expect(parsePeriod('ISO CUATRIMESTRE 12')).toBe(12)
		expect(parsePeriod('ELECTIVAS')).toBe(0)
	})

	it('buildPeriods skips rows without a period and trims codes', () => {
		const { periods } = buildPeriods([
			row({ cuatrimestre: 'ELECTIVAS', codigo_asignatura: 'E01' }),
			row({ codigo_asignatura: ' MAT010 ' }),
		])
		expect(periods).toHaveLength(1)
		expect(periods[0].subjects.map((s) => s.code)).toEqual(['MAT010'])
	})

	it('buildPeriods parses credits and prerequisites', () => {
		const { periods } = buildPeriods([
			row({ creditos: '5', prerequisito: 'mat010 - esp101' }),
		])
		expect(periods[0].subjects[0]).toMatchObject({
			credits: 5,
			prerequisites: ['MAT010', 'ESP101'],
		})
	})

	it('parsePrereqs keeps unparseable percentage text as-is', () => {
		expect(parsePrereqs('% de créditos')).toEqual(['% de créditos'])
	})

	it('parseCaption handles unquoted captions and missing periods', () => {
		expect(parseCaption('Electivas Generales (cuatrimestre X)')).toEqual({
			name: 'Electivas Generales',
			periods: [10],
		})
		expect(parseCaption('Sin cuatrimestres')).toMatchObject({ periods: [] })
	})

	it('scrapeElectives ignores tables outside the sections or without an "Electiva" header', () => {
		const table = (header: string) => `
			<table>
				<thead><tr><th>${header}</th><th>Código</th><th>Asignatura</th><th>Crédito</th><th>Pre</th></tr></thead>
				<tbody><tr><td>E1</td><td>X1</td><td>Equis</td><td>3</td><td></td></tr></tbody>
			</table>`
		const html = `
			${table('Electiva')}
			<h3>Asignaturas Electivas</h3>
			${table('Horario')}
			${table('Electiva')}`
		const { electives, certifications } = scrapeElectives(html)
		expect(certifications.groups).toEqual([])
		expect(electives.groups).toHaveLength(1)
		expect(electives.groups[0].options[0]).toMatchObject({ code: 'X1' })
	})

	it('scrapeElectives attaches text between tables as the previous table footnote', () => {
		const table = (code: string) => `
			<table><caption>"${code}"</caption>
				<tr><th>Electiva</th></tr>
				<tr><td>E</td><td>${code}</td><td>N</td><td>3</td><td></td></tr>
			</table>`
		const html = `<h3>Asignaturas Electivas</h3>${table('A1')}<ul><li>Nota A</li></ul>${table('B1')}`
		const { electives } = scrapeElectives(html)
		expect(electives.groups.map((g) => g.footnote)).toEqual([
			[{ type: 'li', text: 'Nota A' }],
			[],
		])
	})
})
