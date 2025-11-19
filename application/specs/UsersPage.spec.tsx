import { Email, RequestStatus, User, UserStatus } from "@domain/user";
import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@app/features/users/actions", () => ({
  getActiveUser: vi.fn(),
  getAllActiveUsers: vi.fn(),
  getPedingUserRequests: vi.fn(),
}));

vi.mock("@app/server/auth/authentication", () => ({
  getAuthenticatedUserFromCookie: vi.fn(),
}));

vi.mock("@corbado/react", () => ({
  useCorbado: vi.fn().mockReturnValue({
    loading: false,
    isAuthenticated: true,
  }),
}));

import UsersManagePage from "@app/app/users/page";

import UsersManageClient from "@app/features/users/components/UsersManageClient";
import { AuthorizedUser } from "@app/lib/user/AuthorizedUser";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import { useCorbado } from "@corbado/react";
import { Suspense } from "react";

describe("UserPageTest", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should not render page for non admin user", async () => {
    (getAuthenticatedUserFromCookie as jest.Mock).mockResolvedValueOnce(
      AuthorizedUser.reconstituteAuth(
        "user-01",
        new Email("user@mail.com"),
        "Tester",
        "User",
        UserStatus.ACTIVE,
        "",
      ),
    );
    (useCorbado as jest.Mock).mockReturnValue({
      loading: false,
      isAuthenticated: true,
    });
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
