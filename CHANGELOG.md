# Changelog

## [1.2.1] - 2026-03-26

### Changed
- Removed debug console.log statements from production code
- Removed emoji from README for professional presentation
- Cleaned up service worker error handling
- Fixed manifest.json icon sizes to match actual file dimensions (500x500)
- Removed IDE-specific .vscode directory from repository
- Improved code comments for clarity

### Fixed
- Service worker registration error handling now silent
- PDF modal error handling streamlined without debug output

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
