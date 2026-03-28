'use strict';

/**
 * Study Materials Application
 * Manages educational content display and interaction
 */
class StudyMaterialsApp {
    constructor() {
        // Configuration
        this.currentClass = window.CONFIG?.DEFAULT_CLASS || 11;
        this.searchTerm = '';
        this.searchTimeout = null;
        this.deferredPrompt = null;
        this.currentPdfUrl = '';
        this.installBanner = null;
        this.isOnline = navigator.onLine;
        
        // Constants
        this.CONSTANTS = {
            MODAL_LOAD_TIMEOUT: 3000,
            INSTALL_BANNER_DELAY: 100,
            SEARCH_DEBOUNCE: window.CONFIG?.SEARCH_DEBOUNCE_MS || 300
        };
        
        // Cache DOM elements
        this.elements = this.cacheElements();
        
        // Validate required elements
        if (!this.validateElements()) {
            this.showError('Failed to initialize: Required elements not found');
            return;
        }
        
        this.init();
    }
    
    /**
     * Cache all DOM elements
     * @returns {Object} Cached elements
     */
    cacheElements() {
        return {
            content: document.getElementById('content'),
            searchInput: document.getElementById('searchInput'),
            downloadBtn: document.getElementById('downloadBtn'),
            downloadText: document.getElementById('downloadText'),
            modal: document.getElementById('pdfModal'),
            pdfViewer: document.getElementById('pdfViewer'),
            pdfTitle: document.getElementById('pdfTitle'),
            closeModal: document.getElementById('closeModal'),
            modalOverlay: document.querySelector('.modal-overlay'),
            downloadPdf: document.getElementById('downloadPdf')
        };
    }
    
