# Implement Feature

Implement the requested React Native feature.

## Process

1. Understand the requirement.
2. Inspect the existing architecture and related code.
3. Identify reusable components, hooks, services, and utilities.
4. Create an implementation plan before making changes.
5. Follow the project's architecture rules.
6. Use TypeScript strictly.
7. Use TanStack Query for server state.
8. Keep business logic outside presentational components where practical.
9. Handle loading, error, empty, and success states.
10. Add appropriate tests.
11. Run type checking and linting.
12. Review the final diff for unrelated changes.

Do not:

- Rewrite unrelated code.
- Introduce unnecessary dependencies.
- Create duplicate abstractions.
- Use `any` to bypass type errors.
- Modify architecture without justification.

Before finishing, summarize:
- Files changed
- What was implemented
- Tests added
- Verification performed
- Any remaining concerns