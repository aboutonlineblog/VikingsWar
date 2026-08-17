# Evaluate Dependency Change

Before adding, removing, or upgrading a dependency:

1. Check whether the functionality already exists in the project.
2. Inspect package.json and lockfile.
3. Check compatibility with the current React Native version.
4. Check iOS requirements.
5. Check Android requirements.
6. Check peer dependencies.
7. Consider bundle size and runtime cost.
8. Consider maintenance status.
9. Identify breaking changes.
10. Identify native configuration changes.

Do not upgrade unrelated dependencies.

Prefer the smallest dependency change necessary.

After changing dependencies:

- Install dependencies.
- Verify iOS.
- Verify Android.
- Run TypeScript checks.
- Run tests.
- Run the appropriate build.