import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from '@playwright/test'
import { UserManagementWorld } from "../support/world/user-management.world";
import { acceptUserInvitation, getUserContext, inviteUser } from "../api/UserApi";
import { User, UserStatus } from "@domain/user";
import { getBody } from "../utils/helpers/apiHelpers";
import { UserRequestType } from "@domain/user/entities/UserRequest";
import { RequestStatus } from "@domain/user";
import { generateRandomMail } from "../utils/helpers/testHelpers";
import { assertExists } from "../utils/helpers/testHelpers";


Given("admin exists and is authenticated", async function (this: UserManagementWorld) {
    const adminUserId = process.env.NEXT_PUBLIC_USER_ID || '';
    expect(adminUserId, "Admin Id should be provided in environment variables").toBeTruthy();
    this.adminUserId = adminUserId!;

    const request = assertExists(this.request, "API request context is not initialized")

    const response = await getUserContext(adminUserId, request);
    expect(response.status(), "Status code should be 200").toBe(200);

    const { id, role } = await getBody<User>(response)
    expect(id, "Validate admin id").toBe(adminUserId);
    expect(role, "Validate user has ADMINISTRATOR role").toBe("ADMINISTRATOR");
});

When("admin invites new user with valid email", async function (this: UserManagementWorld) {
    const invitedUserEmail = generateRandomMail("User_management_invite");
    this.inviteUserRequest = { inviteeEmail: invitedUserEmail };

    const adminUserId = assertExists(this.adminUserId, "Admin Id must be set");
    const request = assertExists(this.request, "API request context is not initialized");

    const response = await inviteUser( adminUserId, request, invitedUserEmail);
    expect(response.status(), "Status code should be 200").toBe(200);

    this.inviteUserResponse = await getBody<UserRequestType>(response);
});

Then("the user is in pending state", function (this: UserManagementWorld) {
    const inviteUserResponse = assertExists(
        this.inviteUserResponse, 
        "Invite user response must exist"
    );
    const inviteUserRequest = assertExists(
        this.inviteUserRequest, 
        "Invite user request must exist"
    );

    expect(inviteUserResponse.inviteeEmail, "Validate invited user email")
        .toBe(inviteUserRequest.inviteeEmail);

    expect(inviteUserResponse.status, "User should be in pending state")
        .toBe(RequestStatus.PENDING);
});

Given('a user in pending state exists', async function (this: UserManagementWorld) {
    const pendingUserEmail = generateRandomMail("User_management_pending");
    this.pendingUserRequest = { inviteeEmail: pendingUserEmail };

    const adminUserId = assertExists(this.adminUserId, "Admin ID must be set");
    const request = assertExists(this.request, "API request context must be initialized");
    
    const response = await inviteUser(adminUserId, request, pendingUserEmail);
    expect(response.status(), "Status code should be 200").toBe(200);

    this.pendingUserResponse = await getBody<UserRequestType>(response);
    expect(this.pendingUserResponse.inviteeEmail, "Validate invited email")
        .toBe(pendingUserEmail);

    expect(this.pendingUserResponse.status, "User should be in pending state")
        .toBe(RequestStatus.PENDING);
});

When("admin accepts user Request", async function (this: UserManagementWorld) {
    const pendingUserResponse = assertExists(
        this.pendingUserResponse, 
        "Pending user response must exist"
    );

    this.acceptUserRequest = {
        id: pendingUserResponse.id,
        firstName: "FirstName",
        lastName: "LastName"
    };

    const adminUserId = assertExists(this.adminUserId, "Admin ID must be set");
    const request = assertExists(this.request, "API request context must be initialized");
    const { id, firstName, lastName } = this.acceptUserRequest;

    const response = await acceptUserInvitation( adminUserId, request, id, firstName, lastName);
    expect(response.status(), "Status code should be 200").toBe(200);

    const responseBody = await getBody<User>(response);

    this.acceptUserResponse = { 
        status: responseBody.status,
        firstName: responseBody.firstName,
        lastName: responseBody.lastName
    };
});

Then("user is active with assigned first and last name", function () {
    const acceptUserResponse = assertExists(
        this.acceptUserResponse, 
        "Accept user response must exist"
    );
    const acceptUserRequest = assertExists(
        this.acceptUserRequest, 
        "Accept request must exist"
    );
    
    expect(acceptUserResponse.status, "User should be in active state")
        .toBe(UserStatus.ACTIVE);

    expect(acceptUserResponse.firstName, "Validate first name")
        .toBe(acceptUserRequest.firstName);

    expect(acceptUserResponse.lastName, "Validate last name")
        .toBe(acceptUserRequest.lastName);
});