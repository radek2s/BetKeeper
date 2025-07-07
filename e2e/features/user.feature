Feature: User model

  Scenario: Creating a user
    Given I have a user with the name "Radosław"
    Then the user's name should be "Radosław"