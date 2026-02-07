import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from '@playwright/test'
import { UserManagementWorld } from "../support/world/user-management.world";
import { acceptUserInvitation, getUserContext, inviteUser } from "../api/UserApi";
import { User, UserStatus } from "@domain/user";
import { getBody } from "../utils/helpers/apiHelpers";
import { UserRequestType } from "@domain/user/entities/UserRequest";
import { RequestStatus } from "@domain/user";
import { generateRandomMail } from "../utils/helpers/testHelpers";


const invitedUserEmail = generateRandomMail("User_management_invite");
const pendingUserEmail = generateRandomMail("User_management_pending");
const pendingUserFirstName = "FirstName";
const pendingUserLastName = "LastName";

Given("Admin exists and is authenticated", async function (this: UserManagementWorld) {
    const adminUserId = process.env.NEXT_PUBLIC_USER_ID || '';
    expect(adminUserId).not.toBe("");
    this.adminUserId = adminUserId;

    if(!this.request) throw new Error("API request context is not initialized");
    
    const response = await getUserContext(adminUserId, this.request);
    expect(response.status(), "Status code should be 200").toBe(200);

    const { id, role } = await getBody<User>(response)
    expect(id, "Validate admin id").toBe(adminUserId);
    expect(role, "Validate user has ADMINISTRATOR role").toBe("ADMINISTRATOR");
});

When("Admin invites new user with valid email", async function ( this: UserManagementWorld) {
    const response = await inviteUser(this.adminUserId!, this.request!, invitedUserEmail);
    expect(response.status(), "Status code should be 200").toBe(200);
    
    const { id, status, inviteeEmail } =  await getBody<UserRequestType>(response);
    expect(id, "id should be defined").toBeDefined();
    this.invitedUser = { id, status, inviteeEmail };
});

Then("The user is in pending state", function (this: UserManagementWorld) {
    expect(this.invitedUser).toBeDefined();
    expect(this.invitedUser?.inviteeEmail, "Validate invited email").toBe(invitedUserEmail);
    expect(this.invitedUser?.status, "User should be in pending state").toBe(RequestStatus.PENDING);
});

Given('A user in pending state exists', async function (this: UserManagementWorld) {
    const response = await inviteUser(this.adminUserId!, this.request!, pendingUserEmail);
    expect(response.status(), "Status code should be 200").toBe(200);
    
    const { id, status, inviteeEmail } =  await getBody<UserRequestType>(response);
    expect(id, "id should be defined").toBeDefined();
    
    this.pendingUser = { id, status, inviteeEmail };
    expect(inviteeEmail, "Validate invited email").toBe(pendingUserEmail);
    expect(status, "User should be in pending state").toBe(RequestStatus.PENDING);
});

When("Admin accepts user Request", async function (this: UserManagementWorld) {
    const response = await acceptUserInvitation(
        this.adminUserId!,
        this.request!,
        this.pendingUser!.id!,
        "FirstName",
        "LastName",
    );
    expect(response.status(), "Status code should be 200").toBe(200);

    const { id, status, email, firstName, lastName } =  await getBody<User>(response);
    expect(id, "is should be defined").toBeDefined();

    this.activeUser = { id, status, email, firstName, lastName };
});

Then("User is active with assigned first and last name", function () {
    expect(this.activeUser).toBeDefined();
    expect(this.activeUser?.status).toBe(UserStatus.ACTIVE);
    expect(this.activeUser?.firstName).toBe(pendingUserFirstName);
    expect(this.activeUser?.lastName).toBe(pendingUserLastName);
});  