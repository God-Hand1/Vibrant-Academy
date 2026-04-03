'use strict';

/**
 * Study Materials Application
 * Manages educational content display and interaction
 */
class StudyMaterialsApp {
    constructor() {
        this.currentClass = window.CONFIG?.DEFAULT_CLASS || 11;
        this.searchTerm = '';
        this.searchTimeout = null;
        this.deferredPrompt = null;
        this.currentPdfUrl = '';
        this.installBanner = null;
        this.isOnline = navigator.onLine;
        
        this.CONSTANTS = {
            MODAL_LOAD_TIMEOUT: 3000,
            INSTALL_BANNER_DELAY: 100,
            SEARCH_DEBOUNCE: window.CONFIG?.SEARCH_DEBOUNCE_MS || 300
        };
        
        this.elements = this.cacheElements();
        
        if (!this.validateElements()) {
            this.showError('Failed to initialize: Required elements not found');
            return;
        }
        
        this.init();
    }
    
    cacheElements() {
        return {
            content: document.getElementById('content'),
            searchInput: document.getElementById('searchInput'),
            downloadBtn: document.getElementById('downloadBtn'),
            downloadText: document.getElementById('downloadText'),
            viewToggleBtn: document.getElementById('viewToggleBtn'),
            viewToggleIcon: document.getElementById('viewToggleIcon'),
            modal: document.getElementById('pdfModal'),
            pdfViewer: document.getElementById('pdfViewer'),
            pdfTitle: document.getElementById('pdfTitle'),
            closeModal: document.getElementById('closeModal'),
            modalOverlay: document.querySelector('.modal-overlay'),
            downloadPdf: document.getElementById('downloadPdf'),
            textModal: document.getElementById('textModal'),
            textViewer: document.getElementById('textViewer'),
            textTitle: document.getElementById('textTitle'),
            closeTextModal: document.getElementById('closeTextModal'),
            copyText: document.getElementById('copyText')
        };
    }
    
    validateElements() {
        const required = ['content', 'searchInput', 'downloadBtn', 'modal', 'pdfViewer', 'closeModal'];
        return required.every(key => this.elements[key]);
    }
    
    init() {
        try {
            // Verify config is loaded
            if (!window.SUBJECT_CONFIG) {
                console.error('SUBJECT_CONFIG not loaded! Defining fallback...');
                window.SUBJECT_CONFIG = {
                    Physics: { icon: 'P', color: 'physics' },
                    Chemistry: { icon: 'C', color: 'chemistry' },
                    Mathematics: { icon: 'M', color: 'mathematics' },
                    Resources: { icon: 'R', color: 'resources' },
                    Prompts: { icon: 'P', color: 'resources' }
                };
            }
            
            this.attachEventListeners();
            this.disableRightClick();
            this.setupPWA();
            this.setupOnlineDetection();
            this.updateDownloadButton();
            this.render();
        } catch (error) {
            this.showError('Failed to initialize application');
        }
    }
    
