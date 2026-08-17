---
name: testing
description: Design and implement robust tests for React Native applications using the project's testing stack.
---

# Testing Workflow

Tests should verify behavior, not implementation details.

## Test Pyramid

Prefer:

1. Unit tests for pure logic
2. Component/integration tests for UI behavior
3. E2E tests for critical user journeys

## Unit Tests

Use for:

- Business logic
- Utilities
- Data transformations
- Validation
- Complex calculations

## Component Tests

Test:

- Rendering
- User interactions
- Loading states
- Error states
- Empty states
- Accessibility behavior

Avoid asserting internal implementation details.

## E2E

Use E2E tests for critical workflows such as:

- Authentication
- Registration
- Checkout/payment
- Core content creation
- Navigation
- Critical user journeys

## Test Quality

Tests should:

- Be deterministic
- Be isolated
- Have clear names
- Avoid unnecessary mocking
- Avoid arbitrary sleeps
- Avoid testing implementation details

Prefer explicit waits based on observable state.

## Regression

When fixing a bug:

1. Reproduce it.
2. Add a regression test.
3. Fix the bug.
4. Verify the test fails before the fix when practical.
5. Verify it passes after the fix.