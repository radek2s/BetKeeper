import { TestError } from "@app-test/TestError";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import type { UserNotificationSettingsType } from "../../model";
import UserNotificationSettingsForm from "./UserNotificationSettingsForm";

const defaultSettings: UserNotificationSettingsType = {
  userId: "user-01",
  friendInvitation: true,
  betRequestInvitation: true,
  betRequestAggreed: false,
  betResolved: false,
  betCompleted: false,
};

describe("UserNotificationSettingsFormTests", () => {
  it("renders all notification options with initial values", () => {
    render(
      <UserNotificationSettingsForm
        settings={defaultSettings}
        onSave={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.getByLabelText(/Recived invitation/i)).toBeDefined();
    expect(
      screen.getByLabelText(/Invitation to new bet request/i),
    ).toBeDefined();
    expect(screen.getByLabelText(/Bet marked as agreed/i)).toBeDefined();
    expect(screen.getByLabelText(/Bet marked as resolved/i)).toBeDefined();
    expect(screen.getByLabelText(/Bet marked as completed/i)).toBeDefined();
  });

  it("shows save/restore actions when settings are modified", async () => {
    render(
      <UserNotificationSettingsForm
        settings={defaultSettings}
        onSave={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    const checkbox: HTMLInputElement =
      screen.getByLabelText(/Recived invitation/i);
    await fireEvent.click(checkbox);
    expect(checkbox.ariaChecked).toBe(`${!defaultSettings.friendInvitation}`);

    expect(screen.getByRole("button", { name: /save changes/i })).toBeDefined();
    expect(
      screen.getByRole("button", { name: /restore to default/i }),
    ).toBeDefined();
  });

  it("calls onSave with updated settings and handles loading state", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <UserNotificationSettingsForm
        settings={defaultSettings}
        onSave={onSave}
      />,
    );

    const checkbox = screen.getByLabelText(/Recived invitation/i);
    await fireEvent.click(checkbox);

    const saveButton: HTMLButtonElement = screen.getByRole("button", {
      name: /save changes/i,
    });
    await fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        ...defaultSettings,
        friendInvitation: false,
      });
    });

    expect(saveButton.disabled).toBe(false);
  });

  it("restores initial settings when cancel is clicked", async () => {
    render(
      <UserNotificationSettingsForm
        settings={defaultSettings}
        onSave={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    const checkbox: HTMLInputElement =
      screen.getByLabelText(/Recived invitation/i);
    await fireEvent.click(checkbox);
    expect(checkbox.ariaChecked).toBe("false");

    const cancelButton = screen.getByRole("button", {
      name: /restore to default/i,
    });
    await fireEvent.click(cancelButton);

    expect(screen.queryByRole("button", { name: /save changes/i })).toBeNull();
    expect(checkbox.ariaChecked).toBe("true");
  });

  it("resets loading state when saving fails", async () => {
    const error = new TestError("save failed");
    const onSave = vi.fn().mockRejectedValueOnce(error);

    render(
      <UserNotificationSettingsForm
        settings={defaultSettings}
        onSave={onSave}
      />,
    );

    const checkbox = screen.getByLabelText(/Recived invitation/i);
    await fireEvent.click(checkbox);

    const saveButton: HTMLButtonElement = screen.getByRole("button", {
      name: /save changes/i,
    });
    await fireEvent.click(saveButton);

    await waitFor(async () => {
      expect(onSave).toHaveBeenCalled();
    });

    expect(saveButton.disabled).toBe(false);
  });
});
