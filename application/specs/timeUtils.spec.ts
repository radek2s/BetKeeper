import { toRelativeTime } from "application/src/lib/utils/timeUtils";

describe("TimeUtils", () => {
  it("Convert days", () => {
    const date = new Date(2025, 10, 8);
    const result = toRelativeTime(date);
    console.log(result);
  });
  it("Convert hours", () => {
    const date = new Date(2025, 10, 14);
    const result = toRelativeTime(date);
    console.log(result);
  });
});
