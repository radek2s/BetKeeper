import { expect, test } from "@playwright/test";
import { MainPage } from "e2e-tests/src/pages/MainPage/MainPage";
import { generateRandomMail } from "e2e-tests/src/utils/helpers/data/userFactory";

test("Administrator should invite new user to system and activate his account", async ({
  page,
}) => {
  //As admimistrator access main page
  const mainPage = new MainPage(page);
  await mainPage.navigate();

  expect(await mainPage.isLoaded(), "Main page should be visible").toBe(true);

  //Open profile page by clicking profile avatar
  const profilePage = await mainPage.header.openProfilePage();

  expect(await profilePage.isLoaded(), "Profile page should be visible").toBe(
    true,
  );

  //Open users management page
  const userManagementPage = await profilePage.openUsersManagementPage();

  expect(
    await userManagementPage.isLoaded(),
    "Users management page should be visible",
  ).toBe(true);

  //Make attempt to invite new user using invalid email
  await userManagementPage.inviteNewUserComponent.inviteUserByEmail(
    "invalid-email",
  );
  const inviteErrorAlert = userManagementPage.inviteNewUserComponent.errorAlert;

  await expect(
    inviteErrorAlert,
    "Error message should be visible",
  ).toBeVisible();
  expect(await inviteErrorAlert.textContent(), "Validate error message").toBe(
    "Failed to create user request",
  );

  //Invite new user using valid email
  const userToRejectEmail = generateRandomMail("invite");

  await userManagementPage.inviteNewUserComponent.inviteUserByEmail(
    userToRejectEmail,
  );

  const requestToReject =
    await userManagementPage.pendingRequestsComponent.getRequestByEmail(
      userToRejectEmail,
    );
  await expect(
    requestToReject.locator,
    "Pending request should be visible",
  ).toBeVisible();
  expect(
    await requestToReject.getEmail(),
    "Pending request email should match the invited user email",
  ).toBe(userToRejectEmail);

  //Reject pending user invitation
  const rejectDialog = await requestToReject.rejectRequest();
  await rejectDialog.confirmRejection();

  await expect(
    requestToReject.locator,
    "Confirm request rejection dialog should dissapear",
  ).not.toBeVisible();

  const allRequestedUserEmailsAfterReject = await Promise.all(
    (await userManagementPage.pendingRequestsComponent.getAllRequests()).map(
      async (request) => await request.getEmail(),
    ),
  );

  expect(
    allRequestedUserEmailsAfterReject,
    "Should not contain rejected user email",
  ).not.toContain(userToRejectEmail);

  //Once again invite new user using valid email
  const userToAcceptEmail = generateRandomMail("invite");

  await userManagementPage.inviteNewUserComponent.inviteUserByEmail(
    userToAcceptEmail,
  );

  const requestToAccept =
    await userManagementPage.pendingRequestsComponent.getRequestByEmail(
      userToAcceptEmail,
    );
  await expect(
    requestToAccept.locator,
    "Pending request should be visible",
  ).toBeVisible();
  expect(
    await requestToAccept.getEmail(),
    "Pending request email should match the invited user email",
  ).toBe(userToAcceptEmail);

  //Accept user invitation and make attempt to create user without first or last name
  const setupUserDialog = await requestToAccept.acceptRequest();
  await expect(
    setupUserDialog.baseLocator,
    "User creation dialog should be visible",
  ).toBeVisible();
  await setupUserDialog.create();

  const noFirstNameErrorAlert = setupUserDialog.errorAlert;
  await expect(
    noFirstNameErrorAlert,
    "Error message should be visible",
  ).toBeVisible();
  expect(
    await noFirstNameErrorAlert.textContent(),
    "Validate error message",
  ).toBe("First name must not be blank!");

  //Make attempt to create user by setting a valid first name but without setting his last name
  const userFirstName = "FirstName";

  await setupUserDialog.firstNameInput.fill(userFirstName);
  expect(
    setupUserDialog.firstNameInput,
    `Input field should contain ${userFirstName}`,
  ).toHaveValue(userFirstName);
  await setupUserDialog.create();

  const noLastNameErrorAlert = setupUserDialog.errorAlert;
  await expect(
    noLastNameErrorAlert,
    "Error message should be visible",
  ).toBeVisible();
  expect(
    await noLastNameErrorAlert.textContent(),
    "Validate error message",
  ).toBe("Last name must not be blank!");

  //Create user by setting a valid first name and last name
  const userLastName = "LastName";

  await setupUserDialog.lastNameInput.fill(userLastName);
  expect(
    setupUserDialog.lastNameInput,
    `Input field should contain ${userLastName}`,
  ).toHaveValue(userLastName);
  await setupUserDialog.create();

  const activeUser =
    await userManagementPage.activeAccountsComponent.getActiveAccountByEmail(
      userToAcceptEmail,
    );

  await expect(
    activeUser.locator,
    "Active user should be visible",
  ).toBeVisible();
  expect(await activeUser.getName(), "Validate active user name").toBe(
    `${userFirstName} ${userLastName}`,
  );
  expect(await activeUser.getEmail(), "Validate active user email").toBe(
    userToAcceptEmail,
  );

  await expect(
    requestToAccept.locator,
    "Request should be removed from Pending Requests",
  ).not.toBeVisible();

  const allRequestedUserEmailsAfterAccept = await Promise.all(
    (await userManagementPage.pendingRequestsComponent.getAllRequests()).map(
      async (request) => await request.getEmail(),
    ),
  );

  expect(
    allRequestedUserEmailsAfterAccept,
    "Should not contain accepted user email",
  ).not.toContain(userToAcceptEmail);

  //Make attempt to invite another user using same email address
  await userManagementPage.inviteNewUserComponent.inviteUserByEmail(
    userToAcceptEmail,
  );
  const inviteByExistingMailErrorAlert =
    userManagementPage.inviteNewUserComponent.errorAlert;

  await expect(
    inviteByExistingMailErrorAlert,
    "Error message should be visible",
  ).toBeVisible();
  expect(
    await inviteByExistingMailErrorAlert.textContent(),
    "Validate error message",
  ).toBe("Failed to create user request");
});
