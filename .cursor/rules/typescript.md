---
description: TypeScript coding standards and best practices for this project
globs: ["**/*.{ts,tsx}"]
alwaysApply: true
---

# TypeScript Guidelines

## Core Principles

- Write TypeScript-first code.
- Prefer strong, explicit types over `any`.
- Keep types close to the code that owns them.
- Prefer simple types over complex type-level programming.
- Reuse existing types before creating new ones.
- Follow the existing project's TypeScript conventions.
- Do not introduce unnecessary abstractions solely for type safety.
- Favor readability over cleverness.

## Strict Type Safety

- Do not use `any` unless there is a documented and justified reason.
- Prefer `unknown` when the type is genuinely unknown.
- Narrow `unknown` before using it.
- Avoid unsafe type assertions.
- Avoid `as any`.
- Avoid double assertions such as `value as unknown as SomeType` unless absolutely necessary.
- Do not suppress TypeScript errors with `@ts-ignore`.
- Prefer `@ts-expect-error` only when an error is intentional, understood, and documented.
- Never disable type checking to make code compile.

Avoid:

```ts
const user = response.data as any;