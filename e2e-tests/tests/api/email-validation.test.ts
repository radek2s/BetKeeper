import { RequestStatus } from "@domain/user";
import type { UserRequestType } from "@domain/user/entities";
import { expect, test } from "@playwright/test";
import type { ApiErrorBody } from "e2e-tests/src/api/Errors";
import { inviteUser } from "e2e-tests/src/api/UserApi";
import { getBody } from "e2e-tests/src/utils/helpers/apiHelpers";

const validEmails = [
  { email: "standard@domain.com", description: "standard email" },
  {
    email: "double_level@domain.domain.com",
    description: "double-level domain",
  },
  { email: "first-last@domain.com", description: "hyphen in local part" },
];

const invalidEmails = [
  { email: "plainaddress", description: "missing @ symbol" },
  { email: "@no_local_part.test", description: "missing local part" },
  { email: "user@.com", description: "missing domain name" },
  { email: "user@com", description: "missing dot in domain" },
  { email: "user@domain..com", description: "double dot in domain" },
  { email: "user@domain,com", description: "coma instead of dot" },
  { email: "user@domain@domain.com", description: "multiple @ symbols" },
  { email: "user name@domain.com", description: "space in local part" },
  { email: "user@domain.com');", description: "invalid characters" },
];

test.describe("Email validation - API", () => {
  let userId: string;

  test.beforeAll(async () => {
    userId = process.env.NEXT_PUBLIC_USER_ID || "";
    expect(userId).not.toBe("");
  });

  test.describe("should accept a valid email", () => {
    for (const { email, description } of validEmails) {
      test(description, async ({ request }) => {
        const response = await inviteUser(userId, request, email);
        expect(response.status(), "Status code should be 200").toBe(200);

        const {
          inviteeEmail,
          requesterId,
          status,
          approvedAt,
          approvedById,
          createdAt,
          id,
        } = await getBody<UserRequestType>(response);

        expect.soft(inviteeEmail, "Validate inviteeEmail").toBe(email);
        expect.soft(requesterId, "Validate requesterId").toBe(userId);
        expect.soft(status, "Validate status").toBe(RequestStatus.PENDING);
        expect
          .soft(approvedAt, "approvedAt should be undefined")
          .toBeUndefined();
        expect
          .soft(approvedById, "approvedById should be undefined")
          .toBeUndefined();
        expect.soft(createdAt, "createdAt should be defined").toBeDefined();
        expect.soft(id, "id should be defined").toBeDefined();
      });
    }
  });

  test.describe("should reject invalid email", () => {
    for (const { email, description } of invalidEmails) {
      test(description, async ({ request }) => {
        const response = await inviteUser(userId, request, email);
        expect(response.status(), "Status code should be 400").toBe(400);

        const { error, message } = await getBody<ApiErrorBody>(response);

        expect(error, "Validate error").toBe("Business rules error");
        expect(message, "Validate message").toBe("Invalid email format");
      });
    }
  });
});
