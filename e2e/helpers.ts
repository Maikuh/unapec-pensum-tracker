import type { Page } from '@playwright/test'

export async function selectCareer(page: Page, pensumCode = 'NINR11') {
	await page.goto(`/pensums/${pensumCode}`)
	await page.getByText('Informacion', { exact: true }).waitFor()
}

export async function selectCareerFromHome(
	page: Page,
	searchText = 'negocios',
) {
	await page.goto('/')
	await page.getByTestId('career-search-trigger').waitFor({ state: 'visible' })
	await page.getByTestId('career-search-trigger').click()
	await page.getByTestId('career-search-input').fill(searchText)
	await page.getByTestId('career-search-option').first().click()
	await page.waitForURL(/\/pensums\//)
	await page.getByText('Informacion', { exact: true }).waitFor()
}

/**
 * Returns the table row for a subject identified by its unique code column.
 * Uses .font-mono to target only code cells, not prerequisite badges.
 */
export function getSubjectRow(page: Page, code: string) {
	return page.locator('tr').filter({
		has: page.locator('.font-mono', { hasText: code }),
	})
}
