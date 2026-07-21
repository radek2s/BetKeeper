
# BKUP-1 Usability test protocol 

|  | |
| --- | --- |
| Protocol ID | BKUP-1 |
| Scenario ID | [BKUS-1](../03_usability_scenarios.md) |
| Critical tasks | [BKCT-4](../02_usability_critical_tasks.md) |
| Analyzed persona  | [Persona 1](../01_usability_context.md) or [Persona 4](../01_usability_context.md) |
| Version | 1.0 |
| Prepared by | radek2s |
| Date | 2026-07-21 |


## Objective

Validate that a first‑time user can successfully open a bet invitation, understand the context, join the bet, and submit a prediction without assistance, within a realistic time constraint.

This protocol verifies the following requirements:

- [BKR_01](../../01_requirements/00-requirements.md) - Platform for noting bets
- [BKR_02](../../01_requirements/00-requirements.md) - Establishing bets regardless of distance and location
- [BKR_05](../../01_requirements/00-requirements.md) - Pending for approval bet request
- [BKR_14](../../01_requirements/00-requirements.md) - Inviting a new user to application
- [BKR_22](../../01_requirements/00-requirements.md) - Adding to friend list
- [BKR_27](../../01_requirements/00-requirements.md) - Mobile friendly
- [BKR_28](../../01_requirements/00-requirements.md) - Application in sync
- [BKR_31](../../01_requirements/00-requirements.md) - Notifications for user

## Scenario context
_Copied from BKUS-1_

You are at home, using your smartphone, when a friend sends you a message with invitation to join a bet for upcoming football match between TEAM_A and TEAM_B. The match begins in about ten minutes, and you want to place your prediction before it starts. You expect the process to be quick and intuitive. Your goal is to open the invitation, join the bet and submit your prediction. 

## Preconditions

- Participant has never used BetKeeper before
- Participant has a smartphone with Internet access
- Participant have valid email address synced with phone to receive invitation link
- Participant is seated and has comfortable environment
- Participant is not given instruction about the UI or steps.

## Tasks

### Task 1: Open the invitation
Success criteria: BetKeeper loads and user has created account

### Task 2: Accept friend invitation
Success criteria: User accepts friend invitation

### Task 3: User receives bet request
Success criteria: User can locate the terms and stakes of given bet request

### Task 4: User accepts the request
Success criteria: Bet request is now a bet.

## Success criteria

- User completes all tasks without assistance
- There is no critical errors during execution
- User has defined bet with common stake

## Metrics

| Metric | Target | Note |
| -- | -- | -- |
| Task completion rate | >= 90% | Across all participants |
| Time on task | <= 5 minutes | From account creation link to accepted bet request  |
| Critical errors | 0 | Any error prevents task completion |
| Help requests | 0 | Moderator must not assist |

- User confidence rating: 1 - 5
- Perceived difficulty: 1 - 5
- Satisfaction: 1 - 5
- Observer notes: (confusion, hesitation, comments)
- User quotes

## Error classification

### Critical errors:
- User cannot find pending bet request
- User cannot accept bet request
- User abandons the task

### Non-critical errors:

- Misclicks
- Opening wrong screen but recovering
- Confusion about terminology


## Data recording template

- Non-critical errors:
- Hesitation points:
- User comments:


### Outcome summary:
_Select one option during writing the results_

- Pass | Conditional pass | Fail
- Critical errors: Yes | No
- Time on task: (mm:ss)

