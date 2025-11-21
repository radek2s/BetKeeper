import { toRelativeTime } from "application/src/lib/utils/timeUtils";
import { vi } from "vitest";

describe("TimeUtils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("Convert days", () => {
    const now = new Date(2000, 1, 12, 12);
    const daysAgo = new Date(2000, 1, 10, 11);
    vi.setSystemTime(now);

    const [days, unit] = toRelativeTime(daysAgo);
    expect(days).toBe(2);
    expect(unit).toBe("day(s)");
  });
});
