import { UserStatus } from "@domain/user";
import type { UserType } from "@domain/user/entities";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { FriendList } from "./FriendList";

vi.mock("@app/features/friends/actions", () => ({
  approveFriendRequest: vi.fn(),
  rejectFriendRequest: vi.fn(),
}));

describe("Friend List Test", () => {
  it("Should render info when empty", () => {
    render(<FriendList friends={[]} />);
    expect(
      screen.getByText(
        "You do not have any friend yet. Try to invite somebody!",
      ),
    ).toBeDefined();
  });

  it("Should render friend list info box", () => {
    const users: UserType[] = [
      {
        id: "usr-1",
        email: "user@mail.com",
        firstName: "User",
        lastName: "Friend",
        status: UserStatus.ACTIVE,
        avatarUrl: undefined,
        role: undefined,
      },
    ];
    render(<FriendList friends={users} />);
    expect(screen.getByText("User Friend")).toBeDefined();
    expect(screen.getByText("user@mail.com")).toBeDefined();
  });
});
