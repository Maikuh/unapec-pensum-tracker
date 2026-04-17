import { expect, test } from '@playwright/test'
import { getSubjectRow, selectCareer } from './helpers'

// Uses NINR11 (Negocios Internacionales) pensum.
// Period 1 has all no-prerequisite subjects.
// Period 2 has MAT121 (requires MAT010), ESP106 (requires ESP101), etc.
// Chain for cascade test: MAT010 -> MAT121 -> MAT131

test.describe('Subject related tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => localStorage.clear())
		await selectCareer(page, 'NINR11')
	})

	test('Select a single subject (MAT010 enables MAT121)', async ({ page }) => {
		await expect(getSubjectRow(page, 'MAT121')).toHaveAttribute(
			'data-disabled',
			'true',
		)
		await getSubjectRow(page, 'MAT010').click()
		await expect(getSubjectRow(page, 'MAT010')).toHaveAttribute(
			'data-selected',
			'true',
		)
		await expect(getSubjectRow(page, 'MAT121')).toHaveAttribute(
			'data-disabled',
			'false',
		)
	})

	test('Deselect a single subject', async ({ page }) => {
		await getSubjectRow(page, 'MAT010').click()
		await expect(getSubjectRow(page, 'MAT010')).toHaveAttribute(
			'data-selected',
			'true',
		)
		await getSubjectRow(page, 'MAT010').click()
		await expect(getSubjectRow(page, 'MAT010')).toHaveAttribute(
			'data-selected',
			'false',
		)
	})

	test('Select multiple subjects at once (select all checkbox)', async ({
		page,
	}) => {
		await page.getByTestId('select-all-checkbox').first().click()
		const cuatri1Rows = page
			.locator('.rounded-md')
			.filter({ hasText: 'Cuatrimestre 1' })
			.locator('tbody tr')
		await expect(cuatri1Rows.first()).toHaveAttribute('data-selected', 'true')
	})

	test('Deselecting a subject cascade-deselects its dependents', async ({
		page,
	}) => {
		await getSubjectRow(page, 'MAT010').click()
		await getSubjectRow(page, 'MAT121').click()
		await getSubjectRow(page, 'MAT131').click()
		await getSubjectRow(page, 'MAT010').click()
		await expect(getSubjectRow(page, 'MAT121')).toHaveAttribute(
			'data-disabled',
			'true',
		)
		await expect(getSubjectRow(page, 'MAT131')).toHaveAttribute(
			'data-disabled',
			'true',
		)
	})

	test('Select a subject by clicking the checkbox directly', async ({
		page,
	}) => {
		await getSubjectRow(page, 'MAT010').getByRole('checkbox').first().click()
		await expect(getSubjectRow(page, 'MAT010')).toHaveAttribute(
			'data-selected',
			'true',
		)
	})

	test('Select a subject by clicking elsewhere on the row (not the checkbox)', async ({
		page,
	}) => {
		await getSubjectRow(page, 'MAT010').locator('.font-mono').click()
		await expect(getSubjectRow(page, 'MAT010')).toHaveAttribute(
			'data-selected',
			'true',
		)
	})

	test('Clicking a disabled subject shows prerequisite alert dialog', async ({
		page,
	}) => {
		await getSubjectRow(page, 'MAT121').click()
		await expect(page.getByRole('alertdialog')).toBeVisible()
	})

	test('Shows correct credit count after selecting subjects', async ({
		page,
	}) => {
		await page.getByTestId('select-all-checkbox').first().click()
		const rows = page
			.locator('.rounded-md')
			.filter({ hasText: 'Cuatrimestre 1' })
			.locator("tbody tr[data-selected='true']")
		const count = await rows.count()
		let sumOfCredits = 0
		for (let i = 0; i < count; i++) {
			const creditText = await rows
				.nth(i)
				.locator('td:nth-child(4)')
				.textContent()
			sumOfCredits += Number(creditText?.trim())
		}
		await expect(page.getByTestId('credits-count')).toContainText(
			String(sumOfCredits),
		)
	})

	test('Shows correct subject count after selecting subjects', async ({
		page,
	}) => {
		await page.getByTestId('select-all-checkbox').first().click()
		const countText = await page.getByTestId('subjects-count').textContent()
		const count = Number(countText?.trim())
		const selectedRows = page.locator("tbody tr[data-selected='true']")
		await expect(selectedRows).toHaveCount(count)
	})
})
