import { test } from "@e2e-tests/src/fixtures/pageObjects.fixture";

test.describe("Actions on bet", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("CRUD basic bet", async ({ mainPage }) => {
    const betTitle = "Subject of bet";

    await test.step("create bet", async () => {
      //Create bet request with default values. Required empty fields are filled with random data.
      //Check correctness of the created bet request. //open, multiple assert
    });
    await test.step("update bet", async () => {
      //Edit any field of bet request details and save.
      //Check correctness of the details of edited bet request. //open, multiple assert
    });
    await test.step("delete bet", async () => {
      await mainPage.betSearch.searchInput.click();
      await mainPage.betSearch.searchInput.fill("Subject of bet");
      const betCard = await mainPage.betSearch.getBetCard(betTitle);

      await (await betCard.gotoBetDetails()).delete();
      await mainPage.betSearch.searchInput.click();
      await mainPage.betSearch.searchInput.fill("Subject of bet");
      await mainPage.betSearch.verifyBetListIsEmpty();
    });
  });
});
