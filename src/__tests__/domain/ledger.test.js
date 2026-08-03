const { Ledger } = require("../../domain/ledger");
const { Transfer } = require("../../domain/transfer");

describe("Ledger", () => {
  it("initializes accounts from an array of balances", () => {
    const ledger = new Ledger([
      ["acct-1", 100],
      ["acct-2", 50],
    ]);

    expect(ledger.accounts.get("acct-1").balance).toBe(100);
    expect(ledger.accounts.get("acct-2").balance).toBe(50);
  });

  it("applies a valid transfer and updates both accounts", () => {
    const ledger = new Ledger([
      ["acct-1", 100],
      ["acct-2", 50],
    ]);
    const transfer = new Transfer("acct-1", "acct-2", 30);

    const result = ledger.applyTransfer(transfer);

    expect(result).toEqual({ success: true });
    expect(ledger.accounts.get("acct-1").balance).toBe(70);
    expect(ledger.accounts.get("acct-2").balance).toBe(80);
  });

  it("rejects transfers with invalid amounts and unknown accounts", () => {
    const ledger = new Ledger([["acct-1", 100]]);

    expect(ledger.applyTransfer(new Transfer("acct-1", "acct-2", 10))).toEqual({
      success: false,
      reason: "unknown account referenced",
    });

    expect(ledger.applyTransfer(new Transfer("acct-1", "acct-1", 0))).toEqual({
      success: false,
      reason: "amount must be greater than zero",
    });
  });

  it("rejects transfers when the source account has insufficient funds", () => {
    const ledger = new Ledger([
      ["acct-1", 50],
      ["acct-2", 10],
    ]);
    const transfer = new Transfer("acct-1", "acct-2", 60);

    expect(ledger.applyTransfer(transfer)).toEqual({
      success: false,
      reason: "insufficient funds",
    });
  });

  it("returns final balances sorted by id and rounded to two decimals", () => {
    const ledger = new Ledger([
      ["acct-b", 10.005],
      ["acct-a", 5.555],
    ]);

    expect(ledger.getFinalBalances()).toEqual([
      { id: "acct-a", balance: 5.56 },
      { id: "acct-b", balance: 10.01 },
    ]);
  });
});
