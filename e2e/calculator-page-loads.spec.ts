import { test, expect } from "@playwright/test"

// Issue #1: the skeleton serves the React page and the shared stylesheet.
test("the calculator page loads with the shared stylesheet", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle("SQLite API Calculator")
  await expect(page.getByRole("heading", { name: "Calculator" })).toBeVisible()

  // The shared stylesheet's colours and font reach the page.
  const styles = await page.evaluate(() => {
    const body = getComputedStyle(document.body)
    const root = getComputedStyle(document.documentElement)
    const variable = (name: string) => root.getPropertyValue(name).trim()
    return {
      background: body.backgroundColor,
      font: body.fontFamily,
      primary: variable("--color-primary"),
      primaryHover: variable("--color-primary-hover"),
      error: variable("--color-error"),
      success: variable("--color-success"),
      border: variable("--color-border"),
      muted: variable("--color-text-muted"),
      surface: variable("--color-surface"),
      text: variable("--color-text"),
    }
  })

  expect(styles.background).toBe("rgb(244, 246, 251)")
  expect(styles.font).toContain("Inter")
  expect(styles.primary).toBe("#2563eb")
  expect(styles.primaryHover).toBe("#1d4ed8")
  expect(styles.error).toBe("#dc2626")
  expect(styles.success).toBe("#16a34a")
  expect(styles.border).toBe("#e5e7eb")
  expect(styles.muted).toBe("#6b7280")
  expect(styles.surface).toBe("#ffffff")
  expect(styles.text).toBe("#1f2937")
})
