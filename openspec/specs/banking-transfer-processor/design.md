# Design: Banking Transfer Processor

## Overview
This document describes the design of a simple command-line banking transfer processor that implements the requirements in spec.md. The system is intentionally small and single-process: CSV inputs are parsed, transfers are applied in order, invalid transfers are rejected and logged, and final balances are printed.

## Components
- CLI entrypoint: src/index.js
  - Resolves input paths (command-line args or defaults to requirements/)
  - Invokes the processor and exits

- CSV parsing: src/csv.js
  - Lightweight parser that reads files line-by-line into arrays of columns
  - Exposes:
    - readBalanceCsv(filePath): Map<accountId, number>
    - readTransferCsv(filePath): Transfer[]
    - loadLedgerFromBalanceFile(filePath): Ledger

- Domain model: src/domain/
  - Account: encapsulates id and balance operations (deposit/withdraw)
  - Transfer: immutable value object (fromAccountId, toAccountId, amount)
  - Ledger: owns accounts and applies Transfer objects in order. Validates:
    - amount > 0
    - accounts exist
    - sufficient funds
  - applyTransfer returns result { success: boolean, reason?: string }

- Application orchestration: src/app.js
  - Loads the ledger
  - Iterates transfers in file order, applies them, and logs rejected transfers
  - Prints final balances

## Data formats
- Balance CSV: account_id,balance (e.g., 1111234522226789,5000.00)
- Transfer CSV: from_account_id,to_account_id,amount (e.g., 1111234522226789,1212343433335665,500.00)
- Final balances printed as: account_id,NNNNN.NN (two decimal places)

## Error reporting
- Rejected transfers are reported via the configured logger (defaults to console). Message format:
  Rejected transfer <from> -> <to> (<amount>): <reason>
  Example: Rejected transfer 1111234522226789 -> 9999999999999999 (100.00): unknown account referenced

- CSV parsing errors throw and abort the run (fail-fast). For production usage, the parser could be extended to collect row-level errors instead.

## Ordering and consistency
- Transfers are applied strictly in file order.
- The Ledger enforces correctness per-transfer; there is no batch-validation pass prior to execution.

## Testing strategy
- Unit tests (Jest) cover:
  - Successful transfers and final balances
  - Rejected transfers due to unknown account
  - Rejected transfers due to insufficient funds
  - Rejected transfers due to invalid amounts (<= 0)
  - CSV parsing edge cases (invalid rows) as needed

- Tests are implemented in src/__tests__/ledger.test.js and use temporary files to exercise CSV parsing and the orchestration path.

## Extension points
- Add an output mode to produce JSON or a CSV file of final balances.
- Add a dry-run mode that validates a full batch without mutating state.
- Add concurrency or streaming support for very large files (requires revisiting ordering guarantees).

## Implementation notes
- Keep the implementation dependency-free (Node.js standard library + Jest for tests).
- Keep numeric operations in native Number; format to 2 decimal places only for output.

