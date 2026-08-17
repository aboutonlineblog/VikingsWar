# Debug React Native Issue

Investigate the issue systematically.

Determine first whether the problem is related to:

- JavaScript/TypeScript
- React rendering
- Navigation
- State management
- TanStack Query
- Metro
- iOS native code
- Android native code
- Xcode
- Gradle
- Network/API
- Dependency compatibility
- Performance

Inspect logs, stack traces, git changes, and relevant source code.

Do not modify code until there is a reasonable hypothesis.

Prefer the smallest change that addresses the root cause.

After the fix:

- Reproduce the original problem.
- Run relevant tests.
- Run type checking.
- Run linting.
- Verify platform-specific behavior when applicable.