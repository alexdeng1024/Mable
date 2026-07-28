const { readFileSync } = require('fs');
const { Ledger } = require('./domain/ledger');
const { Transfer } = require('./domain/transfer');

function parseCsvLines(filePath, expectedColumns, parser) {
  const contents = readFileSync(filePath, 'utf8');
  const lines = contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines.map((line, index) => {
    const columns = line.split(',').map((value) => value.trim());

    if (columns.length !== expectedColumns) {
      throw new Error(`Invalid CSV row in ${filePath} at line ${index + 1}`);
    }

    return parser(columns, index + 1);
  });
}

function readBalanceCsv(filePath) {
  const balances = new Map();

  for (const columns of parseCsvLines(filePath, 2, (values) => values)) {
    const accountId = columns[0];
    const balance = Number(columns[1]);

    if (!Number.isFinite(balance)) {
      throw new Error(`Invalid balance value for account ${accountId}`);
    }

    balances.set(accountId, balance);
  }

  return balances;
}

function readTransferCsv(filePath) {
  return parseCsvLines(filePath, 3, (columns) => {
    const amount = Number(columns[2]);

    if (!Number.isFinite(amount)) {
      throw new Error(`Invalid transfer amount ${columns[2]}`);
    }

    return new Transfer(columns[0], columns[1], amount);
  });
}

function loadLedgerFromBalanceFile(filePath) {
  return new Ledger(readBalanceCsv(filePath));
}

module.exports = { readBalanceCsv, readTransferCsv, loadLedgerFromBalanceFile };
