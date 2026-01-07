import { act, fireEvent, render, screen } from "@testing-library/react";
import { type Mock, vi } from "vitest";
import { sendFriendRequest } from "../actions";
import { FriendInvite } from "./FriendInvite";

vi.mock("@app/features/friends/actions", () => ({
  sendFriendRequest: vi.fn(),
}));
vi.mock("@app/features/users/actions", () => ({
  createUserRequest: vi.fn(),
}));
vi.mock("@app/features/friends/api/friendQuery", () => ({
  useFriendInviteMutation: vi.fn().mockReturnValue({ mutateAsync: vi.fn() }),
}));
vi.mock("@app/features/users/api/userQuery", () => ({
  useUserCreateMutation: vi.fn().mockReturnValue({ mutateAsync: vi.fn() }),
}));

describe("Friend Invite Form Tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should open dialog", async () => {
    (sendFriendRequest as Mock).mockRejectedValue(
      new Error("Invalid email format"),
    );
    render(<FriendInvite />);
    const button = screen.getByRole("button", { name: "Invite" });
    await fireEvent.click(button);

    expect(
      screen.getByRole("heading", { name: "Invite friend" }),
    ).toBeDefined();
  });

  describe("On opened dialog", () => {
    beforeEach(async () => {
      render(<FriendInvite />);
      const button = screen.getByRole("button", { name: "Invite" });
      await fireEvent.click(button);
    });

    it("Should return error message", async () => {
      const { useFriendInviteMutation } = await import(
        "@app/features/friends/api/friendQuery"
      );
      (useFriendInviteMutation().mutateAsync as Mock).mockRejectedValue(
        new Error("Invalid email format"),
      );

      const input = screen.getByLabelText("Friend email");
      fireEvent.change(input, { target: { value: "test" } });

      const acceptBtn = screen.getByRole("button", { name: "Invite" });
      await act(async () => {
        await fireEvent.click(acceptBtn);
      });

      expect(screen.getByRole("alert")).toBeDefined();
    });

    it("Should close dialog when ok", async () => {
      const { useFriendInviteMutation } = await import(
        "@app/features/friends/api/friendQuery"
      );
      (useFriendInviteMutation().mutateAsync as Mock).mockResolvedValue(
        "invite",
      );

      const input = screen.getByLabelText("Friend email");
      fireEvent.change(input, { target: { value: "test@test.pl" } });

      const acceptBtn = screen.getByRole("button", { name: "Invite" });
      await act(async () => {
        await fireEvent.click(acceptBtn);
      });

      expect(await screen.queryByLabelText("Friend email")).toBeNull();
    });
  });
});
