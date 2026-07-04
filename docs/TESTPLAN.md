# COBOL Application Test Plan

This test plan documents the current business logic and implementation behavior of the account management COBOL application so it can be reviewed with business stakeholders and later translated into automated unit and integration tests in a Node.js application.

## Scope

The current application supports:
- Viewing the current account balance
- Crediting funds to the account
- Debiting funds from the account
- Preventing debits that exceed the available balance

## Test Matrix

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View current balance | Application is started and the account balance is at the default initial value of 1000.00 | 1. Launch the application. 2. Select option 1 from the main menu. | The application displays the current balance as 001000.00 and returns to the main menu. |  |  | Validates the initial read behavior. |
| TC-002 | Credit funds successfully | Application is started and the account balance is at the default initial value of 1000.00 | 1. Launch the application. 2. Select option 2 from the main menu. 3. Enter a credit amount such as 250.00. | The application adds 250.00 to the balance, stores the updated balance, and displays the new balance as 1250.00. |  |  | Validates positive balance increase behavior. |
| TC-003 | Debit funds successfully when sufficient funds are available | Application is started and the account balance is at the default initial value of 1000.00 | 1. Launch the application. 2. Select option 3 from the main menu. 3. Enter a debit amount such as 300.00. | The application subtracts 300.00 from the balance, stores the updated balance, and displays the new balance as 700.00. |  |  | Validates successful withdrawal behavior. |
| TC-004 | Reject debit when amount exceeds available balance | Application is started and the account balance is at the default initial value of 1000.00 | 1. Launch the application. 2. Select option 3 from the main menu. 3. Enter a debit amount greater than the current balance, such as 1500.00. | The application displays an "Insufficient funds for this debit." message and does not update the balance. |  |  | Validates overdraft protection rule. |
| TC-005 | Debit exact current balance | Application is started and the account balance is at the default initial value of 1000.00 | 1. Launch the application. 2. Select option 3 from the main menu. 3. Enter a debit amount equal to the current balance, such as 1000.00. | The application allows the debit, reduces the balance to 0.00, and stores the updated balance. |  |  | Validates boundary condition for exact balance usage. |
| TC-006 | Credit zero amount | Application is started and the account balance is at the default initial value of 1000.00 | 1. Launch the application. 2. Select option 2 from the main menu. 3. Enter 0.00 as the credit amount. | The application accepts the amount and leaves the balance unchanged. |  |  | Validates zero-value credit handling. |
| TC-007 | Debit zero amount | Application is started and the account balance is at the default initial value of 1000.00 | 1. Launch the application. 2. Select option 3 from the main menu. 3. Enter 0.00 as the debit amount. | The application accepts the amount and leaves the balance unchanged. |  |  | Validates zero-value debit handling. |
| TC-008 | Invalid menu selection | Application is started | 1. Launch the application. 2. Enter an invalid option such as 9. | The application displays an "Invalid choice, please select 1-4." message and continues to prompt for a valid selection. |  |  | Validates input validation for the main menu. |
| TC-009 | Exit the application | Application is started | 1. Launch the application. 2. Select option 4 from the main menu. | The application displays an exit message and terminates successfully. |  |  | Validates program termination behavior. |
| TC-010 | Balance persistence across operations | Application is started | 1. Launch the application. 2. Select option 2 and credit 200.00. 3. Select option 1 to view the balance. 4. Select option 3 and debit 100.00. 5. Select option 1 to view the balance again. | The balance reflects the accumulated changes in sequence, showing 1200.00 after credit and 1100.00 after debit. |  |  | Validates state continuity across multiple operations. |

## Notes for Stakeholders

- The current implementation uses a single in-memory balance and does not persist data between application runs.
- The business logic is intentionally simple and reflects a basic account management workflow rather than a full banking system.
- The test plan should be updated if future enhancements introduce student-specific rules, fees, limits, or persistent storage.
