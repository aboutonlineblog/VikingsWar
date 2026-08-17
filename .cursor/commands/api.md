# Implement API Integration

Implement the requested API integration following the project's service architecture.

Architecture:

Component
→ Hook
→ TanStack Query
→ Service
→ API Client

Requirements:

- Strongly typed request/response models.
- No `any`.
- Stable TanStack Query keys.
- Correct cache behavior.
- Proper mutation invalidation.
- Proper error handling.
- Authentication handling where required.

Never:

- Put API implementation directly in components.
- Hardcode credentials.
- Log authentication tokens.
- Store secrets in source code.
- Reimplement caching manually when TanStack Query can handle it.

Add appropriate tests.