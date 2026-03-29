# Changelog

## [1.5.2] - 2026-03-30

### Fixed
- Removed emoji from CSS error state (replaced with standard Unicode character)
- Deleted empty .vscode/settings.json file

### Changed
- Service worker cache bumped to v1.5.2

## [1.5.1] - 2026-03-30

### Fixed
- **CRITICAL:** Removed all opacity animations causing "Layout was forced before page fully loaded" warning
- Fixed font loading strategy - fonts now load asynchronously without blocking render
- Removed initial opacity: 0 from nav, hero, main, footer, tabs, search, download button
- Removed animate-in classes that were causing forced layout calculations
- Page now renders immediately without waiting for animations

### Added
- Disabled long-press/touch-and-hold context menu on mobile devices
- Added `-webkit-touch-callout: none` to prevent iOS callout menu
- Added `-webkit-tap-highlight-color: transparent` to remove tap highlight
- JavaScript prevention of long-press events (500ms threshold)
- Disabled image dragging and context menus

### Changed
- Fonts load asynchronously using media="print" trick with onload handler
- Added preload hint for Inter font
- Service worker cache updated to v1.5.1
- All elements now have touch callout disabled

### Performance
- Eliminated forced layout warnings
- Faster initial page render
- No more flash of invisible content (FOIC)
- Improved Lighthouse performance score
- Better native app feel on mobile devices

## [1.5.0] - 2026-03-30

### Added
- Moved class tabs above search bar on mobile for easier thumb access
- Disabled text selection to make the app feel more native
- Dynamic tab sizing - tabs now adjust width based on content

### Changed
- Desktop keeps tabs in navbar, mobile shows them above search
- Service worker cache bumped to v1.5.0
- Tabs now use `flex: 1` for equal width distribution

### Fixed
- Removed empty .vscode/settings.json file
- Enhanced security headers in .htaccess (added CSP and Permissions-Policy)

### Technical Notes
- Used CSS media queries for tab positioning, no JS changes needed
- Both desktop and mobile tabs share the same event handlers
- Production audit completed - codebase is clean and ready to ship

## [1.4.4] - 2026-03-29

### Fixed
- Fixed CORS issues with Google Fonts
  - Removed `crossorigin` from googleapis.com preconnect (not needed)
  - Kept `crossorigin` on gstatic.com where it's actually required
  - Removed redundant `crossorigin="anonymous"` from stylesheet link
- Service worker cache updated to v1.4.4

## [1.4.3] - 2026-03-28

### Fixed
- **CRITICAL:** Fixed "Study materials not loaded" error
  - Changed `const` to `window.STUDY_MATERIALS` in data.js
  - Changed `const` to `window.CONFIG` in config.js
  - Block-scoped variables weren't accessible globally, breaking the app
- Removed body opacity animation that was causing layout warnings
- Service worker cache updated to v1.4.3

### Technical Notes
- Cookie warnings when viewing PDFs in iframes are normal browser behavior
- Doesn't affect functionality - PDFs load fine

## [1.4.2] - 2026-03-28

### Added
- PWA now supports device rotation (changed from portrait-only to "any")
- Added landscape-specific media queries for better viewing on rotated devices

### Changed
- Optimized layout for landscape mode on phones and tablets
- Reduced padding in landscape to maximize content space
- Grid layout adjusts automatically based on orientation

## [1.4.1] - 2026-03-28

