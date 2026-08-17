---
name: firebase
description: Firebase development workflow for React Native, including Firebase Authentication, Firestore, Storage, Cloud Messaging, Analytics, and Crashlytics.
---

# Firebase Development

Follow the project's Firebase architecture and existing implementation patterns.

## Architecture

Prefer:

Component
→ Hook
→ Firebase service
→ Firebase SDK

Do not put Firebase SDK calls directly inside screens unless the operation is trivial and follows an established project pattern.

## Authentication

Authentication logic should be encapsulated in an authentication service/hook.

Handle:

- Sign in
- Sign out
- Session restoration
- Authentication state changes
- Authentication errors
- Account deletion where applicable

Do not expose authentication tokens through logs.

## Firestore

Keep Firestore access in services/repositories.

Define explicit TypeScript types for Firestore documents.

Avoid scattering collection names throughout the application.

Prefer centralized references/constants.

Consider:

- Query indexes
- Pagination
- Query limits
- Offline behavior
- Listener lifecycle
- Cache behavior

Avoid unnecessary real-time listeners.

## TanStack Query

When Firebase data is treated as server state:

Component
→ TanStack Query hook
→ Firebase service
→ Firestore

Use TanStack Query for appropriate server-state lifecycle management.

Do not duplicate Firebase caching logic unnecessarily.

## Cloud Messaging

Handle:

- Permission state
- Device token registration
- Token refresh
- Foreground messages
- Background messages
- Notification interactions

Keep notification handling separate from UI components.

## Storage

Validate:

- File type
- File size
- Upload errors
- Download errors
- Authentication state

Do not allow unrestricted client-side uploads.

## Security

Never:

- Hardcode secrets
- Log authentication tokens
- Trust client-side authorization
- Store sensitive information unnecessarily
- Assume Firestore security rules are optional

Client-side validation must not replace Firebase Security Rules.

## Testing

Mock Firebase at the appropriate boundary.

Do not make production Firebase requests from unit tests.

Test:

- Authentication behavior
- Firestore services
- Error handling
- Data transformations
- Important user workflows

## Verification

After Firebase changes:

- Run TypeScript checks.
- Run linting.
- Run relevant tests.
- Verify iOS.
- Verify Android.
- Verify Firebase configuration for the target environment.