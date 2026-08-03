const { Account } = require("../../domain/account");

describe("Account", () => {
  it("stores the account id and initial balance", () => {
    const account = new Account("1111234522226789", 100);

    expect(account.id).toBe("1111234522226789");
    expect(account.balance).toBe(100);
  });

  it("updates the balance for deposits and withdrawals", () => {
    const account = new Account("1111234522226789", 100);

    account.deposit(25);
    account.withdraw(10);

    expect(account.balance).toBe(115);
  });

  it("rejects invalid account ids", () => {
    expect(() => new Account("invalid-id", 100)).toThrow(
      "Account id must be a 16-digit number",
    );
  });
});
