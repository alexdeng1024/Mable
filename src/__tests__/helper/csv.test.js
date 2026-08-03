const { mkdtempSync, writeFileSync, rmSync } = require("fs");
const os = require("os");
const path = require("path");
const {
  readBalanceCsv,
  readTransferCsv,
  loadLedgerFromBalanceFile,
} = require("../../helper/csv");

describe("CSV helpers", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(os.tmpdir(), "mable-csv-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("reads balance rows into a map", () => {
    const filePath = path.join(tempDir, "balances.csv");
    writeFileSync(filePath, "acct-1,100\nacct-2,50.5\n");

    const balances = readBalanceCsv(filePath);

    expect(balances.get("acct-1")).toBe(100);
    expect(balances.get("acct-2")).toBe(50.5);
  });

  it("reads transfer rows into Transfer instances", () => {
    const filePath = path.join(tempDir, "transfers.csv");
    writeFileSync(filePath, "acct-1,acct-2,25\nacct-2,acct-3,10.5\n");

    const transfers = readTransferCsv(filePath);

    expect(transfers).toHaveLength(2);
    expect(transfers[0]).toMatchObject({
      fromAccountId: "acct-1",
      toAccountId: "acct-2",
      amount: 25,
    });
    expect(transfers[1].amount).toBe(10.5);
  });

  it("loads a ledger from a balance file", () => {
    const filePath = path.join(tempDir, "balances.csv");
    writeFileSync(filePath, "acct-1,100\nacct-2,50\n");

    const ledger = loadLedgerFromBalanceFile(filePath);

    expect(ledger.accounts.get("acct-1").balance).toBe(100);
    expect(ledger.accounts.get("acct-2").balance).toBe(50);
  });

  it("throws when a CSV row has the wrong number of columns", () => {
    const filePath = path.join(tempDir, "bad.csv");
    writeFileSync(filePath, "acct-1,100,extra\n");

    expect(() => readBalanceCsv(filePath)).toThrow(
      "Invalid CSV row in " + filePath + " at line 1",
    );
  });

  it("throws when a balance value is not numeric", () => {
    const filePath = path.join(tempDir, "bad-balance.csv");
    writeFileSync(filePath, "acct-1,not-a-number\n");

    expect(() => readBalanceCsv(filePath)).toThrow(
      "Invalid balance value for account acct-1",
    );
  });

  it("throws when a transfer amount is not numeric", () => {
    const filePath = path.join(tempDir, "bad-transfer.csv");
    writeFileSync(filePath, "acct-1,acct-2,abc\n");

    expect(() => readTransferCsv(filePath)).toThrow(
      "Invalid transfer amount abc",
    );
  });
});
