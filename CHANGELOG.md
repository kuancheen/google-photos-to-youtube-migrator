# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
