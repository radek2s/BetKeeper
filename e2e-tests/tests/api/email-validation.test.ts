import { test, expect, request, defineConfig } from '@playwright/test'
import { inviteUser } from 'e2e-tests/src/utils/helpers/apiHelpers'
import { ApiError } from 'e2e-tests/src/utils/customErrors'
import { UserStatus } from 'e2e-tests/src/utils/enums';

const validEmails = [
    { email: "standard@domain.com", description: "standard email"},
    { email: "double_level@domain.domain.com", description: "double-level domain"},
    { email: "first-last@domain.com", description: "hyphen in local part"},
];

const invalidEmails = [
    { email: "planaddress", description: "missing @ symbol"},
    { email: "@no_local_part.test", description: "missing local part"},
    { email: "user@.com", description: "missing domain name"},
    { email: "user@com", description: "missing dot in domain"},
    { email: "user@domain..com", description: "double dot in domain"},
    { email: "user@domain,com", description: "coma instead of dot"},
    { email: "user@domain@domain.com", description: "multiple @ symbols"},
    { email: "user name@domain.com", description: "space in local part"},
    { email: "user@domain.com');", description: "invalid characters"},
];

test.describe('Email validation - API', () => {
    let userId: string;

    test.beforeAll(async () => {
        userId = process.env.NEXT_PUBLIC_USER_ID || '';
        expect(userId).not.toBe("");
    });

    test.describe('should accept a valid email', () => {
        for (const { email, description} of validEmails) {
        test(description, async ({ request }) => {
            const responseBody = await inviteUser(userId, request, email);
            
            expect.soft(responseBody.inviteeEmail).toBe(email);
            expect.soft(responseBody.requesterId).toBe(userId);
            expect.soft(responseBody.status).toBe(UserStatus.PENDING_ACTIVATION);
            expect.soft(responseBody.id).toBeDefined;
        })
    }
    });

    test.describe('should reject invalid email', () => {
        for (const { email, description} of invalidEmails) {
            test(description, async ({ request }) => {
                try {
                    await inviteUser(userId, request, email);
                    throw new Error("Expected ApiError to be thrown");
                } catch (e) {
                    if (e instanceof ApiError) {
                        expect.soft(e.status).toBe(400);
                        expect.soft(e.body.error).toBe("Business rules error");
                        expect.soft(e.body.message).toBe("Invalid email format");
                    } else {
                        throw e;
                    }
                }
            });
        }
    });
});