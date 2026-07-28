# Banking Transfer Processor

## Summary
Implement a command-line application that loads account balances from a CSV file, applies a day's transfer operations from a second CSV file, and prints the final balances for each account.

## Functional requirements
- The application must read account balances from a CSV file containing `account_id,balance` rows.
- The application must read transfer operations from a CSV file containing `from_account_id,to_account_id,amount` rows.
- Transfers must be processed in the order they appear in the input file.
- A transfer must be rejected if the transfer amount is less than or equal to zero.
- A transfer must be rejected if either account does not exist.
- A transfer must be rejected if the source account does not have enough balance to cover the transfer.
- Rejected transfers must be reported to the console with an error message.
- Accepted transfers must update the balances of the source and destination accounts.
- After processing all transfers, the application must print the final balance for each account.

## Non-functional requirements
- The application must be implemented in Node.js using CommonJS.
- The implementation must include automated unit tests using Jest.
- The application must support running from the command line with the two CSV files as input arguments.
- If no input paths are provided, the application should use the sample CSV files in the `requirements` directory.
