const { AccountStore, formatBalance, handleMenuAction } = require('./index');

describe('Account management business logic', () => {
  test('TC-001: shows the initial balance when viewing balance', () => {
    const accountStore = new AccountStore();
    const result = handleMenuAction({ choice: '1', accountStore });

    expect(result.message).toBe('Current balance: 001000.00');
    expect(result.balance).toBe(1000);
    expect(result.shouldExit).toBe(false);
  });

  test('TC-002: credits funds successfully and updates the balance', () => {
    const accountStore = new AccountStore();
    const result = handleMenuAction({ choice: '2', amount: 250, accountStore });

    expect(result.message).toBe('Amount credited. New balance: 001250.00');
    expect(result.balance).toBe(1250);
    expect(accountStore.readBalance()).toBe(1250);
  });

  test('TC-003: debits funds successfully when enough balance exists', () => {
    const accountStore = new AccountStore();
    const result = handleMenuAction({ choice: '3', amount: 300, accountStore });

    expect(result.message).toBe('Amount debited. New balance: 000700.00');
    expect(result.balance).toBe(700);
    expect(accountStore.readBalance()).toBe(700);
  });

  test('TC-004: rejects a debit when the amount exceeds the available balance', () => {
    const accountStore = new AccountStore();
    const result = handleMenuAction({ choice: '3', amount: 1500, accountStore });

    expect(result.message).toBe('Insufficient funds for this debit.');
    expect(result.balance).toBe(1000);
    expect(accountStore.readBalance()).toBe(1000);
  });

  test('TC-005: allows a debit that exactly matches the current balance', () => {
    const accountStore = new AccountStore();
    const result = handleMenuAction({ choice: '3', amount: 1000, accountStore });

    expect(result.message).toBe('Amount debited. New balance: 000000.00');
    expect(result.balance).toBe(0);
    expect(accountStore.readBalance()).toBe(0);
  });

  test('TC-006: credits zero and leaves balance unchanged', () => {
    const accountStore = new AccountStore();
    const result = handleMenuAction({ choice: '2', amount: 0, accountStore });

    expect(result.message).toBe('Amount credited. New balance: 001000.00');
    expect(result.balance).toBe(1000);
  });

  test('TC-007: debits zero and leaves balance unchanged', () => {
    const accountStore = new AccountStore();
    const result = handleMenuAction({ choice: '3', amount: 0, accountStore });

    expect(result.message).toBe('Amount debited. New balance: 001000.00');
    expect(result.balance).toBe(1000);
  });

  test('TC-008: returns an invalid selection message for unsupported menu choices', () => {
    const accountStore = new AccountStore();
    const result = handleMenuAction({ choice: '9', accountStore });

    expect(result.message).toBe('Invalid choice, please select 1-4.');
    expect(result.balance).toBe(1000);
    expect(result.shouldExit).toBe(false);
  });

  test('TC-009: exits the application when option 4 is selected', () => {
    const accountStore = new AccountStore();
    const result = handleMenuAction({ choice: '4', accountStore });

    expect(result.message).toBe('Exiting the program. Goodbye!');
    expect(result.balance).toBe(1000);
    expect(result.shouldExit).toBe(true);
  });

  test('TC-010: preserves balance continuity across multiple operations', () => {
    const accountStore = new AccountStore();
    handleMenuAction({ choice: '2', amount: 200, accountStore });
    const viewResult = handleMenuAction({ choice: '1', accountStore });
    handleMenuAction({ choice: '3', amount: 100, accountStore });
    const finalResult = handleMenuAction({ choice: '1', accountStore });

    expect(viewResult.message).toBe('Current balance: 001200.00');
    expect(finalResult.message).toBe('Current balance: 001100.00');
  });

  test('formatBalance pads values to two decimal places and a six-digit width', () => {
    expect(formatBalance(1000)).toBe('001000.00');
    expect(formatBalance(1250.5)).toBe('001250.50');
  });
});
