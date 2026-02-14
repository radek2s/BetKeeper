import { expect, test } from "@playwright/test";
import { MainPage } from "e2e-tests/src/pages/MainPage/MainPage";
import { ProfilePage } from "e2e-tests/src/pages/ProfilePage/ProfilePage";
import { UsersManagementPage } from "e2e-tests/src/pages/UsersManagementPage/UsersManagementPage";
import { generateRandomMail } from "e2e-tests/src/utils/helpers/testHelpers";

test.describe("Invite new user to system", () => {
    test("should access main page", async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.navigate();
    });

    test("should open profile page", async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.navigate();
        await mainPage.header.openProfilePage();
    });

    test("should open users management page", async ({ page }) => {
        const profilePage = new ProfilePage(page);
        await profilePage.navigate();
        await profilePage.openUsersManagementPage();
    });

    test("should fail to invite user with invalid email and display error message", async ({ page }) => {
        const userManagementPage = new UsersManagementPage(page);
        await userManagementPage.navigate();

        await expect(userManagementPage.inviteNewUserComponent
            .inviteUserByEmailExpectingError("invalid-email"),
            "Should throw error message"
        ).rejects.toThrow("Failed to create user request");
    });

    test("should invite new user and display it in pending requests", async ({ page }) => {
        const userEmail = generateRandomMail("invite");
        const userManagementPage = new UsersManagementPage(page);
        await userManagementPage.navigate();
        
        await userManagementPage.inviteNewUserComponent
            .inviteUserByEmail(userEmail);

        const pendingRequest = await userManagementPage.pendingRequestsComponent
            .getRequestByEmail(userEmail);

        await pendingRequest.validateLoaded();
        await expect(pendingRequest.getEmail(), 
            "Pending request email should match the invited user email"
        ).resolves.toBe(userEmail);
    });

    test("should reject pending request and remove it from the list", async ({ page }) => {
        const userEmail = generateRandomMail("reject_request");
        const userManagementPage = new UsersManagementPage(page);
        await userManagementPage.navigate();

        await userManagementPage.inviteNewUserComponent
            .inviteUserByEmail(userEmail);

        const pendingRequest = await userManagementPage.pendingRequestsComponent
            .getRequestByEmail(userEmail);

        const rejectDialog = await pendingRequest.rejectRequest();
        await rejectDialog.confirmRejection();

        await pendingRequest.waitToDisappear();

        const allRequestedUserEmails = await Promise.all(
                (await userManagementPage.pendingRequestsComponent.getAllRequests())
                    .map(async request => await request.getEmail())
        );

        expect(allRequestedUserEmails, "Should not contain rejected user email").not.toContain(userEmail);
    });

    test("should not activate user without setting his first name", async ({ page }) => {
        const userEmail = generateRandomMail("no_first_name");
        const userManagementPage = new UsersManagementPage(page);
        await userManagementPage.navigate();

        await userManagementPage.inviteNewUserComponent
            .inviteUserByEmail(userEmail);

        const pendingRequest = await userManagementPage.pendingRequestsComponent
            .getRequestByEmail(userEmail);

        const setupUserDialog = await pendingRequest.acceptRequest();
        await expect(setupUserDialog.create(), 
            "Should throw error message"
        ).rejects.toThrow("First name must not be blank!");
    });

    test("should not activate user without setting his last name", async ({ page }) => {
        const userEmail = generateRandomMail("no_last_name");
        const userFirstName = "FirstNameOnly";
        const userManagementPage = new UsersManagementPage(page);
        await userManagementPage.navigate();

        await userManagementPage.inviteNewUserComponent
            .inviteUserByEmail(userEmail);

        const pendingRequest = await userManagementPage.pendingRequestsComponent
            .getRequestByEmail(userEmail);

        const setupUserDialog = await pendingRequest.acceptRequest();
        await setupUserDialog.fillFirstName(userFirstName);
        await expect(setupUserDialog.create(), 
            "Should throw error message"
        ).rejects.toThrow("Last name must not be blank!");
    });

    test("should accept pending request and move it to active accounts", async ({ page }) => {
        const userEmail = generateRandomMail("accept_request");
        const userFirstName = "Active";
        const userLastName = "User";
        const userManagementPage = new UsersManagementPage(page);
        await userManagementPage.navigate();

        await userManagementPage.inviteNewUserComponent
            .inviteUserByEmail(userEmail);

        const pendingRequest = await userManagementPage.pendingRequestsComponent
            .getRequestByEmail(userEmail);

        const setupUserDialog = await pendingRequest.acceptRequest();
        await setupUserDialog.fillFirstName(userFirstName);
        await setupUserDialog.fillLastName(userLastName);
        await setupUserDialog.create();

        const activeUser = await userManagementPage.activeAccountsComponent
            .getActiveAccountByEmail(userEmail);

        expect(await activeUser.getName(), "Validate active user name").toBe(`${userFirstName} ${userLastName}`);
        expect(await activeUser.getEmail(), "Validate active user email").toBe(userEmail);

        await pendingRequest.waitToDisappear();

        const allRequestedUserEmails = await Promise.all(
                (await userManagementPage.pendingRequestsComponent.getAllRequests())
                    .map(async request => await request.getEmail())
        );

        expect(allRequestedUserEmails, "Should not contain accepted user email").not.toContain(userEmail);
    });
})