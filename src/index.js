const path = require("path");
const { existsSync } = require("fs");
const { processTransfers } = require("./app");

function resolveInputPath(providedArgument, defaultFileName) {
  const candidates = [];

  if (providedArgument) {
    candidates.push(path.resolve(process.cwd(), providedArgument));
  }

  candidates.push(
    path.resolve(process.cwd(), "../requirements", defaultFileName),
  );

  return (
    candidates.find((candidate) => existsSync(candidate)) ||
    candidates[candidates.length - 1]
  );
}

function main() {
  const balanceFilePath = resolveInputPath(
    process.argv[2],
    "mable_account_balances.csv",
  );
  const transferFilePath = resolveInputPath(
    process.argv[3],
    "mable_transactions.csv",
  );

  processTransfers(balanceFilePath, transferFilePath);
}

if (require.main === module) {
  main();
}

module.exports = { main };
