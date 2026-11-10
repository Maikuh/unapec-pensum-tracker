import { expect, test } from '@playwright/test'
import { getSubjectRow, selectCareer } from './helpers'

async function clearStorage(page: import('@playwright/test').Page) {
	await page.evaluate(() => localStorage.clear())
	await page.reload()
	await page.getByText('Información', { exact: true }).waitFor()
}

test.describe('Progress tools', () => {
	test.beforeEach(async ({ page }) => {
		await selectCareer(page, 'NINR11')
		await clearStorage(page)
	})

	test('Available subjects list follows the selection', async ({ page }) => {
		await getSubjectRow(page, 'MAT010').click()
		await page.getByRole('button', { name: 'Ver lista' }).click()

		const list = page.getByRole('dialog', { name: 'Materias disponibles' })
		await expect(list.getByTestId('available-subject')).not.toHaveCount(0)
		await expect(
			list.getByTestId('available-subject').filter({ hasText: 'MAT121' }),
		).toHaveCount(1)
		await expect(
			list.getByTestId('available-subject').filter({ hasText: 'MAT010' }),
		).toHaveCount(0)
	})

	test('Reset clears the selection and persists after reload', async ({
		page,
	}) => {
		await getSubjectRow(page, 'MAT010').click()
		await expect(page.getByTestId('subjects-count')).toHaveText('1')

		await page.getByRole('button', { name: 'Reiniciar progreso' }).click()
		await page.getByRole('button', { name: 'Reiniciar', exact: true }).click()
		await expect(page.getByTestId('subjects-count')).toHaveText('0')

		await page.reload()
		await page.getByText('Información', { exact: true }).waitFor()
		await expect(page.getByTestId('subjects-count')).toHaveText('0')
		await expect(getSubjectRow(page, 'MAT010')).toHaveAttribute(
			'data-selected',
			'false',
		)
	})

	test('Stale saved data is refreshed against the current pensum', async ({
		page,
	}) => {
		await page.evaluate(() =>
			localStorage.setItem(
				'selectedSubjects',
				JSON.stringify({
					state: {
						selectedSubjects: {
							NINR11: [
								{ code: 'MAT010', name: 'OLD', credits: 99, prerequisites: [] },
								{ code: 'GONE01', name: 'X', credits: 9, prerequisites: [] },
							],
						},
					},
					version: 0,
				}),
			),
		)
		await page.reload()
		await expect(page.getByTestId('subjects-count')).toHaveText('1')
		await expect(page.getByTestId('credits-count')).toHaveText('3')
	})
})

test.describe('Pensum data quirks', () => {
	test('Prerequisites outside the pensum do not block selection', async ({
		page,
	}) => {
		await selectCareer(page, 'CPM11')
		await clearStorage(page)
		const row = getSubjectRow(page, 'IDI530')
		await expect(row).toHaveAttribute('data-disabled', 'false')
		await expect(row.getByText('ENG008')).toBeVisible()
		await row.click()
		await expect(row).toHaveAttribute('data-selected', 'true')
	})

	test('Legacy pensums show a notice and are tagged in the search', async ({
		page,
	}) => {
		await selectCareer(page, 'LEA11')
		await expect(page.getByTestId('legacy-notice')).toBeVisible()

		await page.getByTestId('career-search-trigger').click()
		await page.getByTestId('career-search-input').fill('artística')
		const options = page.getByTestId('career-search-option')
		await expect(options.filter({ hasText: 'LEA11' })).toContainText('Anterior')
		await expect(options.filter({ hasText: 'LEA12' })).not.toContainText(
			'Anterior',
		)
	})
})
