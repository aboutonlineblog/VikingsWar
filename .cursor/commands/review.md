# Code Review

Review the selected code for production readiness.

Prioritize:

1. Correctness
2. Security
3. Crashes
4. Data integrity
5. Performance
6. Architecture
7. Maintainability
8. Testing

Check specifically for React Native issues:

- Unnecessary re-renders
- Incorrect useEffect dependencies
- Stale closures
- Memory leaks
- Missing cleanup
- List performance problems
- Platform-specific issues
- Native resource leaks

Check TypeScript for:

- `any`
- Unsafe type assertions
- Missing null handling
- Incorrect API types
- Suppressed compiler errors

Check TanStack Query for:

- Incorrect query keys
- Incorrect cache invalidation
- Duplicate requests
- Incorrect mutation handling
- Stale data problems
- Unnecessary manual caching

Do not report stylistic issues unless they materially affect maintainability.

For every finding provide:

- Severity
- File and location
- Problem
- Why it matters
- Recommended fix

If no significant issues are found, say so explicitly.