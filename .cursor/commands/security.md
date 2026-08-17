# Security Review

Review the selected React Native code for security issues.

Check for:

- Hardcoded secrets
- API keys
- Authentication tokens
- Sensitive logging
- Insecure storage
- Unsafe deep links
- Improper URL handling
- WebView vulnerabilities
- Unvalidated external input
- Sensitive data exposure
- Weak authentication handling

Never expose secrets in client-side code.

Do not recommend security changes that break the application's legitimate functionality without explaining the tradeoff.

Report:

- Severity
- Location
- Vulnerability
- Impact
- Recommended remediation