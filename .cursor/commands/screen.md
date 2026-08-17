# Create React Native Screen

Create a production-ready React Native screen.

Follow the project's existing navigation and feature architecture.

Structure the screen around:

- Screen container
- Feature components
- Custom hooks
- Server-state hooks
- Local UI state
- Navigation
- Loading state
- Error state
- Empty state

Do not place API implementation directly inside the screen.

Use TanStack Query for server state.

Keep business logic out of the screen when it can be encapsulated cleanly in hooks or services.

Add appropriate tests.

Verify iOS and Android behavior where platform differences exist.