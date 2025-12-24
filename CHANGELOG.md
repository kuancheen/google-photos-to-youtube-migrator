# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
