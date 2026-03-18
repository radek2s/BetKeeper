import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, PUT } from "./route";

const mockGetUser = vi.fn();
const mockFindById = vi.fn();
const mockSave = vi.fn();

vi.mock("@app/server/auth/authenticatorFactory", () => ({
  getAuth: () => ({ getUser: mockGetUser }),
}));

vi.mock("@app/server/repositories/NextUserNotificationRepository", () => ({
  default: vi.fn(
    class FakeClass {
      findById = mockFindById;
      save = mockSave;
    },
  ),
}));

describe("UserNotificationSettings route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET should return user notification settings", async () => {
    mockGetUser.mockResolvedValue({ id: "user-123" });
    mockFindById.mockResolvedValue({
      toObject: () => ({
        userId: "user-123",
        friendInvitation: true,
        betRequestInvitation: false,
        betRequestAggreed: true,
        betResolved: false,
        betCompleted: true,
      }),
    });

    const res = await GET(new Request("http://localhost:3000"));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({
      userId: "user-123",
      friendInvitation: true,
      betRequestInvitation: false,
      betRequestAggreed: true,
      betResolved: false,
      betCompleted: true,
    });

    expect(mockFindById).toHaveBeenCalledWith("user-123");
  });

  it("PUT should validate and save updated settings", async () => {
    mockGetUser.mockResolvedValue({ id: "user-123" });

    const payload = {
      userId: "user-123",
      friendInvitation: false,
      betRequestInvitation: true,
      betRequestAggreed: false,
      betResolved: true,
      betCompleted: false,
    };
    mockSave.mockResolvedValue(undefined);

    const res = await PUT(
      new Request("http://localhost:3000", {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(res.status).toBe(200);
    expect(mockSave).toHaveBeenCalled();
    const json = await res.json();
    expect(json).toEqual(payload);
  });

  it("PUT should return 400 when body is invalid", async () => {
    mockGetUser.mockResolvedValue({ id: "user-123" });

    const res = await PUT(
      new Request("http://localhost:3000", {
        method: "PUT",
        body: JSON.stringify({ invalid: "data" }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid request data");
  });
});
