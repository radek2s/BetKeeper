import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@app/features/users/actions", () => ({
  createUserRequest: vi.fn(),
}));

import { createUserRequest } from "../actions";
import { UserInviteForm } from "./UserInviteForm";

describe("User Invite Form Tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("Should render user name", async () => {
    (createUserRequest as jest.Mock).mockRejectedValue(
      new Error("Invalid email format"),
    );
    render(<UserInviteForm />);
    const input = screen.getByPlaceholderText("Give email...");
    const button = screen.getByRole("button", { name: "send" });
    fireEvent.change(input, { target: { value: "Tester" } });

    await act(async () => {
      await fireEvent.click(button);
    });

    const alert = await screen.findByRole("alert");

    expect(alert.innerHTML).toBe("Invalid email format");
    expect(createUserRequest).toHaveBeenCalledTimes(1);
  });
});
