const { Account } = require('./account');
const { Transfer } = require('./transfer');

class Ledger {
  constructor(initialBalances) {
    this.accounts = new Map();
    const balances = initialBalances instanceof Map ? initialBalances : new Map(initialBalances);

    for (const [accountId, balance] of balances.entries()) {
      this.accounts.set(accountId, new Account(accountId, balance));
    }
  }

  applyTransfer(transfer) {
    if (transfer.amount <= 0) {
      return { success: false, reason: 'amount must be greater than zero' };
    }

    const fromAccount = this.accounts.get(transfer.fromAccountId);
    const toAccount = this.accounts.get(transfer.toAccountId);

    if (!fromAccount || !toAccount) {
      return { success: false, reason: 'unknown account referenced' };
    }

    if (fromAccount.balance < transfer.amount) {
      return { success: false, reason: 'insufficient funds' };
    }

    fromAccount.withdraw(transfer.amount);
    toAccount.deposit(transfer.amount);

    return { success: true };
  }

  getFinalBalances() {
    return Array.from(this.accounts.values())
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((account) => ({ id: account.id, balance: Number(account.balance.toFixed(2)) }));
  }
}

module.exports = { Ledger };
