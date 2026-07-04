#!/usr/bin/env node

const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

class AccountStore {
  constructor(initialBalance = 1000.0) {
    this.balance = initialBalance;
  }

  readBalance() {
    return this.balance;
  }

  writeBalance(newBalance) {
    this.balance = newBalance;
    return this.balance;
  }
}

function formatBalance(value) {
  const fixedValue = Number(value).toFixed(2);
  const [whole, fraction] = fixedValue.split('.');
  return `${whole.padStart(6, '0')}.${fraction}`;
}

function handleMenuAction({ choice, amount, accountStore }) {
  switch (choice) {
    case '1': {
      const balance = accountStore.readBalance();
      return {
        shouldExit: false,
        message: `Current balance: ${formatBalance(balance)}`,
        balance,
      };
    }
    case '2': {
      const updatedBalance = accountStore.readBalance() + Number(amount || 0);
      accountStore.writeBalance(updatedBalance);
      return {
        shouldExit: false,
        message: `Amount credited. New balance: ${formatBalance(updatedBalance)}`,
        balance: updatedBalance,
      };
    }
    case '3': {
      const currentBalance = accountStore.readBalance();
      const debitAmount = Number(amount || 0);

      if (currentBalance >= debitAmount) {
        const updatedBalance = currentBalance - debitAmount;
        accountStore.writeBalance(updatedBalance);
        return {
          shouldExit: false,
          message: `Amount debited. New balance: ${formatBalance(updatedBalance)}`,
          balance: updatedBalance,
        };
      }

      return {
        shouldExit: false,
        message: 'Insufficient funds for this debit.',
        balance: currentBalance,
      };
    }
    case '4':
      return {
        shouldExit: true,
        message: 'Exiting the program. Goodbye!',
        balance: accountStore.readBalance(),
      };
    default:
      return {
        shouldExit: false,
        message: 'Invalid choice, please select 1-4.',
        balance: accountStore.readBalance(),
      };
  }
}

async function promptAmount(rl, prompt) {
  const rawValue = await rl.question(prompt);
  return Number.parseFloat(rawValue);
}

async function main() {
  const accountStore = new AccountStore();
  const rl = readline.createInterface({ input, output });

  let continueFlag = true;

  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
    const choice = await rl.question('Enter your choice (1-4): ');

    if (choice === '2' || choice === '3') {
      const amount = await promptAmount(rl, choice === '2' ? 'Enter credit amount: ' : 'Enter debit amount: ');
      const result = handleMenuAction({ choice, amount, accountStore });
      console.log(result.message);
      continueFlag = !result.shouldExit;
    } else {
      const result = handleMenuAction({ choice, accountStore });
      console.log(result.message);
      continueFlag = !result.shouldExit;
    }
  }

  rl.close();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = {
  AccountStore,
  formatBalance,
  handleMenuAction,
};
