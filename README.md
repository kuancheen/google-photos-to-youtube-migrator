# Media Migrator | Google Photos to YouTube (v0.0.2 Beta)

![Version](https://img.shields.io/badge/version-v0.0.2%20(Beta)-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Semantic Versioning](https://img.shields.io/badge/semver-2.0.0-blue)
![Views](https://hits.sh/kuancheen.github.io/google-photos-to-youtube-migrator.svg?view=today-total&style=flat&label=👁️%20Views&extraCount=0&color=6366f1)
![Status](https://img.shields.io/badge/status-active-success)
![Live Demo](https://img.shields.io/badge/demo-online-green.svg)

A premium, modern web application that allows you to seamlessly migrate your videos from Google Photos to YouTube with advanced filtering and batch processing.

## Features

- **Advanced Filtering**: Filter videos by 1 Day, 7 Days, or 30 Days from your latest or earliest uploads.
- **Smart Metadata**: Automatically populates YouTube video details based on Google Photos metadata.
- **Batch Processing**: Select multiple videos and track their upload progress in real-time.
- **Modern UI**: Sleek, dark-mode dashboard with glassmorphism and smooth animations.
- **Direct Preview**: View video thumbnails and meta-data before migrating.

## Getting Started

### Prerequisites

You will need a Google Cloud Project with the following APIs enabled:
- Google Photos Library API
- YouTube Data API v3

### Setup

1. Clone the repository.
2. Host on any static web server (GitHub Pages recommended).
3. Access the settings panel in the app to configure your `Client ID` and `API Key`.

## Google API Limitations

> [!WARNING]
> The Google Photos API does not allow third-party applications to delete media items that were not created by that specific application. After a successful migration, you will be provided with a link to manually delete the video from your Google Photos library if desired.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Kuan Cheen** - [GitHub](https://github.com/kuancheen)
Copyright (c) 2025 Kuan Cheen
