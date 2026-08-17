---
name: react-native-performance
description: Diagnose and improve React Native performance, rendering, memory usage, animations, lists, startup time, and native interactions.
---

# React Native Performance

Optimize based on evidence rather than assumptions.

## Rendering

Investigate:

- Excessive component renders
- Unstable props
- Large component trees
- Unnecessary context updates
- Incorrect state ownership

Do not automatically add memoization.

## Lists

For large lists:

- Use FlatList or the project's optimized list implementation.
- Provide stable keys.
- Avoid expensive renderItem operations.
- Avoid unnecessary inline allocations.
- Configure virtualization appropriately.

Do not use ScrollView for large dynamic lists.

## Images

Consider:

- Image dimensions
- Memory usage
- Caching
- Compression
- Appropriate formats
- Lazy loading

Avoid loading unnecessarily large images.

## Animations

Prefer React Native/Reanimated mechanisms appropriate to the project.

Avoid performing expensive JavaScript work during animations.

Keep animations smooth on lower-end devices.

## Effects

Audit `useEffect` carefully.

Avoid effects for:

- Derived values
- Simple calculations
- State synchronization that can be avoided

Every effect should have a clear external synchronization purpose.

## Memory

Check:

- Event listeners
- Subscriptions
- Timers
- Native resources
- Large cached objects
- Image resources

Ensure cleanup occurs when required.

## Measurement

When possible, compare:

- Render counts
- Startup time
- Frame rate
- Memory usage
- Bundle size

Do not claim a performance improvement without evidence.