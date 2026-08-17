# Refactor

Refactor the selected code without changing its behavior.

Before changing anything:

- Understand the current behavior.
- Inspect call sites.
- Inspect tests.
- Identify dependencies.
- Identify platform-specific behavior.

Prioritize:

- Simpler code
- Better separation of responsibilities
- Improved type safety
- Reduced duplication
- Improved maintainability

Do not:

- Rewrite unnecessarily.
- Change public APIs without justification.
- Change business behavior.
- Introduce unnecessary dependencies.

Run relevant tests and type checking after the refactor.