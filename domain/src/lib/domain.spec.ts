import { domain } from "./domain";

describe("domain", () => {
  describe("nested", () => {
    it("should work", () => {
      expect(domain()).toEqual("domain");
    });
    it("should always be true", () => {
      expect(true).toBeTruthy();
    });
  });
});
