Migration Status
Clear Log
[17:39:32] Photos API Error [403]:
{
  "code": 403,
  "message": "Request had insufficient authentication scopes.",
  "status": "PERMISSION_DENIED"
}
[17:39:31] Fetching videos from Google Photos...
[17:39:31] Go to Google Cloud Console > APIs & Services > Enabled APIs & Services, click "+ ENABLE APIS AND SERVICES", search for "Google Photos Library API" and enable it.
[17:39:31] CRITICAL: If scopes are correct but this fails, the API is likely NOT ENABLED.
[17:39:31] ❌ Albums fetch failed [403]: {"code":403,"message":"Request had insufficient authentication scopes.","status":"PERMISSION_DENIED"}
[17:39:30] Testing Albums Permissions...
[17:39:30] ✅ Baseline API access confirmed. Token is valid and functional.
[17:39:30] Testing Baseline API Access (UserInfo)...
[17:39:30] ✅ Token scopes look correct on backend.
[17:39:30] 👉 ACTION CHECK: Does the email above match your "Test Users" list EXACTLY?
[17:39:30] Token Diagnostics:
Email: kuancheen@gmail.com
Audience: 1083173128138-q331knp5h2n1f2efantse0g4pv66nmn8.apps.googleusercontent.com
Scopes: https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.upload openid
Expires: 1766745569
[17:39:30] Running diagnostics...
[17:39:30] Granted permissions:
email https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/photoslibrary.readonly
[17:39:30] Authentication successful!
[17:39:16] System initialized.
Ready to initialize...# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.16 (Beta)] - 2025-12-27
### Added
- **Configuration Audit**: Added a specific "Double Failure" modal. If both API Key transmission methods fail, the app now halts and provides a strict 3-point checklist to verify Google Cloud Console settings (API restrictions, Library vs Picker API, Test Users).

## [0.2.15 (Beta)] - 2025-12-27
### Added
- **Diagnostics**: Implemented Permutation Testing for API connection (testing both URL-based and Header-based API Key transmission).
- **Core Fix**: Added `X-Goog-Api-Key` header to all Photos API requests as a fail-safe.
- **Troubleshooting**: Enhanced logging to distinguish between method failures.

