import { BetIdea } from "../BetIdea";

describe("Bet Idea Context", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("Should create bet with specific date", () => {
    const now = new Date(2000, 1, 12, 12);
    vi.setSystemTime(now);

    const { userId, createdAt, updatedAt, content } = new BetIdea(
      "user-01",
      "Simple content",
    );
    expect(userId).toBe("user-01");
    expect(createdAt).toStrictEqual(now);
    expect(updatedAt).toStrictEqual(now);
    expect(content).toBe("Simple content");
  });

  it("Should updated content change updatedAt date", () => {
    // Arrange
    const now = new Date(2000, 1, 12, 12);
    vi.setSystemTime(now);
    const content = "Simple content";
    const newContent = "Updated content";

    const betIdea = new BetIdea("user-01", content);

    //Act
    const later = new Date(2000, 1, 12, 13);
    vi.setSystemTime(later);

    betIdea.content = newContent;

    //Assert
    expect(betIdea.createdAt).toStrictEqual(now);
    expect(betIdea.updatedAt).toStrictEqual(later);
    expect(betIdea.content).toBe(newContent);
  });

  it("Should reconstitute", () => {
    const content = "simple content";
    const now = new Date(2000, 1, 1, 12);
    const later = new Date(2000, 1, 1, 13);
    const betIdea = BetIdea.reconstitute(
      "id-01",
      "user-01",
      content,
      now,
      later,
    );

    expect(betIdea.id).toBe("id-01");
    expect(betIdea.userId).toBe("user-01");
    expect(betIdea.content).toBe(content);
    expect(betIdea.createdAt).toBe(now);
    expect(betIdea.updatedAt).toBe(later);
  });
});
