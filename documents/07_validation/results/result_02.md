# Acceptance Test Report

| | | 
| -- | -- |
| Date | 28.07.2026 |
| Version | 3.0.0-beta.4 |
| Tester ID | U02
| Age | 26 |
| Gender | Male |

### BKCT-1 Registration and account setup

| Key | Result |
| -- | -- |
| Succeed | Yes |
| Time | 01:22 |
| ER | 0 |
| AR | 0 |
| Satisfaction | 4 |
| Confusing part | User management was on the left side - user is used to search user setting in the top-right corner of the page - instinctively user tried to click there. He wouldn't assume that this gives the possibility of change avatar and names by clicking the elements. |
| What to improve | User can have indicators where to click for the first time in the application. Instead of clicking on the avatar and name he suggest to add dedicated "Account settings" section. |

Additional:  
Padding of the top menu against bottom "Create bet" button is not equal. 



### BKCT-2 Bet creation

| Key | Result |
| -- | -- |
| Succeed | Yes |
| Time | 01:07 |
| ER | 0 |
| AR | 0 |
| Satisfaction | 5 |
| Confusing part | Labels and terms on the bet creation form. Placeholders were confusing (there should be exactly: Yes, it will be sunny). Stake form was totally unclear - it is difficult to differentiate what each option do. Also the bet summary was not visible on bet details page. |
| What to improve | Firstly you decide with who you want to make a bet then about what is the bet and at the end details. Do not divide bet create request with steps - just to keep single form. Each added participant should be presented in table layout with columns such as claims and what he wants to gain. Name of the bet should be optional. |


### BKCT-3 Bet completing


| Key | Result |
| -- | -- |
| Succeed | Yes |
| Time | 02:47 |
| ER | 0 |
| AR | 0 |
| Satisfaction | 5 |
| Confusing part | Lack of auto-refresh (missing notification). Not sure about this double confirmation of accepting bet. |
| What to improve | Process is intuitive. It make sense where everything is on the single page - it looks good.  |

Additional:  
Lack of polish special character in default font family.

### BKCT-4 Modify claims

| Key | Result |
| -- | -- |
| Succeed | Yes |
| Time | 00:59 |
| ER | 0* |
| AR | 0 |
| Satisfaction | 4 |
| Confusing part | This voting mechanism (label should be "Accepted" as it is in the decision action). User should not be informed about his status when he changed the vote. In single moment we do changing details and votes. |
| What to improve | Voting mechanism should have semantic colors instead of brand colors: Green for accepted instead of gold. There should be indicator of vote next to user avatar. |

Additional:  
*Known bug with not updating page when claims are changed by user.  
Changing the places of participant.


### BKCT-5 Searching bet

| Key | Result |
| -- | -- |
| Succeed | Yes |
| Time | 00:09 |
| ER | 0 |
| AR | 0 |
| Satisfaction | 5 |
| Confusing part | Nothing... |
| What to improve | Friend avatar might have by default white (neutral) background because in various places it is not consistent. There can be added search of friend instead. |


### BKCT-6 Disable notification


| Key | Result |
| -- | -- |
| Succeed | Yes |
| Time | 00:08 |
| ER | 0 |
| AR | 0 |
| Satisfaction | 5 |
| Confusing part | Nothing... (when the things from the BKCT-1 will be adjusted) |
| What to improve | User should have notification on bet request update. |


## SUS Survey

| Statement | Raw Score | Calculated |
| --: | :--: | :--: |
| 1. | 2 | 1 |
| 2. | 1 | 4 |
| 3. | 4 | 3 |
| 4. | 1 | 4 | 
| 5. | 5 | 4 |
| 6. | 2 | 3 |
| 7. | 4,5 | 3,5 |
| 8. | 1 | 4 | 
| 9. | 5 | 4 |
| 10. | 5 | 4 |
| Score | - | 35,5 |
| **Final** | - | **86,25** |

