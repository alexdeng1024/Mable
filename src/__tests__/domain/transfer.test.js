const { Transfer } = require("../../domain/transfer");

describe("Transfer", () => {
  it("stores the transfer details", () => {
    const transfer = new Transfer("from-id", "to-id", 50);

    expect(transfer.fromAccountId).toBe("from-id");
    expect(transfer.toAccountId).toBe("to-id");
    expect(transfer.amount).toBe(50);
  });
});
