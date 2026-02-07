Feature: User management

  Scenario: Admin can invite new user
    Given admin exists and is authenticated
    When admin invites new user with valid email
    Then the user is in pending state

  Scenario: Admin can activate pending user
    Given a user in pending state exists
    When admin accepts user Request
    Then user is active with assigned first and last name