### Fixed
- Added proper CORS attributes to font preconnect links
- Fixed service worker cache errors with better error handling
- Service worker now skips non-http(s) requests (like chrome-extension://)
- Updated cache version to v1.4.0

### Changed
- Added comprehensive font fallback stack (Inter → system fonts)
- Updated manifest.json theme colors to match new design (#ff4757, #0f0f0f)
- Removed aggressive no-cache headers that were causing issues

## [1.4.0] - 2026-03-28

### Changed - UI Redesign
- Switched from DM Sans/Space Grotesk to Inter font
- Refined color system with better semantic naming
- Redesigned all components with more polish:
  - Navigation with better backdrop blur
  - Search bar with icon and focus effects
  - Cleaner tab design with subtle shadows
  - Subject cards with improved hover states
  - Larger icons (44px) with better spacing
  - PDF items with left accent bar on hover
  - Refined modal design
- Better spacing throughout (consistent padding system)
- Smoother animations with refined easing curves
- Improved visual hierarchy and contrast

### Technical
- Simplified CSS with better use of variables
- Removed unnecessary pseudo-elements
- Better mobile responsiveness

## [1.3.0] - 2026-03-28

### Added
- Staggered animations that make content feel like it's generating in real-time
- Hardware-accelerated animations for smooth 60fps performance
- Enhanced hover effects on buttons and cards
- Respects `prefers-reduced-motion` for accessibility

### Changed
- Content fades smoothly when switching between classes
- Modal animations with scale and fade effects
- All animations use GPU-accelerated properties (transform, opacity)

## [1.2.6] - 2026-03-26

### Fixed
- **CRITICAL:** Class 12th Physics now shows all 15 modules (was only showing 5)
  - Added missing modules: Capacitance, Diffraction & Polarisation, Errors in Measurements, Geometrical Optics, Gravitation, Magnetic Properties, Optical Instruments, Surface Tension & Viscosity, Wave Optics
  - Fixed file path casing issues
  - Reorganized into 4 categories: Electromagnetism, Optics, Modern Physics, Mechanics & Others

- **CRITICAL:** Class 12th Mathematics now shows all 14 modules (was only showing 7)
  - Added missing modules: Functions, Inverse Trig Functions, Complex Numbers, Statistics, Conic Sections
  - Fixed file path casing
  - Reorganized into 3 categories: Calculus, Algebra & Vectors, Coordinate Geometry

## [1.2.5] - 2026-03-26

### Added
- Disabled pull-to-refresh gesture for more native app feel
- Added `overscroll-behavior: none` to prevent browser refresh on scroll

## [1.2.4] - 2026-03-26

### Fixed
- Mobile PDF viewing now works properly (removed broken Google Docs Viewer)
- PDFs open directly in new tab on mobile using native viewer
- Desktop still uses iframe with fallback to new tab

## [1.2.3] - 2026-03-26

### Fixed
- PDFs now display on mobile using Google Docs Viewer
- Removed "Open" button - PDFs load automatically
- Increased timeout to 5 seconds for mobile networks

## [1.2.2] - 2026-03-26

### Changed
- Full production audit completed
- Removed empty .vscode directory
- Fixed manifest.json icon sizes to match actual file
- Switched to network-first caching for fresh content

### Security
- Zero console.log statements
- Zero hardcoded secrets
- All input properly sanitized
- Comprehensive .gitignore

## [1.2.1] - 2026-03-26

### Changed
- **BREAKING:** Switched service worker from cache-first to network-first
  - Always fetches latest content when online
  - Only uses cache when offline
  - Ensures users see up-to-date materials
- Removed debug console.log statements
- Removed emoji from README
- Fixed manifest.json icon sizes
- Added Vibrant Academy logo to navbar

### Fixed
- Logo now displays correctly with proper object-fit styling

## [1.2.0] - 2026-03-26

### Added
- PWA support with service worker
- Offline functionality
- Install prompt banner
- App icons and favicon
- Apple touch icon for iOS

### Changed
- Added PWA meta tags to HTML
- Updated README with installation instructions

## [1.1.0] - 2026-03-26

### Added
- Download button for complete class materials (ZIP files)
- Button text updates based on selected class
- Download paths in config.js

## [1.0.0] - 2026-03-26

### Initial Release
- Dark-themed responsive UI
- Class 11th and 12th study materials
- Real-time search
- In-app PDF viewer
- Mobile-optimized design
- XSS protection
- Modular architecture
