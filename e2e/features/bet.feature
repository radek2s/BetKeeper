Feature: Bet creation

    Scenario: User creates bet
        When User clicked bet creation
        Then Bet Request creation dialog has appeared

    Scenario: User fill bet data
        Given User selected bet participant
        And defined terms
        And defined common stake
        When user create click button
        Then Bet Request should be created with data

