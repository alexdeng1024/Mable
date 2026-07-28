class Transfer {
  constructor(fromAccountId, toAccountId, amount) {
    this.fromAccountId = fromAccountId;
    this.toAccountId = toAccountId;
    this.amount = amount;
  }
}

module.exports = { Transfer };
