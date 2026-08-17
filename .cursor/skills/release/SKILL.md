---
name: release
description: Prepare and validate React Native applications for iOS and Android release.
---

# Release Workflow

Before release:

## Code

- Type check
- Lint
- Unit tests
- Integration tests
- E2E tests for critical flows

## iOS

Verify:

- Release configuration
- Bundle identifier
- Version
- Build number
- Signing
- Provisioning
- Entitlements
- Permissions
- Privacy declarations
- App Store configuration

## Android

Verify:

- Application ID
- Version code
- Version name
- Signing
- Release build
- Permissions
- Target SDK
- ProGuard/R8 configuration
- Play Console requirements

## Environment

Verify:

- Production API endpoints
- Environment variables
- Feature flags
- Analytics
- Crash reporting
- Push notifications

Never expose secrets in the application bundle.

## Final Verification

Perform a clean release build.

Do not consider the release ready based only on a successful development build.