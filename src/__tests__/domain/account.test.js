const { Account } = require("../../domain/account");

describe("Account", () => {
  it("stores the account id and initial balance", () => {
    const account = new Account("acct-1", 100);

    expect(account.id).toBe("acct-1");
    expect(account.balance).toBe(100);
  });

  it("updates the balance for deposits and withdrawals", () => {
    const account = new Account("acct-1", 100);

    account.deposit(25);
    account.withdraw(10);

    expect(account.balance).toBe(115);
  });
});
