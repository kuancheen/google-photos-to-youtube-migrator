# Media Migrator | Google Photos to YouTube (v0.2.1 Beta)

![Version](https://img.shields.io/badge/version-v0.2.1%20(Beta)-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Semantic Versioning](https://img.shields.io/badge/semver-2.0.0-blue)
![Views](https://hits.sh/kuancheen.github.io/google-photos-to-youtube-migrator.svg?view=today-total&style=flat&label=👁️%20Views&extraCount=0&color=6366f1)
![Status](https://img.shields.io/badge/status-active-success)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://kuancheen.github.io/google-photos-to-youtube-migrator/)

> You can view the live demo by clicking the badge above or by [visiting this link](https://kuancheen.github.io/google-photos-to-youtube-migrator/).

A premium, modern web application that allows you to seamlessly migrate your videos from Google Photos to YouTube with advanced filtering and batch processing.

## Authentication & API Setup

To use this application, you must provide your own Google Cloud credentials. Follow these steps to obtain them:

### 1. Create a Google Cloud Project
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., "Media Migrator").

### 2. Enable APIs
Enable the following APIs in your project:
-   **Photos Library API** (for fetching your videos).
-   **YouTube Data API v3** (for uploading to your channel).

### 3. Configure OAuth Consent Screen
1.  Navigate to **APIs & Services > OAuth consent screen**.
2.  Choose **External** (unless you are a Google Workspace user).
3.  Add the following scopes:
    -   `.../auth/photoslibrary.readonly`
    -   `.../auth/youtube.upload`
4.  **Important**: While in "Testing" mode, you must add your own email address to the **Test users** list.

### 4. Create Credentials
Navigate to **APIs & Services > Credentials**:

-   **OAuth 2.0 Client ID**:
    1.  Click **Create Credentials > OAuth client ID**.
    2.  Select **Web application** as the Application type.
    3.  Under **Authorized JavaScript origins**, add:
        -   `https://kuancheen.github.io` (for the live demo)
        -   `http://localhost` (for local development)
    4.  Copy the **Client ID**.
-   **API Key**:
    1.  Click **Create Credentials > API Key**.
    2.  Copy the **API Key**.

### 5. Configure the App
1.  Open the [Live Demo](https://kuancheen.github.io/google-photos-to-youtube-migrator/).
2.  Click the settings icon (or the connect button if prompted).
3.  Enter your **Client ID** and **API Key** in the secure custom modals.

## Troubleshooting

### Error 403: access_denied / "App has not completed the Google verification process"
This occurs because your Google Cloud project is in **Testing** mode.
- **Solution**: Go to the **OAuth consent screen** in your [Google Cloud Console](https://console.cloud.google.com/), and add your email to the **Test users** section.

### Error 403: Forbidden on `mediaItems:search`
This occurs after login when the app attempts to fetch your photos.
- **Check 1: Enable the API**: Ensure the **Photos Library API** is explicitly enabled in the [API Library](https://console.cloud.google.com/apis/library/photoslibrary.googleapis.com).
- **Check 2: Tick the Consent Box**: During the Google login popup, you **must manually check the box** that says "See and download your Google Photos library".
- **Check 3: API Key Restrictions**: In [Credentials](https://console.cloud.google.com/apis/credentials), if your API Key has **"API restrictions"**, ensure "Photos Library API" is included in the allowed list.
- **Check 4: Add Scopes to Consent Screen**: In [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent), click **"Edit App"** and ensure `.../auth/photoslibrary.readonly` is added to the **"Scopes for Google APIs"** section. If it's not listed there, Google will not show the checkbox to the user.

## Google API Limitations

> [!WARNING]
> The Google Photos API does not allow third-party applications to delete media items that were not created by that specific application. After a successful migration, you will be provided with a link to manually delete the video from your Google Photos library if desired.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Kuan Cheen** - [GitHub](https://github.com/kuancheen)
Copyright (c) 2025 Kuan Cheen
