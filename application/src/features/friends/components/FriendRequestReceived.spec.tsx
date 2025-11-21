import { UserStatus } from "@domain/user";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { FriendRequestReceived } from "./FriendRequestReceived";

vi.mock("@app/features/friends/actions", () => ({
  approveFriendRequest: vi.fn(),
  rejectFriendRequest: vi.fn(),
}));

describe("Friend Request Received Test", () => {
  it("Should render info when empty", () => {
    render(<FriendRequestReceived users={[]} />);
    expect(screen.getByText("No pending friend requests.")).toBeDefined();
  });

  it("Should render friend info box", () => {
    const users = [
      {
        requestId: "req-01",
        id: "usr-1",
        email: "user@mail.com",
        firstName: "User",
        lastName: "Friend",
        status: UserStatus.ACTIVE,
        avatarUrl: undefined,
        role: undefined,
      },
    ];
    render(<FriendRequestReceived users={users} />);
    expect(screen.getByText("User Friend")).toBeDefined();
    expect(screen.getByText("user@mail.com")).toBeDefined();
  });
});
