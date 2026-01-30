import ClientUsersPage from "@app/app/users/UsersPage";
import UsersManageClient from "@app/features/users/components/UsersManageClient";
import { RequestStatus, UserStatus } from "@domain/user";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@app/features/users/UserProvider", () => ({
  useUserContext: vi.fn(),
}));

import { useUserContext } from "@app/features/users/UserProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

describe("UserPageTest", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(useUserContext).mockReturnValue({
      id: "user-01",
      avatarUrl: "avatar-01",
      email: "email@test.com",
      firstName: "Test",
      lastName: "Mock",
      status: UserStatus.ACTIVE,
      role: "",
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithQueryClient = (component: ReactNode) =>
    render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    );

  it("Should not render page for non admin user", async () => {
    render(<ClientUsersPage />);

    expect(
      await screen.findByRole("heading", { name: "Missing privileges" }),
    ).toBeDefined();
  });

  it("Should display pending user requests", async () => {
    renderWithQueryClient(
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
