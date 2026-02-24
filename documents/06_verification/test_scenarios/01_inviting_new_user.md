# Test scenario: Inviting new user as administrator
## Test Goal:
- verify the flow of adding new users to system by administrator
- email and name input validation is working correctly
- navigation from main page to user profile page is working correctly

## Preconditions:
- Administrator is logged into system

## Test Steps

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | As administrator access main page | Main page is displayed |
| 2 | Open profile page by clicking profile avatar | Profile page is displayed |
| 3 | Open users management page | Users management page is displayed |
| 4 | Make attempt to invite new user using invalid email | Error message "Failed to create user request" is displayed, user is not invited to the system |
| 5 | Invite new user using valid email. It is generated randomly with prefix "invite" | Pending user invitation request is displayed in Pending Requests section |
| 6 | Reject pending user invitation | Pending user invitation request is removed from Pending Requests section |
| 7 | Once again invite new user using valid email | Pending user invitation request is displayed in Pending Requests section |
| 8 | Accept user invitation and make attempt to create user without first or last name | Error message "First name must not be blank!" is displayed |
| 9 | Make attempt to create user by setting a valid first name, but without setting his last name | Error message "Last name must not be blank!" is displayed |
| 10 | Create user by setting a valid first name and last name | User account is activated and displayed in Active Accounts section. User pending request is removed from Pending Requests section |
| 11 | Make attempt to invite another user using same email address | Error message "Failed to create user request" is displayed, user is not invited to the system
---