function isValidAccountId(id) {
  return /^\d{16}$/.test(String(id));
}

class Account {
  constructor(id, balanceAmount) {
    if (!isValidAccountId(id)) {
      throw new Error("Account id must be a 16-digit number");
    }

    this.id = id;
    this.balanceAmount = balanceAmount;
  }

  get balance() {
    return this.balanceAmount;
  }

  deposit(amount) {
    this.balanceAmount += amount;
  }

  withdraw(amount) {
    this.balanceAmount -= amount;
  }
}

module.exports = { Account };
