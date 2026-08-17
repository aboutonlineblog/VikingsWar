# Create Custom Hook

Create a focused React hook following the project's conventions.

Before creating it:

- Search for existing hooks with similar responsibilities.
- Determine whether the logic actually needs a hook.
- Avoid duplicating existing functionality.

For server state:

- Use TanStack Query.
- Define stable query keys.
- Keep API calls in services.
- Handle loading and error states.
- Configure caching intentionally.

For mutations:

- Use useMutation.
- Invalidate or update affected queries.
- Implement optimistic updates only when appropriate.

Avoid creating "god hooks" containing unrelated responsibilities.

Add tests for non-trivial behavior.