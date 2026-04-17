import { expect, test } from '@playwright/test'
import { selectCareer, selectCareerFromHome } from './helpers'

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => localStorage.clear())
})

test.describe('Career select input related tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
	})

	test('Career search trigger is visible on home page', async ({ page }) => {
		await expect(page.getByTestId('career-search-trigger')).toBeVisible()
	})

	test('User can select a career and navigate to its page', async ({
		page,
	}) => {
		await selectCareerFromHome(page, 'negocios')
		await expect(page).toHaveURL(/\/pensums\/NINR11/)
	})

	test('User can navigate back to home from a pensum page', async ({
		page,
	}) => {
		await selectCareer(page)
		await page.getByRole('link', { name: 'UNAPEC Pensum Tracker' }).click()
		await expect(page.getByTestId('career-search-trigger')).toBeVisible()
	})
})