## [0.2.14 (Beta)] - 2025-12-26
### Changed
- **Troubleshooting**: Reverted to `photoslibrary.readonly` scope. The "Full Access" experiment confirmed that scope escalation does not bypass the 403 error. Now that we have a valid API Key (which we didn't have during the first `readonly` test), we are re-testing the `readonly` scope as the most compliant configuration for an unverified app.

## [0.2.13 (Beta)] - 2025-12-26
### Changed
- **Troubleshooting**: Escalated to the full `photoslibrary` scope (Read/Write) to bypass potential restrictions on the `readonly` scope for new/unverified projects.
- **Config**: Added explicit logging of the *requested* scopes on initialization to verify that the app is running the correct version and config.

## [0.2.12 (Beta)] - 2025-12-26
### Changed
- **Troubleshooting**: Removed `youtube.upload` scope (again). Now that the API Key (Quota Project) is correctly identified, we are testing if the *presence* of the billing-heavy YouTube scope is causing "Insufficient Scope" errors for the shared token on the Photos API.

## [0.2.11 (Beta)] - 2025-12-26
### Fixed
- **Code Application**: Re-applied the logic fixes for **API Key Prompt** and **API_KEY_INVALID Handler**. Previous deployment (v0.2.10) failed to apply these changes to the source code despite the version bump.
- **Config**: The app now properly pauses during initialization to request missing Client ID and API Key credentials.

## [0.2.10 (Beta)] - 2025-12-26
### Changed
- **Config**: Restored the prompt for the **API Key** on initialization. Since diagnostics confirmed that the API Key is strictly required to link requests to the correct Quota Project (resolving 403 errors), the app now ensures the user provides one if it's missing from `localStorage`.

## [0.2.9 (Beta)] - 2025-12-26
### Changed
- **Troubleshooting**: Enhanced error handling to explicitly catch `API_KEY_INVALID` errors. The modal now provides direct instructions to generate a new API Key in the correct project, identifying this as a potential root cause for "Insufficient Scope" errors (via failed quota project linkage).

## [0.2.8 (Beta)] - 2025-12-26
### Changed
- **Troubleshooting**: Restored the inclusion of the `API Key` in `mediaItems:search` and `albums` requests. This forces the Google Photos API to explicitly link the request to the project's quota limits, which can sometimes resolve "Insufficient Scope" errors caused by ambiguous project identification.

## [0.2.7 (Beta)] - 2025-12-26
### Changed
- **Troubleshooting**: Restored `youtube.upload` scope (as removal didn't solve the Photos issue) and added a "Baseline API Check".
- **Diagnostics**: Now attempts to fetch the user's profile from the `userinfo` endpoint. If this works, the OAuth token is valid, confirming the issue is specific to the Photos API. If this fails, the entire token/project configuration is invalid.

## [0.2.6 (Beta)] - 2025-12-26
### Changed
- **Troubleshooting**: Temporarily removed `youtube.upload` scope to isolate the Google Photos connection. This is to test if combining multiple API scopes on a fresh, billing-less project is causing the token rejection.

## [0.2.5 (Beta)] - 2025-12-26
### Changed
- **Troubleshooting**: Enhanced the Error Modal to extract the specific Project ID from the current Client ID and generate a deep link to the Google Cloud Console. This ensures the user is checking the API enablement status for the *correct* project, ruling out multi-project confusion.

## [0.2.4 (Beta)] - 2025-12-26
### Added
- **Scopes**: Added `https://www.googleapis.com/auth/userinfo.email` to the requested scopes. This ensures the OAuth token contains the user's email address, allowing the diagnostic tool to verify identity and ensuring the Google Cloud "Test User" check functions correctly.

## [0.2.3 (Beta)] - 2025-12-26
### Added
- **Diagnostics**: Added `email` verification to the diagnostic tool to help users identify potential mismatches between the logged-in account and the project's "Test Users" whitelist.

## [0.2.2 (Beta)] - 2025-12-25
### Changed
- **Scopes**: Reverted to `photoslibrary.readonly` to test if the full "Write" scope was causing the 403 blocks on new projects.

## [0.2.1 (Beta)] - 2025-12-25
### Fixed
- **Logic**: Removed the legacy code block that prompted users for an API Key, ensuring the app now relies purely on OAuth 2.0 as intended.

## [0.2.0 (Beta)] - 2025-12-25
### Changed
- **UX**: Enhanced the `showConfirmModal` system to support HTML content.
- **Troubleshooting**: Updated the API Error Modal to provide a direct, clickable link to the "Google Photos Library API" enablement page in the Cloud Console, identifying this as the most probable cause of the 403 error.

## [0.1.9 (Beta)] - 2025-12-24
### Changed
- **Scopes**: Removed redundant `photoslibrary.readonly` scope, requesting only the primary `photoslibrary` scope to avoid potential conflicts.
- **Diagnostics**: Added specific guidance to check if the API is explicitly enabled in the Google Cloud Console when scope checks pass but requests fail.

## [0.1.8 (Beta)] - 2025-12-24
### Added
- **Diagnostics**: Implemented a self-diagnostic routine that verifies the OAuth token against Google's `tokeninfo` endpoint and tests access to the `albums` API to pinpoint permission issues.
### Changed
- **Scopes**: Reverted to `photoslibrary.readonly` to minimize permission friction, now verified by the new diagnostic tool.

## [0.1.7 (Beta)] - 2025-12-24
### Changed
- **API Access**: Removed API Key from Photos search requests. The log confirmed that the OAuth token has the correct scopes, so the API Key parameter was causing a conflict leading to the `403 Forbidden` error.

## [0.1.6 (Beta)] - 2025-12-24
### Changed
- **Permissions**: Escalated permissions request to full `photoslibrary` scope to bypass potential restrictions on `readonly` scope in test environments.
- **API Access**: Restored API Key in search requests paired with the new full scope.

## [0.1.5 (Beta)] - 2025-12-24
### Changed
- **Authentication**: Enhanced scope logging and forced explicitly simpler API requests to debug `insufficient authentication scopes` errors. Removed API Key from search request to rely solely on OAuth token.

## [0.1.4 (Beta)] - 2025-12-24
### Changed
- **Error Handling**: Added on-screen error modal to display Google API error messages directly to the user for easier troubleshooting.

## [0.1.3 (Beta)] - 2025-12-24
### Fixed
- **API Access**: Restored the API Key parameter to Google Photos API requests to resolve `403 Forbidden` errors.

## [0.1.2 (Beta)] - 2025-12-24
### Fixed
- **Critical Hotfix**: Resolved a syntax error in `app.js` caused by a malformed header comment.

## [0.1.1 (Beta)] - 2025-12-24
### Changed
- **UI Standardization**: Replaced all remaining native browser pop-ups (specifically for "Reset Settings") with a custom, glassmorphic confirmation modal.

## [0.1.0 (Beta)] - 2025-12-24
### Added
- **Custom Modal System**: Replaced native browser `alert()` and `prompt()` with sleek, glassmorphic modals.
- **Reset Settings**: Added a "Reset Settings" button to quickly clear Client ID and API Key from local storage.
- **Detailed Debugging**: Implemented JSON error response logging for Google Photos API to pinpoint 403 Forbidden errors.
- **Enhanced Troubleshooting**: Added a comprehensive guide to the README covering Scopes, Test Users, and API Key restrictions.

### Changed
- **Forced OAuth Consent**: Login now forces the account selection and consent screen to ensure users see permission checkboxes.
- **Refined API Requests**: Simplified Google Photos search requests by relying primarily on OAuth tokens.
- **Asset Cache Bursting**: Updated CSS and JS versioning for better consistency.

## [0.0.2 (Beta)] - 2025-12-24
### Changed
- Renamed project to `google-photos-to-youtube-migrator` for better clarity.
- Updated repository and live demo links to reflect the new project name.

### Fixed
- Stabilized GitHub Pages deployment by initializing the Pages site via API.
- Refined `new-project-init` workflow recommendations.

## [0.0.1 (Beta)] - 2025-12-24
### Added
- Initial project setup with documentation.
- Glassmorphic dashboard with dark mode.
- Foundation for Google Photos and YouTube API integration.
- Date-based filtering UI (1, 7, 30 days).
- Real-time logging console UI.
- Modal for media preview.
- Responsive design for mobile and desktop.
- GitHub Actions for automated deployment.
