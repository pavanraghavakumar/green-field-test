# Requirements brief — SQLite API Calculator
## Profile
A calculator web app built with React, SQLite and an API, for people who need to do basic arithmetic and keep a history of their calculations. · web app · personal productivity · size: small · depth: short
- **Has a user interface?** Yes (It is a React web app with screens for calculating.)
- **Runs locally?** Yes (It serves pages from React and an API, so Greenfield can start it on the person's machine.)
## The app
A small calculator web app built with React, a Python API and SQLite, for one person who needs to do basic arithmetic and keep a history of past calculations. It supports add, subtract, multiply and divide, shows each result instantly, and saves every successful calculation to a history list.
## Goals and success
- G1 Do basic arithmetic quickly and keep a record of past calculations. (description)
- M1 A calculation is done and its result shown in under 2 seconds, from the first day the app is used. [assumed] (assumption)
## Roles
- R1 User (1) [never signs in to the app] (description, Q3)
## Business events
- EV1 The user presses equals, and the app must show the result and save the calculation to history. [assumed] (assumption)
## Workflows
### W1 Do a calculation (release 1) — actors: R1 User; trigger: User wants to calculate something; outcome: Result shown and saved (description, Q1, Q4)
1. User opens the calculator
2. User types the first number
3. User chooses the operation (add, subtract, multiply, divide)
4. User types the second number
5. User presses equals
6. App shows the result
7. App saves the calculation to history
- X1 The user divides by zero; the app shows a clear message that division by zero is not allowed and saves nothing. [assumed] (assumption)
- X2 The user types something that is not a number; the app keeps the field empty and shows a hint to enter a number. [assumed] (assumption)
- X3 The app cannot save the calculation to history; the result is still shown and the user is told the calculation was not saved. [assumed] (assumption)
## Records
- E1 Calculation. fields: expression, result, timestamp; states: saved; owner: R1 (description, Q1)
## Rules
- BR1 Only the four operations add, subtract, multiply and divide are allowed.. Applies: The user presses 2 + 3 = and sees 5.. Does not apply: The user wants 2 to the power of 3, which the app does not offer. [assumed] (assumption)
- BR2 Division by zero is refused and nothing is saved.. Applies: The user presses 5 ÷ 0 = and sees a message that division by zero is not allowed.. Does not apply: The user presses 0 ÷ 5 = and sees 0, saved to history. [assumed] (assumption)
- BR3 Every successful calculation is saved to history with its expression, result and time.. Applies: The user presses 7 × 8 = and the calculation appears in history.. Does not apply: The user clears the screen before pressing equals, so nothing is saved. [assumed] (assumption)
## Quality targets
- N1 [performance] A calculation's result is shown in under 2 seconds.: 2 seconds [assumed] (assumption)
- N2 [availability] The app is available 99% of the time.: 99% [assumed] (assumption)
- N3 [devices] The app works on a desktop browser and on a phone browser.: both device types [assumed] (assumption)
## Scope and constraints
- S1 Built with React, Python and SQLite, deployed on a local server. [constraint] (description, Q5, Q6)
- S2 Operations: add, subtract, multiply and divide. (Q2)
## Decisions
- **Stack:** React, Python and SQLite (the user's choice) (Q5)
- **Deploy target:** Local server (the user's choice) (Q6)
## Risks
- K1 The local server goes down and the calculator is unavailable until it is restarted. [assumed] (assumption)
- K2 The SQLite file is lost or corrupted, and the saved history is gone. [assumed] (assumption)
## Other facts
- F1 Deployed on a local server. [hosting] (Q6)
- F2 Today calculations are done on a phone's built-in calculator or on paper, and past results are not kept. [current] [assumed] (assumption)
- F3 The top pain today is losing past calculations, so a sum done last week has to be redone from scratch. [current] [assumed] (assumption)
- F4 Today's tools are the phone's calculator app and paper; no spreadsheet or other system is used. [current] [assumed] (assumption)
- F5 The closest products are the phone's built-in calculator and web calculators such as Google's; copy their one-screen, instant result, and avoid their lack of a saved history. [similar] [assumed] (assumption)
- F6 One person uses the app, on their own, and does not sign in. [security] [assumed, high impact] (assumption)
- F7 The app is in English, with left-to-right text, and uses the user's local time zone. [access_i18n] [assumed] (assumption)
- F8 The app is used on a desktop or phone browser; it does not need to work offline. [devices] [assumed] (assumption)
- F9 At most 1 person uses the app at the same time, and about 20 calculations are saved in year 1 and about 60 in year 3. [scale] [assumed] (assumption)
- F10 No reports are needed; the history list is the only view of past calculations. [reports] [assumed] (assumption)
- F11 No notifications are sent. [notifications] [assumed] (assumption)
- F12 No files are uploaded or stored. [files] [assumed] (assumption)
- F13 No personal data is held beyond the calculations themselves. [privacy] [assumed, high impact] (assumption)
- F14 No audit trail is needed beyond the saved calculations. [audit] [assumed, high impact] (assumption)
- F15 No administration screens are needed; the app has no settings to change. [admin] [assumed] (assumption)
- F16 No money is involved: the app is free and takes no payments. [money] [assumed, high impact] (assumption)
- F17 No other systems are integrated. [integrations] [assumed, high impact] (assumption)
- F18 No existing data is moved into the app. [migration] [assumed] (assumption)
- F19 No support or operations process is needed beyond the owner restarting the local server. [operations] [assumed] (assumption)
- F20 Only one organisation uses the app, so no separation between organisations is needed. [tenancy] [assumed] (assumption)
## The interview
- Q1 [entities · owner] Should the calculator keep a history of past calculations? → Yes, keep a history
- Q2 [scope · owner] Which operations should it support? → Add, subtract, multiply and divide
- Q3 [stakeholders · owner] Who will use the calculator? → Just me
- Q4 [workflows · role:R1] Walk me through the last calculation you did, step by step, from opening the calculator to seeing the result. → 1. Open the calculator 2. Type the first number 3. Choose the operation (add, subtract, multiply, divide) 4. Type the second number 5. Press equals 6. See the result 7. The calculation is saved to history
- Q5 [stack · owner] Which technology stack should the calculator be built with? → React, Python and SQLite
- Q6 [hosting · owner] Where should the calculator be deployed? → Local server
