/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { expect, test } from "@playwright/test";

test("has title", async ({ page }: { page: any }) => {
  await page.goto("/");

  // Expect h1 to contain a substring.
  expect(await page.locator("h1").innerText()).toContain("Welcome application");
});
