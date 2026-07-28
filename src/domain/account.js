class Account {
  constructor(id, balanceAmount) {
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
