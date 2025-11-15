import { UserStatus } from "@domain/user";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { UserComponent } from "./UserComponent";

vi.mock("@app/features/users/actions", () => ({
  suspendUser: vi.fn(),
  toggleUserStatus: vi.fn(),
}));

import { suspendUser, toggleUserStatus } from "@app/features/users/actions";
import type { UserType } from "@domain/user/entities";

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
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("Should render user name", () => {
    render(<UserComponent userObject={getUserObject()} />);
    expect(screen.getByText("Tester User")).toBeDefined();
    expect(screen.getByText("test@email.com")).toBeDefined();
  });

  it("Should disable active user", async () => {
    render(<UserComponent userObject={getUserObject()} />);
    const disableButton = screen.getByRole("button", { name: "person" });
    await fireEvent.click(disableButton);

    const acceptButton = screen.getByRole("button", { name: "Disable" });
    await fireEvent.click(acceptButton);

    expect(toggleUserStatus).toHaveBeenCalledTimes(1);
  });

  it("Should enable disabled user", async () => {
    render(
      <UserComponent
        userObject={getUserObject({ status: UserStatus.INACTIVE })}
      />,
    );
    const enableButton = screen.getByRole("button", { name: "person-off" });
    await fireEvent.click(enableButton);

    const acceptButton = screen.getByRole("button", { name: "Enable" });
    await fireEvent.click(acceptButton);

    expect(toggleUserStatus).toHaveBeenCalledTimes(1);
  });

  it("Should delete non-admin user", async () => {
    render(<UserComponent userObject={getUserObject()} />);
    const disableButton = screen.getByRole("button", { name: "delete" });
    await fireEvent.click(disableButton);

    const acceptButton = screen.getByRole("button", { name: "Delete" });
    await fireEvent.click(acceptButton);

    expect(suspendUser).toHaveBeenCalledTimes(1);
  });

  it("Should cancel delete non-admin user", async () => {
    render(<UserComponent userObject={getUserObject()} />);
    const disableButton = screen.getByRole("button", { name: "delete" });
    await fireEvent.click(disableButton);

    const acceptButton = screen.getByRole("button", { name: "Cancel" });
    await fireEvent.click(acceptButton);

    expect(suspendUser).toHaveBeenCalledTimes(0);
  });

  it("Should not be able to delete admin user", async () => {
    render(
      <UserComponent userObject={getUserObject({ role: "ADMINISTRATOR" })} />,
    );
    const disableButton = screen.queryByRole("button", { name: "delete" });
    expect(disableButton).toBeFalsy();
  });
});