    attachEventListeners() {
        document.querySelectorAll('.tab').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleClassChange(e));
        });
        
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
        
        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.handleDownload());
        }
        
        if (this.elements.viewToggleBtn) {
            this.elements.viewToggleBtn.addEventListener('click', () => this.handleViewToggle());
        }
        
        document.addEventListener('click', (e) => this.handleItemClick(e));
        
        if (this.elements.closeModal) {
            this.elements.closeModal.addEventListener('click', () => this.closeModal());
        }
        
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        if (this.elements.downloadPdf) {
            this.elements.downloadPdf.addEventListener('click', () => this.downloadCurrentPdf());
        }
        
        if (this.elements.closeTextModal) {
            this.elements.closeTextModal.addEventListener('click', () => this.closeTextModal());
        }
        
        const textModalOverlay = this.elements.textModal?.querySelector('.modal-overlay');
        if (textModalOverlay) {
            textModalOverlay.addEventListener('click', () => this.closeTextModal());
        }
        
        if (this.elements.copyText) {
            this.elements.copyText.addEventListener('click', () => this.copyTextToClipboard());
        }
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    handleKeyboard(e) {
        if (e.key === 'Escape') {
            if (this.elements.modal?.classList.contains('active')) {
                this.closeModal();
            }
            if (this.elements.textModal?.classList.contains('active')) {
                this.closeTextModal();
            }
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.elements.searchInput?.focus();
        }
    }
    
    disableRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        let longPressTimer;
        
        document.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                e.preventDefault();
            }, 500);
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        });
        
        document.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        });
    }
    
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
    
    showInstallPrompt() {
        if (localStorage.getItem('install-dismissed') === 'true' || this.installBanner) {
            return;
        }
        
        this.installBanner = document.createElement('div');
        this.installBanner.className = 'install-banner';
        
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
        
        installBtn.addEventListener('click', () => this.handleInstall());
        dismissBtn.addEventListener('click', () => this.handleDismissInstall());
        
        actionsDiv.appendChild(installBtn);
        actionsDiv.appendChild(dismissBtn);
        
        content.appendChild(textDiv);
        content.appendChild(actionsDiv);
        
        this.installBanner.appendChild(content);
        document.body.appendChild(this.installBanner);
        
        setTimeout(() => {
            this.installBanner?.classList.add('show');
        }, this.CONSTANTS.INSTALL_BANNER_DELAY);
    }
    
    async handleInstall() {
        if (!this.deferredPrompt) return;
        
        try {
            await this.deferredPrompt.prompt();
            const choiceResult = await this.deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                this.showNotification('App will be installed', 'success');
            }
            
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        } catch (error) {
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        }
    }
    
    handleDismissInstall() {
        localStorage.setItem('install-dismissed', 'true');
        this.hideInstallPrompt();
    }
    
    hideInstallPrompt() {
        if (this.installBanner) {
            this.installBanner.remove();
            this.installBanner = null;
        }
    }
    
    handleClassChange(e) {
        const btn = e.target.closest('.tab');
        if (!btn) return;
        
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const classValue = btn.dataset.class;
        this.currentClass = (classValue === 'others' || classValue === 'prompts' || classValue === 'music') ? classValue : parseInt(classValue, 10);
        
        this.updateDownloadButton();
        
        if (this.currentClass === 'music') {
            if (window.musicApp) {
                window.musicApp.render();
            }
        } else {
            if (window.musicApp) {
                window.musicApp.closePlayer();
            }
            this.render();
        }
    }
    
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
            
            let filename;
            if (this.currentClass === 'music') {
                filename = 'Songs.zip';
            } else if (this.currentClass === 11 || this.currentClass === 12) {
                filename = `Class_${this.currentClass}th_Modules.zip`;
            } else {
                filename = `${this.currentClass}_Materials.zip`;
            }
            
            link.download = filename;
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
    
    updateDownloadButton() {
        if (!this.elements.downloadBtn || !this.elements.downloadText) return;
        
        if (this.currentClass === 'others' || this.currentClass === 'prompts') {
            this.elements.downloadBtn.style.display = 'none';
            if (this.elements.viewToggleBtn) {
                this.elements.viewToggleBtn.style.display = 'none';
            }
        } else if (this.currentClass === 'music') {
            this.elements.downloadBtn.style.display = 'flex';
            this.elements.downloadText.textContent = 'Download All';
            if (this.elements.viewToggleBtn) {
                this.elements.viewToggleBtn.style.display = 'flex';
                this.updateViewToggleIcon();
            }
        } else {
            this.elements.downloadBtn.style.display = 'flex';
            const className = this.currentClass === 11 ? '11th' : '12th';
            this.elements.downloadText.textContent = `Download Class ${className} (All Materials)`;
            if (this.elements.viewToggleBtn) {
                this.elements.viewToggleBtn.style.display = 'none';
            }
        }
    }
    
    handleViewToggle() {
        if (window.musicApp && this.currentClass === 'music') {
            window.musicApp.toggleViewMode();
            this.updateViewToggleIcon();
        }
    }
    
    updateViewToggleIcon() {
        if (!this.elements.viewToggleIcon || !window.musicApp) return;
        
        const isGridView = window.musicApp.viewMode === 'grid';
        
        if (isGridView) {
            // Show list icon (to switch to list view)
            this.elements.viewToggleIcon.innerHTML = `
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
            `;
            this.elements.viewToggleBtn.setAttribute('title', 'Switch to list view');
            this.elements.viewToggleBtn.setAttribute('aria-label', 'Switch to list view');
        } else {
            // Show grid icon (to switch to grid view)
            this.elements.viewToggleIcon.innerHTML = `
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
            `;
            this.elements.viewToggleBtn.setAttribute('title', 'Switch to grid view');
            this.elements.viewToggleBtn.setAttribute('aria-label', 'Switch to grid view');
        }
    }
    
    handleSearch(e) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchTerm = e.target.value.trim();
            if (this.currentClass === 'music' && window.musicApp) {
                window.musicApp.render();
            } else {
                this.render();
            }
        }, this.CONSTANTS.SEARCH_DEBOUNCE);
    }
    
    handleItemClick(e) {
        const item = e.target.closest('.item');
        if (!item) return;
        
        e.preventDefault();
        
        const fileUrl = item.dataset.pdf;
        const fileNameElement = item.querySelector('.item-name');
        const fileName = fileNameElement ? fileNameElement.textContent : 'Document';
        
        if (!fileUrl) {
            this.showNotification('File URL not found', 'error');
            return;
        }
        
        if (fileUrl.endsWith('.txt')) {
            this.openTextModal(fileUrl, fileName);
        } else {
            this.openPdfModal(fileUrl, fileName);
        }
    }
    
    openPdfModal(url, title) {
        if (!this.elements.modal || !this.elements.pdfViewer) {
            this.showNotification('Modal not available', 'error');
            return;
        }
        
        let decodedUrl = url;
        try {
            decodedUrl = decodeURIComponent(url);
        } catch (decodeError) {
            // URL already decoded or malformed - use as-is
            decodedUrl = url;
        }
        
        this.currentPdfUrl = decodedUrl;
        
        if (this.elements.pdfTitle) {
            this.elements.pdfTitle.textContent = title;
        }
        
        this.elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.elements.closeModal?.focus();
        }, 100);
        
        const isMobileOrTablet = this.isMobileOrTabletDevice();
        
        if (isMobileOrTablet) {
            window.open(this.currentPdfUrl, '_blank', 'noopener,noreferrer');
            this.closeModal();
        } else {
            this.loadPdfInIframe(this.currentPdfUrl);
        }
    }
    
    async openTextModal(url, title) {
        if (!this.elements.textModal || !this.elements.textViewer) {
            this.showNotification('Text viewer not available', 'error');
            return;
        }
        
        let decodedUrl = url;
        try {
            decodedUrl = decodeURIComponent(url);
        } catch (decodeError) {
            // URL already decoded or malformed - use as-is
            decodedUrl = url;
        }
        
        if (this.elements.textTitle) {
            this.elements.textTitle.textContent = title;
        }
        
        this.elements.textModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        try {
            const response = await fetch(decodedUrl);
            if (!response.ok) throw new Error('Failed to load text');
            const text = await response.text();
            this.elements.textViewer.textContent = text;
            
            setTimeout(() => {
                this.elements.closeTextModal?.focus();
            }, 100);
        } catch (error) {
            this.showNotification('Failed to load text file', 'error');
            this.closeTextModal();
        }
    }
    
    isMobileOrTabletDevice() {
        const userAgent = navigator.userAgent || '';
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        
        if (mobileRegex.test(userAgent)) return true;
        
        const isAndroidTablet = /Android/i.test(userAgent) && !/Mobile/i.test(userAgent);
        if (isAndroidTablet) return true;
        
        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice && screenWidth >= 600 && screenWidth <= 1024) {
            return true;
        }
        
        return false;
    }
    
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
                if (!this.elements.pdfViewer.contentDocument && !this.elements.pdfViewer.contentWindow) {
                    errorHandler();
                }
            } catch (crossOriginError) {
                // Cross-origin restriction expected - PDF loading normally in iframe
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
        
        setTimeout(() => {
            this.elements.searchInput?.focus();
        }, 100);
    }
    
    closeTextModal() {
        if (!this.elements.textModal) return;
        
        this.elements.textModal.classList.remove('active');
        
        if (this.elements.textViewer) {
            this.elements.textViewer.textContent = '';
        }
        
        if (this.elements.textTitle) {
            this.elements.textTitle.textContent = '';
        }
        
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.elements.searchInput?.focus();
        }, 100);
    }
    
    async copyTextToClipboard() {
        if (!this.elements.textViewer) return;
        
        const text = this.elements.textViewer.textContent;
        
        if (!text) {
            this.showNotification('No text to copy', 'warning');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard', 'success');
            
            if (this.elements.copyText) {
                this.elements.copyText.classList.add('copied');
                setTimeout(() => {
                    this.elements.copyText?.classList.remove('copied');
                }, 2000);
            }
        } catch (clipboardError) {
            // Fallback for browsers without Clipboard API support
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '0';
            textArea.setAttribute('readonly', '');
            document.body.appendChild(textArea);
            
            try {
                textArea.select();
                textArea.setSelectionRange(0, text.length);
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (successful) {
                    this.showNotification('Copied to clipboard', 'success');
                } else {
                    this.showNotification('Failed to copy', 'error');
                }
            } catch (fallbackError) {
                document.body.removeChild(textArea);
                this.showNotification('Copy not supported', 'error');
            }
        }
    }
    
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
    
    generateCategoryHTML(category, pdfs) {
        if (!Array.isArray(pdfs)) return '';
        
        const pdfsHTML = pdfs.map(pdf => {
            if (!pdf || !pdf.file || !pdf.name) return '';
            
            const encodedPath = pdf.file.split('/').map(part => encodeURIComponent(part)).join('/');
            const badge = pdf.file.endsWith('.txt') ? 'TXT' : 'PDF';
            
            return `
            <a href="#" class="item" data-pdf="${this.sanitizeAttribute(encodedPath)}" role="button" aria-label="Open ${this.sanitizeText(pdf.name)}">
                <div class="pdf-badge" aria-hidden="true">${badge}</div>
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
    
    sanitizeText(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
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
    
    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };
        
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icons[type] || icons.info}</div>
                <div class="toast-body">
                    <div class="toast-title">${titles[type]}</div>
                    <div class="toast-message">${this.sanitizeText(message)}</div>
                </div>
                <button class="toast-close" aria-label="Close notification">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="toast-progress"></div>
        `;
        
        document.body.appendChild(toast);
        
        const closeBtn = toast.querySelector('.toast-close');
        const removeToast = () => {
            if (toast.parentNode) {
                toast.classList.add('removing');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        };
        
        closeBtn.addEventListener('click', removeToast);
        
        setTimeout(removeToast, 3000);
    }
    
    showError(message) {
        if (this.elements.content) {
            this.elements.content.innerHTML = `<div class="empty error">${this.sanitizeText(message)}</div>`;
        }
    }
}

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
