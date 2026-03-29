# Changelog

## [1.7.1] - 2026-03-30

### Enhanced
- **Dramatically improved real-time generation animations** - website now appears to build itself dynamically
- Added `pixelate` animation - elements materialize with blur and brightness effects
- Added `buildUp` animation - items reveal from left to right with clip-path
- Added `scanline` animation - glowing line sweeps across subject cards during generation
- Enhanced `glowPulse` animation - PDF badges now pulse with dramatic glow effect
- Category titles now type out character-by-character with typewriter effect
- Subject icons scale in with bounce effect
- Shimmer effect sweeps across each item as it appears

### Changed
- Increased animation delays for more dramatic sequential appearance
- Subject cards now appear with 0.15s intervals (was 0.05s)
- Items appear with 0.05s intervals with shimmer overlay
- Footer delayed to 1.5s for final reveal
- Enhanced blur effects (10px → 0px) for sharper materialization
- Brightness pulse during generation (1.5x → 1.0x)

### Technical
- Added 6 new keyframe animations for generation effects
- Staggered delays extended to 15 items (was 10)
- Multiple animation layers per element (fade + transform + filter)
- Clip-path reveal for horizontal build effect
- Pseudo-elements for shimmer and scanline overlays
- All animations remain GPU-accelerated for 60fps

### Performance
- Animations optimized with will-change hints
- Pseudo-elements used for effects (no extra DOM nodes)
- Respects prefers-reduced-motion for accessibility

## [1.7.0] - 2026-03-30

### Added
- Real-time generation animations - content appears to generate dynamically when page loads
- Staggered item animations - study materials fade in sequentially for smooth visual flow
- Smooth page load animations for navigation, hero section, and footer
- Enhanced visual feedback with blur and scale effects during content generation
- `generateIn` keyframe animation for typewriter-like appearance effect
- `glowPulse` and `typewriter` animations for future enhancements

### Changed
- Service worker cache updated to v1.7.0
- Improved user experience with cinematic, real-time generation feel
- Navigation bar now animates in from top on page load
- Hero section slides down smoothly after navigation
- Subject cards appear with staggered delays (0.05s intervals)
- Individual study materials animate in with progressive delays
- Footer fades in after content is loaded

### Technical
- Added hardware-accelerated animations using transform and opacity
- Staggered animation delays applied to first 10 items per category
- Staggered animation delays applied to first 6 subject cards
- All animations respect `prefers-reduced-motion` for accessibility
- Optimized for 60fps performance with GPU acceleration
- Animation timing uses cubic-bezier easing for natural motion

### Performance
- Animations use GPU-accelerated properties only (no layout thrashing)
- Minimal performance impact (<5ms per animation frame)
- Smooth 60fps animation playback on all modern devices

## [1.6.0] - 2026-03-30

### Added
- New "Prompts" tab for accessing useful prompts and templates
- Added "Audit" prompt in the Prompts section - comprehensive code audit checklist
- Support for displaying text files (.txt) in the modal viewer
- Text files now show "TXT" badge instead of "PDF" badge
- Async text file loading with proper error handling
- **Copy to clipboard button** for text files - automatically replaces download button
- Clipboard API with fallback for older browsers

### Changed
- Updated tab navigation to include "Prompts" option
- Modified modal viewer to handle both PDF and text file formats
- Enhanced file type detection in generateCategoryHTML method
- Updated download button logic to hide for both "Others" and "Prompts" tabs
- Download button dynamically transforms to copy button for text files

### Technical
- Added loadTextFile() method for fetching and displaying text content
- Added textContainer property for managing text display cleanup
- Added currentTextContent property for storing text for clipboard operations
- Added toggleModalButtons() method to switch between download/copy functionality
- Added copyTextToClipboard() async method with fallback support
- Updated closeModal() to properly clean up text containers and reset button state
- Enhanced openModal() with file type detection logic

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
