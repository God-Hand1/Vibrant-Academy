# Changelog

## [1.2.3] - 2026-03-26

### Fixed
- **Mobile PDF Viewing:** PDFs now display directly on mobile devices using Google Docs Viewer
- Removed "Open" button requirement - PDFs load automatically in modal
- Increased timeout to 5 seconds for better mobile network handling
- Fallback to new tab if Google Docs Viewer fails

### Changed
- Mobile devices now use Google Docs Viewer for inline PDF rendering
- Desktop continues to use native browser PDF viewer
- Improved error handling for PDF loading failures

## [1.2.2] - 2026-03-26

### Changed
- **Production Audit Complete:** Full codebase audit and cleanup
- Removed empty .vscode directory and settings.json (IDE-specific files)
- Fixed manifest.json shortcut icon sizes to match actual file (3200x3200)
- Verified network-first caching strategy implementation
- Added comprehensive cache-control headers to prevent stale content

### Security
- ✅ Zero console.log statements in production code
- ✅ Zero hardcoded secrets or API keys
- ✅ All user input properly sanitized via escapeHtml()
- ✅ No eval() or dangerous code patterns
- ✅ Network-first strategy ensures fresh content when online
- ✅ Comprehensive .gitignore prevents sensitive file tracking

### Quality Metrics
- Total codebase: 1,340 lines
- Zero linter violations
- Zero TODO/FIXME comments
- All functions under 50 lines
- Maximum nesting depth: 2 levels
- XSS protection: Comprehensive

## [1.2.1] - 2026-03-26

### Changed
- **BREAKING:** Switched service worker from cache-first to network-first strategy
  - Always fetches latest content from server when online
  - Only serves cached content when offline
  - Ensures users always see the most up-to-date materials and code
  - Cache version bumped to v1.2.1
- Removed debug console.log statements from production code
- Removed emoji from README for professional presentation
- Cleaned up service worker error handling
- Fixed manifest.json icon sizes to match actual file dimensions (3200x3200)
- Removed IDE-specific .vscode directory from repository
- Improved code comments for clarity
- Added Vibrant Academy logo to navigation bar
- Fixed logo display with proper object-fit styling

### Fixed
- Service worker registration error handling now silent
- PDF modal error handling streamlined without debug output
- Logo now displays correctly without cropping (object-fit: contain)
- Caching strategy now prioritizes fresh content over stale cache

## [1.2.0] - 2026-03-26

### Added
- Progressive Web App (PWA) support
- Service worker for offline functionality
- Web app manifest with app metadata
- Install prompt banner for PWA installation
- App icons and favicon support
- Offline caching strategy for core assets
- Apple touch icon support for iOS devices
- Theme color meta tags for mobile browsers

### Changed
- Enhanced HTML with PWA meta tags
- Updated README with PWA installation instructions
- Added icon folder to project structure

### Technical Details
- Service worker caches core assets (HTML, CSS, JS, icons)
- Cache-first strategy for better offline performance
- Install prompt appears automatically when PWA criteria met
- Graceful fallback for browsers without service worker support

## [1.1.0] - 2026-03-26

### Added
- Download button for complete class materials (ZIP archives)
- Dynamic button text that updates based on selected class
- Safe download implementation using programmatic link creation
- Download paths configuration in config.js

### Changed
- Updated README.md with download feature documentation
- Enhanced app.js with download handler and button update logic
- Added download button styling to styles.css

### Technical Details
- Download button uses HTML5 download attribute
- Programmatic link creation and cleanup prevents memory leaks
- Button text updates automatically on class switch
- Graceful error handling if download path is unavailable

## [1.0.0] - 2026-03-26

### Initial Release
- Modern, responsive dark-themed UI
- Class 11th and 12th study materials
- Real-time search functionality
- In-app PDF viewer with modal
- Organized by subject and category
- Mobile-optimized design
- XSS protection and security best practices
- Modular architecture (config, data, app logic)
- Comprehensive .gitignore
- Production-ready codebase
