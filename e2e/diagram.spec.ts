import { expect, test } from '@playwright/test'
import { selectCareer } from './helpers'

test.describe('Prerequisite diagram', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => localStorage.clear())
		await selectCareer(page, 'NINR11')
	})

	test('opens and renders the ReactFlow canvas', async ({ page }) => {
		await page.getByRole('button', { name: 'Ver diagrama' }).click()
		await expect(page.locator('.react-flow__renderer')).toBeVisible()
	})
})
