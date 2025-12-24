# Media Migrator | Google Photos to YouTube (v0.0.2 Beta)

![Version](https://img.shields.io/badge/version-v0.0.2%20(Beta)-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Semantic Versioning](https://img.shields.io/badge/semver-2.0.0-blue)
![Views](https://hits.sh/kuancheen.github.io/google-photos-to-youtube-migrator.svg?view=today-total&style=flat&label=👁️%20Views&extraCount=0&color=6366f1)
![Status](https://img.shields.io/badge/status-active-success)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://kuancheen.github.io/google-photos-to-youtube-migrator/)

Check out the live demo [here](https://kuancheen.github.io/google-photos-to-youtube-migrator/).

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
This occurs because your Google Cloud project is in **Testing** mode (which is recommended for personal use).
- **Solution**: Go to the **OAuth consent screen** in your [Google Cloud Console](https://console.cloud.google.com/), scroll down to the **Test users** section, and click **+ ADD USERS**. Add your email address (`kuancheen@gmail.com`) and save.

## Google API Limitations

> [!WARNING]
> The Google Photos API does not allow third-party applications to delete media items that were not created by that specific application. After a successful migration, you will be provided with a link to manually delete the video from your Google Photos library if desired.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Kuan Cheen** - [GitHub](https://github.com/kuancheen)
Copyright (c) 2025 Kuan Cheen
