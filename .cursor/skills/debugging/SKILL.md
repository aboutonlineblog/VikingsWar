This prevents Cursor from immediately making random changes when something breaks.

```markdown
---
name: debugging
description: Systematic debugging workflow for React Native errors, crashes, build failures, runtime issues, performance problems, and unexpected behavior.
---

# Debugging Workflow

Do not immediately modify code based on assumptions.

## 1. Reproduce

First determine:

- Exact error message
- Platform: iOS, Android, or both
- Development or production
- Reproduction steps
- Whether the problem is deterministic
- Recent changes related to the failure

## 2. Identify the Failure Layer

Determine whether the issue belongs to:

- JavaScript/TypeScript
- React rendering
- Navigation
- Native iOS
- Native Android
- Metro
- Gradle
- Xcode
- Dependency/version compatibility
- Network/API
- State management
- Build environment

## 3. Inspect Evidence

Use:

- Stack traces
- Logs
- Error boundaries
- Native crash logs
- Metro output
- Xcode logs
- Android Logcat
- Git diff
- Recent commits

Prefer evidence over assumptions.

## 4. Form a Hypothesis

Before changing code, identify the most likely root cause.

If multiple causes are plausible, rank them.

## 5. Minimal Fix

Make the smallest change that addresses the root cause.

Do not:

- Rewrite unrelated code
- Upgrade dependencies unnecessarily
- Disable linting/type checking
- Add arbitrary timeouts
- Suppress errors
- Add retries without understanding the failure

## 6. Verify

After the fix:

- Reproduce the original failure.
- Run the relevant tests.
- Run TypeScript checks.
- Verify both platforms when applicable.
- Check for regressions.

## 7. Explain

When reporting the fix, explain:

1. Root cause
2. Why it happened
3. What changed
4. How it was verified