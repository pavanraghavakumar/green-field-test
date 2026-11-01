# Requirements: SQLite API Calculator

## Requirement 1: Do a calculation

**User Story:** As a User, I want to add, subtract, multiply and divide two numbers and see the result at once, so that I can do basic arithmetic without reaching for paper.

_Source: W1, BR1, BR2, S2, G1, EV1, N1_

### Acceptance Criteria

1. WHEN the User opens the app at `/` THE SYSTEM SHALL show the calculator screen with a display above a keypad of digit buttons 0 to 9, a decimal point button, the operator buttons `+`, `−`, `×` and `÷`, an equals button and a clear button.
2. WHEN the User clicks digit buttons THE SYSTEM SHALL add each digit to the display in the order clicked.
3. WHEN the User clicks an operator button after typing a number THE SYSTEM SHALL keep the first number and the chosen operation, and start the display empty for the second number.
4. WHEN the User clicks the equals button with a first number, an operation and a second number THE SYSTEM SHALL show the result on the display within 2 seconds.
5. WHEN the User clicks the equals button for 2 `+` 3 THE SYSTEM SHALL show 5 on the display.
6. WHEN the User clicks the equals button for 7 `×` 8 THE SYSTEM SHALL show 56 on the display.
7. WHEN the User clicks the equals button for 9 `−` 4 THE SYSTEM SHALL show 5 on the display.
8. WHEN the User clicks the equals button for 8 `÷` 2 THE SYSTEM SHALL show 4 on the display.
9. WHEN the User clicks the clear button THE SYSTEM SHALL empty the display and forget the first number and the operation.
10. WHEN the User clicks the equals button for 5 `÷` 0 THE SYSTEM SHALL show the message "Division by zero is not allowed" on the display and save nothing to history.

## Requirement 2: Keep a history of calculations

**User Story:** As a User, I want every successful calculation saved to a history list, so that I can see past results again instead of redoing them.

_Source: W1, BR3, E1, G1, F3, F10_

### Acceptance Criteria

1. WHEN a calculation succeeds THE SYSTEM SHALL save it to history with its expression, its result and the time it was made, and show it at the top of the history list.
2. WHEN the User opens the app THE SYSTEM SHALL show the history list of saved calculations, newest first, each row showing the expression, the result and the time in the User's local time zone.
3. WHEN the User clicks the equals button for 7 `×` 8 THE SYSTEM SHALL add the row `7 × 8 = 56` to the top of the history list.
4. WHEN the User clicks the equals button for 0 `÷` 5 THE SYSTEM SHALL show 0 on the display and add the row `0 ÷ 5 = 0` to the top of the history list.
5. WHEN the User clicks the clear button before clicking the equals button THE SYSTEM SHALL save nothing to history.
6. IF the calculation cannot be saved to history THEN THE SYSTEM SHALL still show the result on the display and show the message "Calculation not saved" beside the history list.
7. WHEN the User reloads the page THE SYSTEM SHALL show the same history list, newest first, from the calculations saved before.

## Requirement 3: Use the app on a desktop or a phone

**User Story:** As a User, I want the calculator to work on my desktop browser and on my phone browser, so that I can calculate wherever I am.

_Source: N2, N3, F8, F7_

### Acceptance Criteria

1. WHEN the User opens the app in a desktop browser THE SYSTEM SHALL show the calculator and the history list side by side, both fully visible without scrolling sideways.
2. WHEN the User opens the app in a phone browser THE SYSTEM SHALL show the calculator above the history list, both fully visible without scrolling sideways.
3. WHEN the User clicks the keypad buttons on a phone browser THE SYSTEM SHALL register each click and show the digit on the display.
4. THE SYSTEM SHALL show all text in English and all times in the User's local time zone.
5. THE SYSTEM SHALL answer the health check at `/api/health` with a success status on 99% of requests over any 30-day period, so the app is available 99% of the time.

## Later releases

- None: every workflow, rule and quality target of the brief is in release 1.

## Assumptions

- The calculator works on two numbers at a time, as the brief's workflow W1 describes; chained operations are not part of release 1.
- The history list shows every saved calculation with no limit and no delete control, since the brief asks for no other view of past calculations.
- The history list is read from the API when the page opens, so a reload shows the same calculations.
- The app has no sign-in, since the brief says the User never signs in.
- The availability target N2 (99%) is met by the local server the brief names; no criterion checks it in the browser.
