# Bet Keeper validation test plan

In classic waterfall model validation of product is in the end of the process to evaluate implemented solutions and ensure software meets user expectations. 

Validation tests will be performed on BetKeeper beta version that will have all designed features implemented. This will be pre-production version. Main objectives is to ensure that key user tasks are working and there is no critical issues. 

## User profile

Any person that want to use the application but:

Exclusion criteria:

- Used BetKeeper application before



## Metrics

Validation test plan will be executed on small group of people but there will be measurable success criteria:

| Metric | Description |
| --- | --- |
| TSR - Task success ratio | % of users that finished tasks without assistance |
| AToT - Average Time on task | Average time to finish task | 
| ER - Error rate | Average count of errors or invalid steps per user |
| AR - Assistance rate | % of users that required assistance |
| SUS - System usability scale | Short survey |
| Satisfaction per task | Short rating after each task |


## Critical tasks

### BKCT-1 Registration and account setup

| | |
| --- | --- |
| Scenario context | You have been invited to BetKeeper. |
| Command | Login using your email and configure your account. Setup you avatar and display name. |
| Time limit | 300s (5 minutes) |
| Success criteria | User logged in, changed avatar, first and last name |



### BKCT-2 Bet creation

| | |
| --- | --- |
| Scenario context | You are registered user. You want to make a new bet with me for upcoming Rocket League match. We decide that we bet on chocolate bar. |   
| Command | Create bet where you say that Blue team will win. |
| Time limit | 360s (6 minutes) |
| Success criteria | User invite facilitator as friend. Then create a bet request with facilitator and with common stake (chocolate bar) where he claims that Blue team win. Bet must be approved by both participants and must be unresolved. |

### BKCT-3 Bet completing

| | |
| --- | --- |
| Scenario context | You are registered user with at least one friend (me - facilitator). You want to note the result of the bet you made with me. We bet that you will not make it in time to be at home before midnight - but you did it!. We bet that when you win I will write to Penny, but when I win you must talk to Sheldon. I am sending to you screenshot that I just wrote to Penny |   
| Command | Note this bet. |
| Time limit | 300s (5 minutes) |
| Success criteria | User proceed through bet flow and mark bet as completed. |

### BKCT-4 Modify claims

Terms: When Emma Watson was born?. 



| | |
| --- | --- |
| Scenario context | You have been invited to participate to a new bet but you do not agree with the initial claims that somebody has defined for you. |   
| Command | Correct and make the claims valid. |
| Time limit | 120s (2 minutes) |
| Success criteria | User changes his claims. |

### BKCT-5 Searching bet


| | |
| --- | --- |
| Scenario context | You are registered user. With at least 2 bets |   
| Command | Find latest completed bet. |
| Time limit | 120s (2 minutes) |
| Success criteria | User finds bet with being at home before midnight. |

### BKCT-6 Disable notification


| | |
| --- | --- |
| Scenario context | You do not want to receive email notifications. |   
| Command | Disable all email notifications |
| Time limit | 120s (2 minutes) |
| Success criteria | User change his notification settings and uncheck all options. |

## SUS Survey

1. I think I'd like to use BetKeeper frequently.
2. The BetKeeper interface is too complicated. [Negative]
3. I think BetKeeper is easy to use.
4. I think there are too many ambiguous elements in the app. [Negative]
5. I think most people would learn how to use BetKeeper quickly.
6. I think there are too many inconsistencies in the app. [Negative]
7. The navigation and screen layout allow me to quickly find what I want to read.
8. The colors and contrast of the text in BetKeeper make the information difficult to read. [Negative]
9. Headlines, labels, and call-to-action (CTAs) are clearly distinguishable from supporting content.
10. I feel confident using BetKeeper for placing bets and checking my history.

#### Calculation:
For positive statements from `result` subtract 1.  
For negative statements calculate 5 - `score`.  
Summarize all results (score within range 0-40).  
Final score: Multiply this by 2.5 -> `SUS = score x 2.5`

| Range | Result | Recommended actions | 
| --- | --- | --- |
| 85 - 100 | Excellent | Keep current solutions; Minor improvements to consider |
| 70 - 84 | Good | Accepted level; Correct the weak points |
| 50 - 69 | Average | Require changes in the critical tasks |
| 0 - 49 | Poor | Urgent fixes; Perform origin analysis and perform new validation tests |




## Testing procedure

1. Prepare environment.  
Ensure that [https://betkeeper.ovh](https://betkeeper.ovh/) is accessible and database is running. 
2. Make an introduction.  
Short explanation about test goal (this is application test - not person skills test). Ensure that there is a agreement for recording. 
3. Task performance.  
Execute all task in given order. Make notes and time - note all unexpected behaviors, hesitation, emotions, moments when user move back to previous screens. Do not interrupt and do not help. When he ask for advice note this action and support him.  
After each task record and ask given questions:
    - Result (Success | Failure)
    - ToT Time on task (mm:ss)
    - Was assistance (Yes | No)
    - ER Error rate (number)  
    - How easy it was to complete this task? (1-5 scale)
    - What what the most confusing part?
    - What would you change to make it easier?

4. Fill System Usability Scale and collect insights.  
Here is moment to collect overall score related to product and some free thoughts about this solution.
5. Close the meeting.

## Success criteria

After series of tests the final validation report must be created with analysis of results collected. 

| Metric | Value |
| --- | --- |
| TSR | >= 90% |
| ToT | <= Task limit|
| ER | = 0% |
| AR | <= 20% |
| Average Satisfaction per task | >= 75% |
| Average SUS | >= 75% |

When all criteria are passed application is ready to release!

