
---

# 5. `refactoring/SKILL.md`

This is useful when asking Cursor:

> "Refactor this component."

```markdown
---
name: refactoring
description: Safely refactor React Native code while preserving behavior, APIs, architecture, and tests.
---

# Refactoring Workflow

The primary goal is to improve code without changing behavior.

## Before Refactoring

Understand:

- Current behavior
- Public interfaces
- Call sites
- Tests
- Dependencies
- Platform-specific behavior

## Rules

Prefer:

- Small incremental changes
- Removing duplication
- Clear naming
- Smaller responsibilities
- Stronger typing
- Better separation of concerns

Avoid:

- Unnecessary rewrites
- Changing behavior unintentionally
- Introducing new dependencies without justification
- Changing public APIs unnecessarily

## Preserve Behavior

Unless explicitly requested, do not change:

- Business logic
- API contracts
- Navigation behavior
- User-visible behavior
- Error behavior
- Analytics behavior

## Verification

After refactoring:

- Type check
- Lint
- Run affected tests
- Verify affected screens
- Review git diff

A refactor is not complete until behavior has been verified.