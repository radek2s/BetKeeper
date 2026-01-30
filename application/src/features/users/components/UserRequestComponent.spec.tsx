import { RequestStatus } from "@domain/user";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../api/adminUserQuery", () => ({
  useApproveUserRequest: vi.fn(),
  useRejectUserRequest: vi.fn(),
}));

import type { UserRequestWithRequester } from "@app/lib/mappers/user";
import {
  useApproveUserRequest,
  useRejectUserRequest,
} from "../api/adminUserQuery";
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
    vi.mocked(useApproveUserRequest).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),

      // biome-ignore lint/suspicious/noExplicitAny: This is for mocks
    } as any);
    vi.mocked(useRejectUserRequest).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),

      // biome-ignore lint/suspicious/noExplicitAny: This is for mocks
    } as any);
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
    expect(screen.getByText("1 hour(s) ago by Requester")).toBeDefined();
  });

  it("Should approve request and create user", async () => {
    const mockApprove = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useApproveUserRequest).mockReturnValue({
      mutateAsync: mockApprove,
      // biome-ignore lint/suspicious/noExplicitAny: Mocked
    } as any);

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

    expect(mockApprove).toHaveBeenCalledTimes(1);
  });

  it("Should reject user request", async () => {
    const mockReject = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useRejectUserRequest).mockReturnValue({
      mutateAsync: mockReject,
      // biome-ignore lint/suspicious/noExplicitAny: Mocked
    } as any);

    const now = new Date(2000, 1, 1, 13);
    vi.setSystemTime(now);
    render(<UserRequestComponent request={getUserRequestObject()} />);

    const rejectButton = screen.getByRole("button", { name: "close" });
    await fireEvent.click(rejectButton);

    const rejectConfirmButton = screen.getByRole("button", { name: "Reject" });
    await fireEvent.click(rejectConfirmButton);

    expect(mockReject).toHaveBeenCalledTimes(1);
  });
});
