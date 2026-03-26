'use strict';

class StudyMaterialsApp {
    constructor() {
        this.currentClass = CONFIG.DEFAULT_CLASS;
        this.searchTerm = '';
        this.searchTimeout = null;
        this.deferredPrompt = null;
        
        this.elements = {
            content: document.getElementById('content'),
            searchInput: document.getElementById('searchInput'),
            downloadBtn: document.getElementById('downloadBtn'),
            downloadText: document.getElementById('downloadText'),
            modal: document.getElementById('pdfModal'),
            pdfViewer: document.getElementById('pdfViewer'),
            pdfTitle: document.getElementById('pdfTitle'),
            closeModal: document.getElementById('closeModal'),
            modalOverlay: document.querySelector('.modal-overlay')
        };
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.setupPWA();
        this.updateDownloadButton();
        this.render();
    }
    
    attachEventListeners() {
        document.querySelectorAll('.tab').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleClassChange(e));
        });
        
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        
        this.elements.downloadBtn.addEventListener('click', () => this.handleDownload());
        
        document.addEventListener('click', (e) => this.handlePdfClick(e));
        
        this.elements.closeModal.addEventListener('click', () => this.closeModal());
        this.elements.modalOverlay.addEventListener('click', () => this.closeModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        // Handle fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('msfullscreenchange', () => this.handleFullscreenChange());
    }
    
    handleFullscreenChange() {
        // If user exits fullscreen manually (e.g., pressing Esc), close the modal
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (this.elements.modal.classList.contains('active')) {
                this.closeModal();
            }
        }
    }
    
    setupPWA() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
        });
    }
    
    showInstallPrompt() {
        const installBanner = document.createElement('div');
        installBanner.className = 'install-banner';
        installBanner.innerHTML = `
            <div class="install-content">
                <div class="install-text">
                    <strong>Install Vibrant Academy</strong>
                    <span>Access materials offline anytime</span>
                </div>
                <div class="install-actions">
                    <button class="install-btn" id="installBtn">Install</button>
                    <button class="dismiss-btn" id="dismissBtn">×</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(installBanner);
        
        document.getElementById('installBtn').addEventListener('click', async () => {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                await this.deferredPrompt.userChoice;
                this.deferredPrompt = null;
                installBanner.remove();
            }
        });
        
        document.getElementById('dismissBtn').addEventListener('click', () => {
            installBanner.remove();
        });
        
        setTimeout(() => {
            installBanner.classList.add('show');
        }, 100);
    }
    
    handleClassChange(e) {
        const btn = e.target.closest('.tab');
        if (!btn) return;
        
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentClass = parseInt(btn.dataset.class, 10);
        this.updateDownloadButton();
        this.render();
    }
    
    handleDownload() {
        const zipPath = CONFIG.DOWNLOAD_PATHS[this.currentClass];
        
        if (!zipPath) {
            alert('Download not available for this class');
            return;
        }
        
        const link = document.createElement('a');
        link.href = zipPath;
        link.download = `Class_${this.currentClass}_Modules.zip`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    updateDownloadButton() {
        const className = this.currentClass === 11 ? '11th' : '12th';
        this.elements.downloadText.textContent = `Download Class ${className} (All Materials)`;
    }

    
    handleSearch(e) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchTerm = e.target.value.trim();
            this.render();
        }, CONFIG.SEARCH_DEBOUNCE_MS);
    }
    
    handlePdfClick(e) {
        const item = e.target.closest('.item');
        if (!item) return;
        
        e.preventDefault();
        const pdfUrl = item.dataset.pdf;
        const pdfName = item.querySelector('.item-name').textContent;
        
        this.openModal(pdfUrl, pdfName);
    }
    
    openModal(url, title) {
        this.elements.pdfViewer.src = url;
        this.elements.pdfTitle.textContent = title;
        this.elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Request fullscreen on desktop devices (screen width > 768px)
        if (window.innerWidth > 768) {
            this.requestFullscreen();
        }
    }
    
    requestFullscreen() {
        const elem = this.elements.modal;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(() => {
                // Fullscreen request failed - user may have denied permission
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    closeModal() {
        this.exitFullscreen();
        this.elements.modal.classList.remove('active');
        this.elements.pdfViewer.src = '';
        this.elements.pdfTitle.textContent = '';
        document.body.style.overflow = '';
    }
    
    render() {
        const materials = STUDY_MATERIALS[this.currentClass];
        
        if (!materials) {
            this.elements.content.innerHTML = '<div class="empty">No materials available</div>';
            return;
        }
        
        const filtered = this.filterMaterials(materials);
        
        if (Object.keys(filtered).length === 0) {
            this.elements.content.innerHTML = `<div class="empty">No results for "${this.escapeHtml(this.searchTerm)}"</div>`;
            return;
        }
        
        this.elements.content.innerHTML = this.generateHTML(filtered);
    }

    
    filterMaterials(materials) {
        if (!this.searchTerm) return materials;
        
        const result = {};
        const lowerTerm = this.searchTerm.toLowerCase();
        
        Object.entries(materials).forEach(([subject, data]) => {
            const filteredCategories = {};
            
            Object.entries(data.categories).forEach(([category, pdfs]) => {
                const matchedPdfs = pdfs.filter(pdf => 
                    pdf.name.toLowerCase().includes(lowerTerm) ||
                    category.toLowerCase().includes(lowerTerm) ||
                    subject.toLowerCase().includes(lowerTerm)
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
            const config = SUBJECT_CONFIG[subject];
            const categoriesHTML = Object.entries(data.categories).map(([category, pdfs]) => 
                this.generateCategoryHTML(category, pdfs)
            ).join('');
            
            return `
                <div class="subject">
                    <div class="subject-head">
                        <div class="icon ${config.color}">${config.icon}</div>
                        <h2 class="subject-title">${this.escapeHtml(subject)}</h2>
                    </div>
                    ${categoriesHTML}
                </div>
            `;
        }).join('');
        
        return `<div class="grid">${subjectsHTML}</div>`;
    }

    
    generateCategoryHTML(category, pdfs) {
        const pdfsHTML = pdfs.map(pdf => `
            <a href="#" class="item" data-pdf="${this.escapeHtml(encodeURI(pdf.file))}">
                <div class="pdf-badge">PDF</div>
                <span class="item-name">${this.escapeHtml(pdf.name)}</span>
                <svg class="arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
        `).join('');
        
        return `
            <div class="cat">
                <div class="cat-title">${this.escapeHtml(category)}</div>
                <div class="items">${pdfsHTML}</div>
            </div>
        `;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StudyMaterialsApp();
});
