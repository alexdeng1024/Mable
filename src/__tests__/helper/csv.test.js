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
    writeFileSync(filePath, "1111234522226789,100\n1111234522221234,50.5\n");

    const balances = readBalanceCsv(filePath);

    expect(balances.get("1111234522226789")).toBe(100);
    expect(balances.get("1111234522221234")).toBe(50.5);
  });

  it("reads transfer rows into Transfer instances", () => {
    const filePath = path.join(tempDir, "transfers.csv");
    writeFileSync(
      filePath,
      "1111234522226789,1111234522221234,25\n1111234522221234,1212343433335665,10.5\n",
    );

    const transfers = readTransferCsv(filePath);

    expect(transfers).toHaveLength(2);
    expect(transfers[0]).toMatchObject({
      fromAccountId: "1111234522226789",
      toAccountId: "1111234522221234",
      amount: 25,
    });
    expect(transfers[1].amount).toBe(10.5);
  });

  it("loads a ledger from a balance file", () => {
    const filePath = path.join(tempDir, "balances.csv");
    writeFileSync(filePath, "1111234522226789,100\n1111234522221234,50\n");

    const ledger = loadLedgerFromBalanceFile(filePath);

    expect(ledger.accounts.get("1111234522226789").balance).toBe(100);
    expect(ledger.accounts.get("1111234522221234").balance).toBe(50);
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
    writeFileSync(filePath, "1111234522226789,not-a-number\n");

    expect(() => readBalanceCsv(filePath)).toThrow(
      "Invalid balance value for account 1111234522226789",
    );
  });

  it("throws when a transfer amount is not numeric", () => {
    const filePath = path.join(tempDir, "bad-transfer.csv");
    writeFileSync(filePath, "1111234522226789,1111234522221234,abc\n");

    expect(() => readTransferCsv(filePath)).toThrow(
      "Invalid transfer amount abc",
    );
  });

  it("throws when account ids are not 16-digit numbers", () => {
    const filePath = path.join(tempDir, "bad-account.csv");
    writeFileSync(filePath, "acct-1,100\n");

    expect(() => readBalanceCsv(filePath)).toThrow("Invalid account id acct-1");
  });
});
