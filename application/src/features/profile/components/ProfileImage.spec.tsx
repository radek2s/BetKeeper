import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ProfileImage } from "./ProfileImage";

vi.mock("@app/features/users/actions", () => ({
  updateAvatar: vi.fn(),
}));
vi.mock("@app/features/users/api/userQuery", () => ({
  useProfileImageMutation: vi.fn().mockReturnValue({ mutateAsync: vi.fn() }),
}));

const defaultAvatar = "/avatars/avatar_01.png";

describe("Profile Image Tests", () => {
  it("Should render dialog and handle avatar change", async () => {
    const { useProfileImageMutation } = await import(
      "@app/features/users/api/userQuery"
    );

    render(<ProfileImage activeImage={defaultAvatar} />);
    const profileImage = screen.getByRole("img");
    await fireEvent.click(profileImage);
    expect(screen.getByRole("heading", { name: "Choose image" })).toBeDefined();

    const newImage = screen.getByRole("img", {
      name: "/avatars/avatar_02.png",
    });
    expect(newImage).toBeDefined();
    await fireEvent.click(newImage);

    const saveBtn = screen.getByRole("button", { name: "Save" });
    await fireEvent.click(saveBtn);

    expect(useProfileImageMutation().mutateAsync).toHaveBeenCalledTimes(1);
  });
});
