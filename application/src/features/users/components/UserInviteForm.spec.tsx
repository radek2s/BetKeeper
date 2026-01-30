import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../api/userQuery", () => ({
  useUserCreateMutation: vi.fn(),
}));

import { useUserCreateMutation } from "../api/userQuery";
import { UserInviteForm } from "./UserInviteForm";

describe("User Invite Form Tests", () => {
  beforeEach(() => {
    vi.mocked(useUserCreateMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: vi.fn().mockReturnValue(false),
      error: vi.fn().mockReturnValue(undefined),
      // biome-ignore lint/suspicious/noExplicitAny: This is for mocks
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should render user name", async () => {
    const mockCreateError = vi
      .fn()
      .mockRejectedValue(new Error("Invalid email format"));

    vi.mocked(useUserCreateMutation).mockReturnValue({
      mutateAsync: mockCreateError,
      // biome-ignore lint/suspicious/noExplicitAny: This is for mocks
    } as any);

    render(<UserInviteForm />);
    const input = screen.getByPlaceholderText("Give email...");
    const button = screen.getByRole("button", { name: "send" });
    fireEvent.change(input, { target: { value: "Tester" } });

    await act(async () => {
      await fireEvent.click(button);
    });

    expect(mockCreateError).toHaveBeenCalledTimes(1);
  });
});
