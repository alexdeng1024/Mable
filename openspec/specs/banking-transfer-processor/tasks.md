# Tasks: Banking Transfer Processor

This task list maps the spec to a small set of actionable items that match the current repository.

1. Implement core application (done)
   - Files: src/domain/*.js, src/csv.js, src/app.js, src/index.js
   - Tests: src/__tests__/ledger.test.js
   - Description: Core Node.js implementation that reads CSVs, applies transfers in order, rejects invalid transfers, and prints final balances. (Already implemented in the repo.)

2. Document usage and examples
   - Files: README.md (project root), openspec/specs/banking-transfer-processor/spec.md
   - Description: Add a short README with run/test instructions and example invocation. Capture sample input file locations.
   - Estimate: 10–20 minutes

3. Expand test coverage for edge-cases
   - Files: src/__tests__/ledger.test.js (update)
   - Description: Add tests for invalid amount (0 and negative), invalid CSV row formats (wrong column counts), and amount value parsing errors.
   - Estimate: 30–60 minutes

4. Add CLI flags and output mode (optional)
   - Files: src/index.js, src/app.js
   - Description: Add flags such as `--output json|csv`, `--dry-run` and `--quiet`. Adjust logger usage accordingly.
   - Estimate: 1–2 hours

5. Add CI (optional)
   - Files: .github/workflows/ci.yml
   - Description: Create a simple workflow that runs `npm ci` and `npm test` on push and PRs.
   - Estimate: 30–45 minutes

Task statuses
- Task 1: Done (implementation already converted to Node.js)
- Task 2: Pending – will create README.md on request
- Task 3: Pending – additional tests can be added on request
- Task 4/5: Optional – proceed if desired

How to claim a task
- Reply with the task number(s) you want executed. For larger tasks, I will create a small plan and implement changes.
