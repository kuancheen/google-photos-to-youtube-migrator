/**
 * Media Migrator - Google Photos to YouTube
 * v0.2.7 Beta
 */

const CONFIG = {
    SCOPES: 'https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.email',
    DISCOVERY_DOCS: [
        'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
        'https://photoslibrary.googleapis.com/$discovery/rest?version=v1'
    ]
};

class MediaMigrator {
    constructor() {
        this.tokenClient = null;
        this.accessToken = null;
        this.mediaItems = [];
        this.nextPageToken = null;
        this.selectedItems = new Set();
        this.clientId = localStorage.getItem('google_client_id');
        this.apiKey = localStorage.getItem('google_api_key');

        this.init();
    }

    init() {
        this.cacheDom();
        this.bindEvents();
        this.updateUIState();
        this.log('System initialized. Please ensure Client ID and API Key are set in settings.');
    }

    cacheDom() {
        this.authBtn = document.getElementById('auth-btn');
        this.mediaGrid = document.getElementById('media-grid');
        this.sidebar = document.getElementById('sidebar');
        this.migrationLog = document.getElementById('migration-log');
        this.logOutput = document.getElementById('log-output');
        this.clearLogBtn = document.createElement('button');
        this.clearLogBtn.textContent = 'Clear Log';
        this.clearLogBtn.className = 'btn-text';
        document.querySelector('.log-panel .panel-header').appendChild(this.clearLogBtn);
        this.videoCount = document.getElementById('video-count');
        this.selectedCount = document.getElementById('selected-count');
        this.migrateBtn = document.getElementById('migrate-btn');
        this.resetBtn = document.getElementById('reset-btn');

        // Modals
        this.modal = document.getElementById('modal');
        this.modalImg = document.getElementById('modal-img');
        this.modalMeta = document.getElementById('modal-meta');
        this.modalClose = document.querySelector('.modal-close');

        this.inputModal = document.getElementById('input-modal');
        this.inputTitle = document.getElementById('input-modal-title');
        this.inputField = document.getElementById('input-modal-field');
        this.inputSubmit = document.getElementById('input-modal-submit');
        this.inputCancel = document.getElementById('input-modal-cancel');
        this.inputClose = document.getElementById('input-modal-close');

        this.confirmModal = document.getElementById('confirm-modal');
        this.confirmTitle = document.getElementById('confirm-modal-title');
        this.confirmMessage = document.getElementById('confirm-modal-message');
        this.confirmSubmit = document.getElementById('confirm-modal-submit');
        this.confirmCancel = document.getElementById('confirm-modal-cancel');
        this.confirmClose = document.getElementById('confirm-modal-close');
    }

