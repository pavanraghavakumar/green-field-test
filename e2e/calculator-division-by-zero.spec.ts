import { test, expect } from "@playwright/test"

// Issue #3 rule 1.10: 5 ÷ 0 shows the message on the display and saves nothing.
test("the calculator shows the division-by-zero message and saves nothing", async ({
  page,
  request,
}) => {
  await page.goto("/")

  const display = page.getByTestId("calculator-display")

  await page.getByRole("button", { name: "5", exact: true }).click()
  await page.getByRole("button", { name: "Operator ÷" }).click()
  await page.getByRole("button", { name: "0", exact: true }).click()
  await page.getByRole("button", { name: "Equals" }).click()

  await expect(display).toHaveText("Division by zero is not allowed")

  // Nothing was saved: the history holds no 5 ÷ 0 row.
  const history = await request.get("/api/history")
  expect(history.status()).toBe(200)
  const rows = (await history.json()) as Array<{ expression: string }>
  expect(rows.some((row) => row.expression === "5 ÷ 0")).toBe(false)
})
