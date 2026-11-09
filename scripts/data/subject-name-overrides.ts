/**
 * Manual subject name corrections applied by scripts/sync-pensums.ts, taking
 * priority over both the previous snapshot and the UNAPEC API.
 *
 * Why: the API stores names in a 30 character column, so some come back cut
 * off (e.g. "ANALISIS OCUPACIONAL Y DE PUES") and there's no other structured
 * source for the full name. When the sync warns about a likely truncated name,
 * look up the official pensum PDF ("Descargar Pénsum" on the program page) and
 * add the full name here.
 *
 * Keys: `CODE` applies to every pensum, `PENSUM/CODE` to a single pensum (wins
 * over `CODE`). Values follow the dataset style: uppercase, no accents except Ñ.
 */
export const SUBJECT_NAME_OVERRIDES: Record<string, string> = {
	// Verified against the official pensum PDFs
	ADM905: 'ANALISIS OCUPACIONAL Y DE PUESTOS',
	EST615: 'SOFTWARE ANALISIS ESTADISTICO I',
	EST915: 'SOFTWARE ANALISIS ESTADISTICO II',
	'PSO11/PAS110': 'PASANTIA EMPRESARIAL DE PSICOLOGIA ORGANIZACIONAL',
	TUR110: 'GEOGRAFIA TURISTICA DE REPUBLICA DOMINICANA',
}