    /**
     * Validate that required elements exist
     * @returns {boolean} True if all required elements exist
     */
    validateElements() {
        const required = ['content', 'searchInput', 'downloadBtn', 'modal', 'pdfViewer', 'closeModal'];
        const missing = required.filter(key => !this.elements[key]);
        
        if (missing.length > 0) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Initialize the application
     */
    init() {
        try {
            this.attachEventListeners();
            this.setupPWA();
            this.setupOnlineDetection();
            this.updateDownloadButton();
            this.render();
        } catch (error) {
            this.showError('Failed to initialize application');
        }
    }
    
    /**
     * Attach all event listeners with null checks
     */
    attachEventListeners() {
        // Class tabs
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleClassChange(e));
        });
        
        // Search input
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
        
        // Download button
        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.handleDownload());
        }
        
        // PDF click delegation
        document.addEventListener('click', (e) => this.handlePdfClick(e));
        
        // Modal controls
        if (this.elements.closeModal) {
            this.elements.closeModal.addEventListener('click', () => this.closeModal());
        }
        
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        if (this.elements.downloadPdf) {
            this.elements.downloadPdf.addEventListener('click', () => this.downloadCurrentPdf());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    /**
     * Handle keyboard events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboard(e) {
        // Escape key closes modal
        if (e.key === 'Escape' && this.elements.modal?.classList.contains('active')) {
            this.closeModal();
        }
        
        // Ctrl/Cmd + K focuses search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.elements.searchInput?.focus();
        }
    }
    
    /**
     * Setup online/offline detection
     */
    setupOnlineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('Back online', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('You are offline', 'warning');
        });
    }
    
    /**
     * Setup PWA features
     */
    setupPWA() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            this.hideInstallPrompt();
            this.showNotification('App installed successfully', 'success');
        });
    }
    
    /**
     * Show PWA install prompt
     */
    showInstallPrompt() {
        // Check if already dismissed
        if (localStorage.getItem('install-dismissed') === 'true') {
            return;
        }
        
        // Don't show if already showing
        if (this.installBanner) {
            return;
        }
        
        this.installBanner = document.createElement('div');
        this.installBanner.className = 'install-banner';
        
        // Create elements safely
        const content = document.createElement('div');
        content.className = 'install-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'install-text';
        
        const strong = document.createElement('strong');
        strong.textContent = 'Install Vibrant Academy';
        
        const span = document.createElement('span');
        span.textContent = 'Access materials offline anytime';
        
        textDiv.appendChild(strong);
        textDiv.appendChild(span);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'install-actions';
        
        const installBtn = document.createElement('button');
        installBtn.className = 'install-btn';
        installBtn.textContent = 'Install';
        installBtn.setAttribute('aria-label', 'Install application');
        
        const dismissBtn = document.createElement('button');
        dismissBtn.className = 'dismiss-btn';
        dismissBtn.textContent = '×';
        dismissBtn.setAttribute('aria-label', 'Dismiss install prompt');
        
        // Add event listeners
        installBtn.addEventListener('click', () => this.handleInstall());
        dismissBtn.addEventListener('click', () => this.handleDismissInstall());
        
        actionsDiv.appendChild(installBtn);
        actionsDiv.appendChild(dismissBtn);
        
        content.appendChild(textDiv);
        content.appendChild(actionsDiv);
        
        this.installBanner.appendChild(content);
        document.body.appendChild(this.installBanner);
        
        // Show with animation
        setTimeout(() => {
            this.installBanner?.classList.add('show');
        }, this.CONSTANTS.INSTALL_BANNER_DELAY);
    }
    
    /**
     * Handle install button click
     */
    async handleInstall() {
        if (!this.deferredPrompt) {
            return;
        }
        
        try {
            await this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        } catch (error) {
            this.showNotification('Installation failed', 'error');
        }
    }
    
    /**
     * Handle dismiss install button
     */
    handleDismissInstall() {
        localStorage.setItem('install-dismissed', 'true');
        this.hideInstallPrompt();
    }
    
    /**
     * Hide install prompt
     */
    hideInstallPrompt() {
        if (this.installBanner) {
            this.installBanner.remove();
            this.installBanner = null;
        }
    }
    
    /**
     * Handle class tab change
     * @param {Event} e - Click event
     */
    handleClassChange(e) {
        const btn = e.target.closest('.tab');
        if (!btn) return;
        
        // Update active state
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update current class
        const classValue = btn.dataset.class;
        this.currentClass = classValue === 'others' ? 'others' : parseInt(classValue, 10);
        
        // Update UI
        this.updateDownloadButton();
        this.render();
    }
    
    /**
     * Handle download button click
     */
    handleDownload() {
        if (!window.CONFIG?.DOWNLOAD_PATHS) {
            this.showNotification('Download configuration not found', 'error');
            return;
        }
        
        const zipPath = window.CONFIG.DOWNLOAD_PATHS[this.currentClass];
        
        if (!zipPath) {
            this.showNotification('Download not available for this class', 'warning');
            return;
        }
        
        if (!this.isOnline) {
            this.showNotification('You are offline. Please connect to download.', 'warning');
            return;
        }
        
        try {
            const link = document.createElement('a');
            link.href = zipPath;
            link.download = `Class_${this.currentClass}_Modules.zip`;
            link.rel = 'noopener noreferrer';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Download started', 'success');
        } catch (error) {
            this.showNotification('Download failed', 'error');
        }
    }
    
    /**
     * Update download button visibility and text
     */
    updateDownloadButton() {
        if (!this.elements.downloadBtn || !this.elements.downloadText) {
            return;
        }
        
        if (this.currentClass === 'others') {
            this.elements.downloadBtn.style.display = 'none';
        } else {
            this.elements.downloadBtn.style.display = 'flex';
            const className = this.currentClass === 11 ? '11th' : '12th';
            this.elements.downloadText.textContent = `Download Class ${className} (All Materials)`;
        }
    }
    
    /**
     * Handle search input with debouncing
     * @param {Event} e - Input event
     */
    handleSearch(e) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchTerm = e.target.value.trim();
            this.render();
        }, this.CONSTANTS.SEARCH_DEBOUNCE);
    }
    
    /**
     * Handle PDF item click
     * @param {Event} e - Click event
     */
    handlePdfClick(e) {
        const item = e.target.closest('.item');
        if (!item) return;
        
        e.preventDefault();
        
        const pdfUrl = item.dataset.pdf;
        const pdfNameElement = item.querySelector('.item-name');
        const pdfName = pdfNameElement ? pdfNameElement.textContent : 'Document';
        
        if (!pdfUrl) {
            this.showNotification('PDF URL not found', 'error');
            return;
        }
        
        this.openModal(pdfUrl, pdfName);
    }
    
    /**
     * Open PDF modal viewer
     * @param {string} url - PDF URL
     * @param {string} title - PDF title
     */
    openModal(url, title) {
        if (!this.elements.modal || !this.elements.pdfViewer) {
            this.showNotification('Modal not available', 'error');
            return;
        }
        
        // Decode URL safely
        let decodedUrl = url;
        try {
            decodedUrl = decodeURIComponent(url);
        } catch (e) {
            decodedUrl = url;
        }
        
        this.currentPdfUrl = decodedUrl;
        
        if (this.elements.pdfTitle) {
            this.elements.pdfTitle.textContent = this.sanitizeText(title);
        }
        
        this.elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus close button for accessibility
        setTimeout(() => {
            this.elements.closeModal?.focus();
        }, 100);
        
        // Check if mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Open in new tab on mobile
            window.open(this.currentPdfUrl, '_blank', 'noopener,noreferrer');
            this.closeModal();
        } else {
            this.loadPdfInIframe(this.currentPdfUrl);
        }
    }
    
    /**
     * Load PDF in iframe with error handling
     * Note: Cookie/storage warnings in console are expected when loading PDFs in iframes
     * due to third-party context restrictions. This is normal browser behavior.
     * @param {string} url - PDF URL
     */
    loadPdfInIframe(url) {
        if (!this.elements.pdfViewer) return;
        
        this.elements.pdfViewer.src = url;
        
        let timeoutCleared = false;
        
        const errorHandler = () => {
            if (timeoutCleared) return;
            window.open(url, '_blank', 'noopener,noreferrer');
            this.closeModal();
        };
        
        const loadTimeout = setTimeout(() => {
            try {
                // Check if iframe loaded
                if (!this.elements.pdfViewer.contentDocument && !this.elements.pdfViewer.contentWindow) {
                    errorHandler();
                }
            } catch (e) {
                // Cross-origin restriction - PDF is loading normally
            }
        }, this.CONSTANTS.MODAL_LOAD_TIMEOUT);
        
        this.elements.pdfViewer.onload = () => {
            timeoutCleared = true;
            clearTimeout(loadTimeout);
        };
        
        this.elements.pdfViewer.onerror = () => {
            timeoutCleared = true;
            clearTimeout(loadTimeout);
            errorHandler();
        };
    }
    
    /**
     * Download current PDF
     */
    downloadCurrentPdf() {
        if (!this.currentPdfUrl) {
            this.showNotification('No PDF selected', 'warning');
            return;
        }
        
        if (!this.isOnline) {
            this.showNotification('You are offline', 'warning');
            return;
        }
        
        try {
            const link = document.createElement('a');
            link.href = this.currentPdfUrl;
            const filename = this.elements.pdfTitle?.textContent || 'document';
            link.download = `${filename}.pdf`;
            link.rel = 'noopener noreferrer';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Download started', 'success');
        } catch (error) {
            this.showNotification('Download failed', 'error');
        }
    }
    
    /**
     * Close PDF modal
     */
    closeModal() {
        if (!this.elements.modal) return;
        
        this.elements.modal.classList.remove('active');
        
        if (this.elements.pdfViewer) {
            this.elements.pdfViewer.src = '';
        }
        
        if (this.elements.pdfTitle) {
            this.elements.pdfTitle.textContent = '';
        }
        
        this.currentPdfUrl = '';
        document.body.style.overflow = '';
        
        // Return focus to search
        setTimeout(() => {
            this.elements.searchInput?.focus();
        }, 100);
    }
    
    /**
     * Render materials grid
     */
    render() {
        if (!this.elements.content) return;
        
        if (!window.STUDY_MATERIALS) {
            this.elements.content.innerHTML = '<div class="empty">Study materials not loaded</div>';
            return;
        }
        
        const materials = window.STUDY_MATERIALS[this.currentClass];
        
        if (!materials) {
            this.elements.content.innerHTML = '<div class="empty">No materials available</div>';
            return;
        }
        
        const filtered = this.filterMaterials(materials);
        
        if (Object.keys(filtered).length === 0) {
            this.elements.content.innerHTML = `<div class="empty">No results for "${this.sanitizeText(this.searchTerm)}"</div>`;
            return;
        }
        
        this.elements.content.innerHTML = this.generateHTML(filtered);
    }
    
    /**
     * Filter materials based on search term
     * @param {Object} materials - Materials object
     * @returns {Object} Filtered materials
     */
    filterMaterials(materials) {
        if (!this.searchTerm) return materials;
        
        const result = {};
        const lowerTerm = this.searchTerm.toLowerCase();
        
        Object.entries(materials).forEach(([subject, data]) => {
            if (!data || !data.categories) return;
            
            const filteredCategories = {};
            
            Object.entries(data.categories).forEach(([category, pdfs]) => {
                if (!Array.isArray(pdfs)) return;
                
                const matchedPdfs = pdfs.filter(pdf => 
                    pdf && pdf.name &&
                    (pdf.name.toLowerCase().includes(lowerTerm) ||
                    category.toLowerCase().includes(lowerTerm) ||
                    subject.toLowerCase().includes(lowerTerm))
                );
                
                if (matchedPdfs.length > 0) {
                    filteredCategories[category] = matchedPdfs;
                }
            });
            
            if (Object.keys(filteredCategories).length > 0) {
                result[subject] = { categories: filteredCategories };
            }
        });
        
        return result;
    }
    
    /**
     * Generate HTML for materials grid
     * @param {Object} materials - Materials object
     * @returns {string} HTML string
     */
    generateHTML(materials) {
        const subjectsHTML = Object.entries(materials).map(([subject, data]) => {
            const config = window.SUBJECT_CONFIG?.[subject] || { icon: '?', color: 'resources' };
            
            if (!data || !data.categories) return '';
            
            const categoriesHTML = Object.entries(data.categories).map(([category, pdfs]) => 
                this.generateCategoryHTML(category, pdfs)
            ).join('');
            
            return `
                <div class="subject">
                    <div class="subject-head">
                        <div class="icon ${this.sanitizeText(config.color)}" aria-hidden="true">${this.sanitizeText(config.icon)}</div>
                        <h2 class="subject-title">${this.sanitizeText(subject)}</h2>
                    </div>
                    ${categoriesHTML}
                </div>
            `;
        }).join('');
        
        return `<div class="grid">${subjectsHTML}</div>`;
    }
    
    /**
     * Generate HTML for a category
     * @param {string} category - Category name
     * @param {Array} pdfs - Array of PDF objects
     * @returns {string} HTML string
     */
    generateCategoryHTML(category, pdfs) {
        if (!Array.isArray(pdfs)) return '';
        
        const pdfsHTML = pdfs.map(pdf => {
            if (!pdf || !pdf.file || !pdf.name) return '';
            
            const encodedPath = pdf.file.split('/').map(part => encodeURIComponent(part)).join('/');
            return `
            <a href="#" class="item" data-pdf="${this.sanitizeAttribute(encodedPath)}" role="button" aria-label="Open ${this.sanitizeText(pdf.name)}">
                <div class="pdf-badge" aria-hidden="true">PDF</div>
                <span class="item-name">${this.sanitizeText(pdf.name)}</span>
                <svg class="arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
        `;
        }).join('');
        
        return `
            <div class="cat">
                <div class="cat-title">${this.sanitizeText(category)}</div>
                <div class="items">${pdfsHTML}</div>
            </div>
        `;
    }
    
    /**
     * Sanitize text for HTML display (XSS protection)
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    sanitizeText(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Sanitize attribute value (XSS protection)
     * @param {string} value - Attribute value to sanitize
     * @returns {string} Sanitized value
     */
    sanitizeAttribute(value) {
        if (typeof value !== 'string') return '';
        return value.replace(/['"<>&]/g, (char) => {
            const entities = {
                '"': '&quot;',
                "'": '&#39;',
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;'
            };
            return entities[char] || char;
        });
    }
    
    /**
     * Show notification toast
     * @param {string} message - Message to display
     * @param {string} type - Type (success, warning, error)
     */
    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Show toast
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        if (this.elements.content) {
            this.elements.content.innerHTML = `<div class="empty error">${this.sanitizeText(message)}</div>`;
        }
    }
}

// Initialize app with error boundary
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new StudyMaterialsApp();
    } catch (error) {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<div class="empty error">Failed to load application. Please refresh the page.</div>';
        }
    }
});
