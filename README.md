# Mable Banking Transfer Processor

This project implements a small banking transfer processor for the Mable backend code challenge. It loads account balances from a CSV file, applies a day’s worth of transfers, and prints the resulting balances.

## How to run

### Prerequisites

- Node.js installed on your machine

### Install dependencies

```bash
npm install
```

### Run the program

By default, the program uses the example files in the requirements folder:

```bash
node src/index.js
```

You can also provide your own input files:

```bash
node src/index.js path/to/balances.csv path/to/transfers.csv
```

### Run tests

```bash
npm test
```

## Architecture

The project follows a simple layered structure:

- src/app.js
  - Orchestrates the end-to-end transfer processing flow.
- src/helper/csv.js
  - Reads and parses CSV files into domain objects.
- src/domain/
  - Contains the core domain model classes:
    - Account: represents a customer account with a balance and basic deposit/withdraw operations.
    - Transfer: represents a single transfer between two accounts.
    - Ledger: applies transfers, enforces balance rules, and produces final balances.
- src/index.js
  - CLI entrypoint that resolves input files and starts the processing flow.

## Domain objects

- Account
  - Stores an account ID and balance.
  - Supports deposit and withdrawal operations.
  - Enforces the requirement that account IDs are 16-digit numbers.

- Transfer
  - Represents a single transfer from one account to another with an amount.

- Ledger
  - Holds the accounts for a company.
  - Applies transfers in order.
  - Rejects transfers that are invalid, exceed available funds, or use unknown accounts.

## Development approach

This project was developed with [OpenSpec](https://openspec.dev), which is used to describe and manage small, structured changes to the codebase.

The OpenSpec files live under the openspec folder and document the intended behavior and implementation plan for the transfer processor. This helps keep the project aligned with the original requirements and makes it easier to evolve incrementally.

## Notes

The sample input files used by the default run are:

- requirements/mable_account_balances.csv
- requirements/mable_transactions.csv
