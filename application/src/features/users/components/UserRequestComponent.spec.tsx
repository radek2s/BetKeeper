import { RequestStatus } from "@domain/user";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@app/features/users/actions", () => ({
  approveUserRequest: vi.fn(),
  rejectUserRequest: vi.fn(),
}));

import {
  approveUserRequest,
  rejectUserRequest,
} from "@app/features/users/actions";
import type { UserRequestWithRequester } from "@app/lib/mappers/user";
import { UserRequestComponent } from "./UserRequestComponent";

const getUserRequestObject = (
  request?: Partial<UserRequestWithRequester>,
): UserRequestWithRequester => ({
  id: "req-01",
  requesterId: "user-01",
  inviteeEmail: "test@email.com",
  requesterEmail: "requester@email.com",
  requesterName: "Requester",
  status: RequestStatus.PENDING,
  createdAt: new Date(),
  approvedById: undefined,
  approvedAt: undefined,
  ...request,
});

describe("UserRequestComponentTests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });
  it("Should render user request with invitee email, requester name and request relative time", () => {
    const creationDate = new Date(2000, 1, 1, 13);
    const oneHourLater = new Date(2000, 1, 1, 14, 30);
    vi.setSystemTime(oneHourLater);
    render(
      <UserRequestComponent
        request={getUserRequestObject({ createdAt: creationDate })}
      />,
    );
    expect(screen.getByText("test@email.com")).toBeDefined();
    expect(screen.getByText("1 hours ago by Requester")).toBeDefined();
  });

  it("Should approve request and create user", async () => {
    const now = new Date(2000, 1, 1, 13);
    vi.setSystemTime(now);
    render(<UserRequestComponent request={getUserRequestObject()} />);
    expect(screen.getByText("now by Requester")).toBeDefined();

    const acceptButton = screen.getByRole("button", { name: "check" });
    await fireEvent.click(acceptButton);

    const firstNameInput = screen.getByLabelText("First name");
    const lastNameInput = screen.getByLabelText("Last name");
    const createButton = screen.getByRole("button", { name: "Create" });

    fireEvent.change(firstNameInput, { target: { value: "Tester" } });
    fireEvent.change(lastNameInput, { target: { value: "User" } });
    await fireEvent.click(createButton);

    expect(approveUserRequest).toHaveBeenCalledTimes(1);
  });

  it("Should reject user request", async () => {
    const now = new Date(2000, 1, 1, 13);
    vi.setSystemTime(now);
    render(<UserRequestComponent request={getUserRequestObject()} />);

    const rejectButton = screen.getByRole("button", { name: "close" });
    await fireEvent.click(rejectButton);

    expect(rejectUserRequest).toHaveBeenCalledTimes(1);
  });
});
