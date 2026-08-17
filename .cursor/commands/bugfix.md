# Fix Bug

Fix the reported bug using a root-cause-first approach.

## Process

1. Reproduce or understand the failure.
2. Inspect the relevant code and recent changes.
3. Identify the likely root cause.
4. Explain the hypothesis before making substantial changes.
5. Implement the smallest appropriate fix.
6. Add or update a regression test.
7. Run relevant tests.
8. Run TypeScript validation.
9. Run linting.
10. Review the diff.

Do not:

- Hide errors.
- Add arbitrary delays.
- Disable lint/type checking.
- Upgrade dependencies unless necessary.
- Rewrite unrelated code.

The final response must include:

- Root cause
- Fix
- Regression test
- Verification