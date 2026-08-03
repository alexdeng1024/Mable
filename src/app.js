const { loadLedgerFromBalanceFile, readTransferCsv } = require("./helper/csv");

function processTransfers(balanceFilePath, transferFilePath, logger = console) {
  const ledger = loadLedgerFromBalanceFile(balanceFilePath);
  const transfers = readTransferCsv(transferFilePath);

  for (const transfer of transfers) {
    const result = ledger.applyTransfer(transfer);

    if (!result.success) {
      logger.error(
        `Rejected transfer ${transfer.fromAccountId} -> ${transfer.toAccountId} (${transfer.amount.toFixed(2)}): ${result.reason}`,
      );
    }
  }

  const balances = ledger.getFinalBalances();

  for (const balance of balances) {
    logger.log(`${balance.id},${balance.balance.toFixed(2)}`);
  }

  return balances;
}

module.exports = { processTransfers };
