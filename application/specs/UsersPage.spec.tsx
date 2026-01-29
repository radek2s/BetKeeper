import UsersManagePage from "@app/app/users/page";
import UsersManageClient from "@app/features/users/components/UsersManageClient";
import { Email, RequestStatus, User, UserStatus } from "@domain/user";
import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { vi } from "vitest";

describe("UserPageTest", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should not render page for non admin user", async () => {
    fail("Method not implemented");
    await act(async () => {
      render(
        <Suspense>
          <UsersManagePage />
        </Suspense>,
      );
    });
    expect(
      await screen.findByRole("heading", { name: "Missing privileges" }),
    ).toBeDefined();
  });

  it("Should display pending user requests", async () => {
    render(
      <UsersManageClient
        users={[]}
        pendingRequests={[
          {
            id: "req-01",
            requesterId: "user-01",
            inviteeEmail: "test@email.com",
            requesterEmail: "requester@email.com",
            requesterName: "Requester",
            status: RequestStatus.PENDING,
            createdAt: new Date(),
            approvedById: undefined,
            approvedAt: undefined,
          },
        ]}
      />,
    );

    expect(await screen.getByText("test@email.com")).toBeDefined();
  });
});
