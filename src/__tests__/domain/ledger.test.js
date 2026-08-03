const { Ledger } = require("../../domain/ledger");
const { Transfer } = require("../../domain/transfer");

describe("Ledger", () => {
  it("initializes accounts from an array of balances", () => {
    const ledger = new Ledger([
      ["1111234522226789", 100],
      ["1111234522221234", 50],
    ]);

    expect(ledger.accounts.get("1111234522226789").balance).toBe(100);
    expect(ledger.accounts.get("1111234522221234").balance).toBe(50);
  });

  it("applies a valid transfer and updates both accounts", () => {
    const ledger = new Ledger([
      ["1111234522226789", 100],
      ["1111234522221234", 50],
    ]);
    const transfer = new Transfer("1111234522226789", "1111234522221234", 30);

    const result = ledger.applyTransfer(transfer);

    expect(result).toEqual({ success: true });
    expect(ledger.accounts.get("1111234522226789").balance).toBe(70);
    expect(ledger.accounts.get("1111234522221234").balance).toBe(80);
  });

  it("rejects transfers with invalid amounts and unknown accounts", () => {
    const ledger = new Ledger([["1111234522226789", 100]]);

    expect(
      ledger.applyTransfer(new Transfer("1111234522226789", "9999999999999999", 10)),
    ).toEqual({
      success: false,
      reason: "unknown account referenced",
    });

    expect(
      ledger.applyTransfer(new Transfer("1111234522226789", "1111234522226789", 0)),
    ).toEqual({
      success: false,
      reason: "amount must be greater than zero",
    });
  });

  it("rejects transfers when the source account has insufficient funds", () => {
    const ledger = new Ledger([
      ["1111234522226789", 50],
      ["1111234522221234", 10],
    ]);
    const transfer = new Transfer("1111234522226789", "1111234522221234", 60);

    expect(ledger.applyTransfer(transfer)).toEqual({
      success: false,
      reason: "insufficient funds",
    });
  });

  it("returns final balances sorted by id and rounded to two decimals", () => {
    const ledger = new Ledger([
      ["1111234522221234", 10.005],
      ["1111234522226789", 5.555],
    ]);

    expect(ledger.getFinalBalances()).toEqual([
      { id: "1111234522221234", balance: 10.01 },
      { id: "1111234522226789", balance: 5.56 },
    ]);
  });
});
