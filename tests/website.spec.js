import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('https://**', (route) => route.abort())
  await page.route('**/api/content', (route) => route.abort('connectionrefused'))
})

test('filters dishes by ingredient and category', async ({ page }) => {
  await page.goto('/menu')

  const search = page.getByRole('searchbox', { name: 'Search the menu' })
  const tagine = page.getByRole('heading', { name: 'Chicken Tagine with Preserved Lemons' })
  const harira = page.getByRole('heading', { name: 'Harira Soup' })
  await expect(harira).toBeVisible()

  await search.fill('  sAfFrOn  ')
  await expect(tagine).toBeVisible()
  await expect(harira).toHaveCount(0)

  await page.getByRole('tab', { name: 'Starters' }).click()
  await expect(page.getByText('No dishes match', { exact: false })).toBeVisible()
  await expect(tagine).toHaveCount(0)

  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(harira).toBeVisible()
  await expect(tagine).toHaveCount(0)
})

test('keeps manager edits after a reload when the CMS API is offline', async ({ page }) => {
  await page.goto('/admin')

  await page.getByLabel('Username').fill('admin')
  await page.getByLabel('Password', { exact: true }).fill('admin')
  await page.getByRole('button', { name: 'Sign in' }).click()

  const name = page.getByRole('textbox', { name: 'Restaurant Name' })
  await expect(name).toHaveValue('RestauHub')
  await name.fill('Sample Kitchen')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Offline — saved locally only')).toBeVisible()

  await page.reload()
  await expect(name).toHaveValue('Sample Kitchen')
  await page.goto('/menu')
  await expect(page.getByRole('heading', { name: 'A meal at Sample Kitchen' })).toBeVisible()
})
