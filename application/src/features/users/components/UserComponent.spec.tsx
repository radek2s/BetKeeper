import { UserStatus } from "@domain/user";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { UserComponent } from "./UserComponent";

vi.mock("../api/adminUserQuery", () => ({
  useToggleUserStatus: vi.fn(),
  useSuspendUser: vi.fn(),
}));

import type { UserType } from "@domain/user/entities";
import { useSuspendUser, useToggleUserStatus } from "../api/adminUserQuery";

const getUserObject = (user?: Partial<UserType>): UserType => ({
  id: "01",
  email: "test@email.com",
  firstName: "Tester",
  lastName: "User",
  role: undefined,
  status: UserStatus.ACTIVE,
  avatarUrl: undefined,
  ...user,
});

describe("UserComponentTests", () => {
  beforeEach(() => {
    vi.mocked(useToggleUserStatus).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      // biome-ignore lint/suspicious/noExplicitAny: This is for mocks
    } as any);
    vi.mocked(useSuspendUser).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      // biome-ignore lint/suspicious/noExplicitAny: This is for mocks
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should render user name", () => {
    render(<UserComponent userObject={getUserObject()} />);
    expect(screen.getByText("Tester User")).toBeDefined();
    expect(screen.getByText("test@email.com")).toBeDefined();
  });

  it("Should disable active user", async () => {
    const mockToggle = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useToggleUserStatus).mockReturnValue({
      mutateAsync: mockToggle,
      // biome-ignore lint/suspicious/noExplicitAny: This is for mocks
    } as any);

    render(<UserComponent userObject={getUserObject()} />);
    const disableButton = screen.getByRole("button", { name: "person" });
    await fireEvent.click(disableButton);

    const acceptButton = screen.getByRole("button", { name: "Disable" });
    await fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  it("Should handle toggle error gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const mockError = new Error("Toggle failed");

    vi.mocked(useToggleUserStatus).mockReturnValue({
      mutateAsync: vi.fn().mockRejectedValue(mockError),
      // biome-ignore lint/suspicious/noExplicitAny: This is for mocks
    } as any);

    render(
      <UserComponent
        userObject={getUserObject({ status: UserStatus.INACTIVE })}
      />,
    );
    const enableButton = screen.getByRole("button", { name: "person-off" });
    await fireEvent.click(enableButton);

    const acceptButton = screen.getByRole("button", { name: "Enable" });
    await fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    });

    consoleErrorSpy.mockRestore();
  });

  it("Should suspend non-admin user on confirm", async () => {
    const mockSuspend = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useSuspendUser).mockReturnValue({
      mutateAsync: mockSuspend,
      // biome-ignore lint/suspicious/noExplicitAny: Mocked
    } as any);
    render(<UserComponent userObject={getUserObject()} />);
    const disableButton = screen.getByRole("button", { name: "delete" });
    await fireEvent.click(disableButton);

    const acceptButton = screen.getByRole("button", { name: "Delete" });
    await fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(mockSuspend).toHaveBeenCalledTimes(1);
    });
  });

  it("Should not suspend non-admin user on dismiss", async () => {
    const mockSuspend = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useSuspendUser).mockReturnValue({
      mutateAsync: mockSuspend,
      // biome-ignore lint/suspicious/noExplicitAny: Mocked
    } as any);
    render(<UserComponent userObject={getUserObject()} />);
    const disableButton = screen.getByRole("button", { name: "delete" });
    await fireEvent.click(disableButton);

    const acceptButton = screen.getByRole("button", { name: "Cancel" });
    await fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(mockSuspend).toHaveBeenCalledTimes(0);
    });
  });

  it("Should not be able to delete admin user", async () => {
    render(
      <UserComponent userObject={getUserObject({ role: "ADMINISTRATOR" })} />,
    );
    const disableButton = screen.queryByRole("button", { name: "delete" });
    expect(disableButton).toBeFalsy();
  });
});
