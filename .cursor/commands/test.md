# Add Tests

Analyze the selected code and determine the appropriate testing strategy.

Prefer:

- Unit tests for pure logic
- Component tests for UI behavior
- Integration tests for feature workflows
- E2E tests for critical user journeys

Tests must verify behavior rather than implementation details.

Cover where applicable:

- Happy path
- Error state
- Loading state
- Empty state
- User interactions
- Edge cases
- Regression scenarios

Avoid:

- Arbitrary sleeps
- Excessive mocking
- Testing private implementation details
- Brittle selectors

After implementing tests, run the relevant test suite.