    bindEvents() {
        this.authBtn.addEventListener('click', () => this.handleAuth());
        this.modalClose.addEventListener('click', () => this.closeModal());

        // General modal click-outside
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
            if (e.target === this.inputModal) this.closeInputModal();
            if (e.target === this.confirmModal) this.closeConfirmModal();
        });

        // Esc key to close modals
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeInputModal();
                this.closeConfirmModal();
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Load more button
        document.getElementById('load-more-btn').addEventListener('click', () => this.fetchVideos(true));

        // Migrate button
        this.migrateBtn.addEventListener('click', () => this.startMigration());

        // Sort toggle
        document.getElementById('sort-toggle').addEventListener('change', (e) => {
            const label = document.getElementById('sort-label');
            label.textContent = e.target.checked ? 'Latest First' : 'Earliest First';
            this.handleFilter({ target: document.querySelector('.filter-btn.active') });
        });

        // Clear log button
        this.clearLogBtn.addEventListener('click', () => {
            this.logOutput.innerHTML = '';
            this.log('Log cleared.');
        });

        // Reset settings button
        this.resetBtn.addEventListener('click', () => this.resetSettings());
    }

    async resetSettings() {
        const confirmed = await this.showConfirmModal('Reset Settings', 'Are you sure you want to clear your Client ID and API Key? You will need to re-enter them.');
        if (confirmed) {
            localStorage.clear();
            location.reload();
        }
    }

    updateUIState() {
        if (this.accessToken) {
            this.authBtn.textContent = 'Sign Out';
            this.sidebar.classList.remove('hidden');
            this.migrationLog.classList.remove('hidden');
        } else {
            this.authBtn.textContent = 'Connect Google Account';
            this.sidebar.classList.add('hidden');
            this.migrationLog.classList.add('hidden');
        }
    }

    log(message, type = 'system') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        const time = new Date().toLocaleTimeString();
        entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
        this.logOutput.prepend(entry);
    }

    async showInputModal(title, placeholder = '') {
        return new Promise((resolve) => {
            this.inputTitle.textContent = title;
            this.inputField.placeholder = placeholder;
            this.inputField.value = '';
            this.inputModal.classList.remove('hidden');
            this.inputField.focus();

            const handleSubmit = () => {
                const val = this.inputField.value.trim();
                if (val) {
                    cleanup();
                    resolve(val);
                }
            };

            const handleCancel = () => {
                cleanup();
                resolve(null);
            };

            const handleKey = (e) => {
                if (e.key === 'Enter') handleSubmit();
            };

            const cleanup = () => {
                this.inputSubmit.removeEventListener('click', handleSubmit);
                this.inputCancel.removeEventListener('click', handleCancel);
                this.inputClose.removeEventListener('click', handleCancel);
                this.inputField.removeEventListener('keydown', handleKey);
                this.closeInputModal();
            };

            this.inputSubmit.addEventListener('click', handleSubmit);
            this.inputCancel.addEventListener('click', handleCancel);
            this.inputClose.addEventListener('click', handleCancel);
            this.inputField.addEventListener('keydown', handleKey);
        });
    }

    closeInputModal() {
        this.inputModal.classList.add('hidden');
    }

    async showConfirmModal(title, message) {
        return new Promise((resolve) => {
            this.confirmTitle.textContent = title;
            this.confirmMessage.innerHTML = message;
            this.confirmModal.classList.remove('hidden');

            const handleSubmit = () => {
                cleanup();
                resolve(true);
            };

            const handleCancel = () => {
                cleanup();
                resolve(false);
            };

            const cleanup = () => {
                this.confirmSubmit.removeEventListener('click', handleSubmit);
                this.confirmCancel.removeEventListener('click', handleCancel);
                this.confirmClose.removeEventListener('click', handleCancel);
                this.closeConfirmModal();
            };

            this.confirmSubmit.addEventListener('click', handleSubmit);
            this.confirmCancel.addEventListener('click', handleCancel);
            this.confirmClose.addEventListener('click', handleCancel);
        });
    }

    closeConfirmModal() {
        this.confirmModal.classList.add('hidden');
    }

    async handleAuth() {
        if (this.accessToken) {
            google.accounts.oauth2.revoke(this.accessToken, () => {
                this.accessToken = null;
                this.updateUIState();
                this.log('Signed out successfully.');
            });
            return;
        }

        if (!this.clientId) {
            const id = await this.showInputModal('Google OAuth Client ID', 'Enter your Client ID here...');
            if (!id) return;
            this.clientId = id;
            localStorage.setItem('google_client_id', id);
        }

        if (!this.tokenClient) {
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.clientId,
                scope: CONFIG.SCOPES,
                callback: (response) => {
                    if (response.error !== undefined) {
                        this.log(`Auth Error: ${response.error}`, 'error');
                        throw (response);
                    }
                    this.accessToken = response.access_token;
                    this.updateUIState();
                    this.log('Authentication successful!', 'success');

                    if (response.scope) {
                        this.log(`Granted permissions: <br><small>${response.scope}</small>`, 'system');
                        if (!response.scope.includes('photoslibrary')) {
                            this.log('🚨 ERROR: Google Photos permission was NOT granted.', 'error');
                            this.log('<strong>Please click "Connect Google Account" again and manually check ALL boxes in the Google consent screen.</strong>', 'warning');
                            return; // Stop here if scope is missing
                        }
                    } else {
                        // Sometimes response.scope is empty if everything was already granted
                        // but since we use consent=prompt, it should usually be there.
                        this.log('Warning: No scope info returned. Proceeding with fetch...', 'warning');
                    }

                    this.runDiagnostics();
                },
            });
        }

        this.tokenClient.requestAccessToken({ prompt: 'select_account consent' });
    }

    async runDiagnostics() {
        this.log('Running diagnostics...', 'system');
        try {
            // Check Token Info
            const infoResp = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${this.accessToken}`);
            const info = await infoResp.json();
            this.log(`<strong>Token Diagnostics:</strong><br>Email: <strong>${info.email}</strong><br>Audience: ${info.aud}<br>Scopes: ${info.scope}<br>Expires: ${info.exp}`, 'system');

            this.log('👉 <strong>ACTION CHECK:</strong> Does the email above match your "Test Users" list EXACTLY?', 'warning');

            if (!info.scope.includes('photoslibrary')) {
                this.log('🚨 DIAGNOSTIC FAIL: Token is missing photoslibrary scope on backend!', 'error');
            } else {
                this.log('✅ Token scopes look correct on backend.', 'success');
            }

            // Test Baseline API Access (UserInfo)
            this.log('Testing Baseline API Access (UserInfo)...');
            const userResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            if (userResp.ok) {
                this.log('✅ Baseline API access confirmed. Token is valid and functional.', 'success');
            } else {
                this.log(`❌ Baseline API failed [${userResp.status}]. THE TOKEN IS BROKEN/INVALID.`, 'error');
            }

            // Try Fetching Albums (Simpler endpoint)
            this.log('Testing Albums Permissions...');
            const albumsResp = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });

            if (albumsResp.ok) {
                this.log('✅ Albums access confirmed. photoslibrary API is working!', 'success');
            } else {
                const err = await albumsResp.json();
                this.log(`❌ Albums fetch failed [${albumsResp.status}]: ${JSON.stringify(err.error)}`, 'error');
                this.log('<strong>CRITICAL:</strong> If scopes are correct but this fails, the API is likely NOT ENABLED.', 'error');
                this.log('Go to Google Cloud Console > APIs & Services > Enabled APIs & Services, click "+ ENABLE APIS AND SERVICES", search for "Google Photos Library API" and enable it.', 'warning');
            }

            this.fetchVideos();

        } catch (e) {
            this.log(`Diagnostics failed: ${e.message}`, 'error');
        }
    }

    async startMigration() {
        if (this.selectedItems.size === 0) return;

        this.log(`Starting migration for ${this.selectedItems.size} videos...`, 'system');
        this.migrateBtn.disabled = true;

        const items = Array.from(this.selectedItems);
        for (const item of items) {
            await this.migrateVideo(item);
        }

        this.migrateBtn.disabled = false;
        this.log('Batch migration complete.', 'success');
    }

    async migrateVideo(item) {
        const uploadId = `upload-${Date.now()}`;
        this.createUploadUI(uploadId, item.filename);

        try {
            this.log(`[${item.filename}] Fetching video binary...`);
            this.updateUploadStatus(uploadId, 'Fetching binary...', 10);

            const videoResp = await fetch(`${item.baseUrl}=dv`, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });

            if (!videoResp.ok) throw new Error('Failed to fetch video binary');
            const videoBlob = await videoResp.blob();

            this.log(`[${item.filename}] Uploading to YouTube...`);
            this.updateUploadStatus(uploadId, 'Uploading to YouTube...', 30);

            const metadata = {
                snippet: {
                    title: item.filename,
                    description: `Uploaded from Google Photos via Media Migrator. Original date: ${item.mediaMetadata.creationTime}`,
                    categoryId: '22'
                },
                status: {
                    privacyStatus: 'private'
                }
            };

            const initResp = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metadata)
            });

            if (!initResp.ok) throw new Error('Failed to initiate YouTube upload');
            const uploadUrl = initResp.headers.get('Location');

            const uploadResp = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': videoBlob.type
                },
                body: videoBlob
            });

            if (!uploadResp.ok) throw new Error('YouTube upload failed');

            this.updateUploadStatus(uploadId, 'Complete', 100, 'success');
            this.log(`[${item.filename}] Successfully migrated!`, 'success');

            const card = document.querySelector(`input[data-id="${item.id}"]`).closest('.media-card');
            card.classList.add('synced');
            this.log(`[${item.filename}] To delete this video from Google Photos, use the link provided on the card.`, 'warning');

        } catch (error) {
            this.log(`[${item.filename}] Migration failed: ${error.message}`, 'error');
            this.updateUploadStatus(uploadId, 'Failed', 100, 'error');
        }
    }

    createUploadUI(id, filename) {
        const container = document.getElementById('active-uploads');
        if (!container) return;
        const item = document.createElement('div');
        item.id = id;
        item.className = 'upload-item glass-panel';
        item.innerHTML = `
            <div class="upload-info">
                <span class="upload-name">${filename}</span>
                <span class="upload-status">Starting...</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
        `;
        container.prepend(item);
    }

    updateUploadStatus(id, status, progress, type = '') {
        const item = document.getElementById(id);
        if (!item) return;

        item.querySelector('.upload-status').textContent = status;
        const bar = item.querySelector('.progress-bar');
        bar.style.width = `${progress}%`;
        if (type) bar.classList.add(type);
    }

    async fetchVideos(append = false) {
        if (!this.accessToken) return;


        this.log(append ? 'Loading more videos...' : 'Fetching videos from Google Photos...');

        const filterBtn = document.querySelector('.filter-btn.active');
        const range = filterBtn.dataset.range;
        const isLatest = document.getElementById('sort-toggle').checked;

        let filters = {
            mediaTypeFilter: { mediaTypes: ['VIDEO'] }
        };

        if (range !== 'all') {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - parseInt(range));

            filters.dateFilter = {
                ranges: [{
                    startDate: { year: startDate.getFullYear(), month: startDate.getMonth() + 1, day: startDate.getDate() },
                    endDate: { year: endDate.getFullYear(), month: endDate.getMonth() + 1, day: endDate.getDate() }
                }]
            };
        }

        try {
            const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pageSize: 25,
                    pageToken: append ? this.nextPageToken : null,
                    filters: filters
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = errorData.error ? JSON.stringify(errorData.error, null, 2) : 'Unknown error';
                const readableMessage = errorData.error?.message || errorData.error?.status || 'Unknown error occurred';

                this.log(`Photos API Error [${response.status}]: <pre>${errorMsg}</pre>`, 'error');
                console.error('Full Photos API Error:', errorData);

                // Show error to user
                const projectNumber = this.clientId.split('-')[0];
                const deepLink = `https://console.cloud.google.com/apis/library/photoslibrary.googleapis.com?project=${projectNumber}`;

                await this.showConfirmModal('API Error', `
                    <strong>Google returned an error:</strong> ${readableMessage}<br><br>
                    This generic error often means the <strong>Google Photos Library API</strong> is not enabled in the SPECIFIC project you are using (Project ID ending in ...${projectNumber}).<br><br>
                    <a href="${deepLink}" target="_blank" style="color: #8ab4f8; text-decoration: underline;">👉 Click here to open the Cloud Console for Project ${projectNumber}</a><br>
                    1. If it says <strong>ENABLE</strong>, click it immediately.<br>
                    2. If it says <strong>MANAGE</strong>, the API is enabled, and we are facing a rare Google policy block.<br>
                    3. Wait 2 minutes after enabling and try again.
                `);
                return;
            }

            const data = await response.json();

            if (!data.mediaItems) {
                if (!append) {
                    this.mediaGrid.innerHTML = '<div class="empty-state"><p>No videos found for this period.</p></div>';
                }
                this.log('No videos found.');
                return;
            }

            this.nextPageToken = data.nextPageToken;
            this.renderMediaItems(data.mediaItems, append);
            this.log(`Successfully retrieved ${data.mediaItems.length} items.`);

            const paginationTrigger = document.getElementById('pagination-trigger');
            if (this.nextPageToken) {
                paginationTrigger.classList.remove('hidden');
            } else {
                paginationTrigger.classList.add('hidden');
            }

        } catch (error) {
            this.log(`Error fetching videos: ${error.message}`, 'error');
        }
    }

    renderMediaItems(items, append) {
        if (!append) this.mediaGrid.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card glass-panel';
            const date = new Date(item.mediaMetadata.creationTime).toLocaleDateString();

            card.innerHTML = `
                <div class="media-preview" style="background-image: url('${item.baseUrl}=w400-h300')">
                    <div class="media-overlay">
                        <button class="btn-zoom">🔍</button>
                    </div>
                </div>
                <div class="media-info">
                    <h3 title="${item.filename}">${item.filename}</h3>
                    <p class="media-date">${date}</p>
                    <p class="media-res">${item.mediaMetadata.width}x${item.mediaMetadata.height}</p>
                </div>
                <div class="media-actions">
                    <label class="checkbox-container">
                        <input type="checkbox" data-id="${item.id}">
                        <span class="checkmark"></span>
                    </label>
                    <a href="${item.productUrl}" target="_blank" class="btn-link" title="Open in Photos">🔗</a>
                </div>
            `;

            card.querySelector('.btn-zoom').addEventListener('click', () => {
                const meta = `<strong>${item.filename}</strong><br>${date} | ${item.mediaMetadata.width}x${item.mediaMetadata.height}`;
                this.showModal(`${item.baseUrl}=w1600`, meta);
            });

            card.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                const itemData = items.find(i => i.id === e.target.dataset.id);
                if (e.target.checked) {
                    this.selectedItems.add(itemData);
                } else {
                    this.selectedItems.delete(itemData);
                }
                this.updateSelectedCount();
            });

            this.mediaGrid.appendChild(card);
        });

        this.updateVideoCount();
    }

    updateVideoCount() {
        this.videoCount.textContent = this.mediaGrid.querySelectorAll('.media-card').length;
    }

    updateSelectedCount() {
        this.selectedCount.textContent = this.selectedItems.size;
        this.migrateBtn.disabled = this.selectedItems.size === 0;
    }

    handleFilter(e) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const range = e.target.dataset.range;
        this.log(`Switched filter to: ${range} days`);
        this.fetchVideos(false);
    }

    showModal(src, meta) {
        this.modalImg.src = src;
        this.modalMeta.innerHTML = meta;
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.modalImg.src = '';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MediaMigrator();
});
