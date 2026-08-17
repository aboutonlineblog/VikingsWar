---
name: code-review
description: Perform thorough React Native code reviews focusing on correctness, architecture, performance, security, maintainability, and testing.
---

# React Native Code Review

Review code systematically.

## Priority

Identify issues in this order:

1. Correctness
2. Security
3. Data loss / destructive behavior
4. Crashes
5. Performance
6. Architecture
7. Maintainability
8. Testing
9. Style

Do not focus on formatting issues while missing functional problems.

## React Native

Check for:

- Unnecessary re-renders
- Incorrect effects
- Stale closures
- Incorrect dependency arrays
- Memory leaks
- Event listener cleanup
- Timer cleanup
- Subscription cleanup
- Large list performance
- Excessive bridge/native calls
- Incorrect platform-specific behavior

## TypeScript

Check for:

- `any`
- Unsafe casts
- Missing null handling
- Incorrect optional properties
- Incorrect API types
- Type assertions hiding bugs

Prefer accurate types over suppressing TypeScript errors.

## State

Check whether state belongs in:

- Local component state
- Context
- Server state
- Global client state

Do not introduce global state unnecessarily.

## TanStack Query

Check:

- Query keys
- Cache invalidation
- Stale time
- Garbage collection configuration
- Mutation handling
- Optimistic updates
- Error handling
- Query duplication
- Unnecessary manual fetching

## API

Check:

- Request validation
- Response validation where appropriate
- Error handling
- Authentication
- Sensitive data exposure
- Retry behavior
- Race conditions

## Testing

Check whether important behavior is covered.

Prioritize tests around:

- Business logic
- User interactions
- Error handling
- Critical workflows
- Regression-prone behavior

## Review Output

For each issue include:

- Severity
- File/location
- Problem
- Why it matters
- Recommended fix

Do not report speculative issues as definite bugs.