import { test, expect } from "@playwright/test"

// Issue #3: the calculator screen does the four operations and shows the result.
// Each calculation is saved by the API, so these journeys change data and are
// never @smoke.
test("the calculator shows the result of the four operations", async ({ page }) => {
  await page.goto("/")

  const display = page.getByTestId("calculator-display")

  // 2 + 3 = 5
  await page.getByRole("button", { name: "2", exact: true }).click()
  await page.getByRole("button", { name: "Operator +" }).click()
  await page.getByRole("button", { name: "3", exact: true }).click()
  await page.getByRole("button", { name: "Equals" }).click()
  await expect(display).toHaveText("5")

  // 7 × 8 = 56
  await page.getByRole("button", { name: "Clear" }).click()
  await page.getByRole("button", { name: "7", exact: true }).click()
  await page.getByRole("button", { name: "Operator ×" }).click()
  await page.getByRole("button", { name: "8", exact: true }).click()
  await page.getByRole("button", { name: "Equals" }).click()
  await expect(display).toHaveText("56")

  // 9 − 4 = 5
  await page.getByRole("button", { name: "Clear" }).click()
  await page.getByRole("button", { name: "9", exact: true }).click()
  await page.getByRole("button", { name: "Operator −" }).click()
  await page.getByRole("button", { name: "4", exact: true }).click()
  await page.getByRole("button", { name: "Equals" }).click()
  await expect(display).toHaveText("5")

  // 8 ÷ 2 = 4
  await page.getByRole("button", { name: "Clear" }).click()
  await page.getByRole("button", { name: "8", exact: true }).click()
  await page.getByRole("button", { name: "Operator ÷" }).click()
  await page.getByRole("button", { name: "2", exact: true }).click()
  await page.getByRole("button", { name: "Equals" }).click()
  await expect(display).toHaveText("4")
})
