const { loadLedgerFromBalanceFile, readTransferCsv } = require("./helper/csv");

function formatRejectedTransfer(transfer, reason) {
  return `Rejected transfer ${transfer.fromAccountId} -> ${transfer.toAccountId} (${transfer.amount.toFixed(2)}): ${reason}`;
}

function logBalances(balances, logger) {
  for (const balance of balances) {
    logger.log(`${balance.id},${balance.balance.toFixed(2)}`);
  }
}

function processTransfers(balanceFilePath, transferFilePath, logger = console) {
  const ledger = loadLedgerFromBalanceFile(balanceFilePath);
  const transfers = readTransferCsv(transferFilePath);

  for (const transfer of transfers) {
    const result = ledger.applyTransfer(transfer);

    if (!result.success) {
      logger.error(formatRejectedTransfer(transfer, result.reason));
    }
  }

  const balances = ledger.getFinalBalances();
  logBalances(balances, logger);

  return balances;
}

module.exports = { processTransfers, formatRejectedTransfer, logBalances };
