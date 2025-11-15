import { UserStatus } from "@domain/user";
import { render, screen } from "@testing-library/react";
import { UserComponent } from "./UserComponent";

describe("UserComponentTests", () => {
  it("Should render user name", () => {
    render(
      <UserComponent
        userObject={{
          id: "01",
          email: "test@email.com",
          firstName: "Tester",
          lastName: "Testowy",
          role: "",
          status: UserStatus.ACTIVE,
          avatarUrl: undefined,
        }}
      />,
    );
    expect(screen.getByText("Tester Testowy")).toBeDefined();
  });
});
