# Changelog

## [1.4.2] - 2026-03-28

### Added
- **Rotation Support:** PWA now respects device auto-rotate settings
  - Changed orientation from "portrait-primary" to "any" in manifest
  - Added landscape-specific media queries for optimal viewing
  - Optimized layout for landscape mode on phones and tablets
  - Better spacing and grid layout in landscape orientation

### Changed
- **Landscape Optimizations:**
  - Reduced vertical padding when height < 600px in landscape
  - Adjusted grid columns for better content distribution
  - Optimized modal header for landscape viewing
  - Better navigation bar spacing in landscape
  - Improved subject card layout in landscape mode

### Technical Details
- Added 4 landscape-specific media queries
- Responsive grid: minmax(320px, 1fr) in landscape
- Maintains all functionality across orientations
- Smooth transitions when rotating device

## [1.4.1] - 2026-03-28

### Fixed
- **CORS Issues:** Added proper crossorigin attributes to font preconnect and stylesheet links
- **Service Worker Errors:** 
  - Updated cache version to v1.4.0
  - Added error handling for failed cache operations
  - Skip non-http(s) requests (chrome-extension, etc.)
  - Improved error handling in fetch event
  - Better cache.put error handling
- **Font Loading:** Added comprehensive fallback font stack (Inter → System fonts)
- **Theme Colors:** Updated manifest.json theme colors to match new design (#ff4757, #0f0f0f)
- **Cache Headers:** Removed aggressive no-cache headers that were causing issues

### Technical Details
- Service worker now gracefully handles cache failures
- Font loading won't block page render if Google Fonts fail
- CORS properly configured for cross-origin resources
- Better error handling throughout service worker lifecycle

## [1.4.0] - 2026-03-28

### Changed - Premium UI/UX Redesign
- **Typography Overhaul:**
  - Switched from DM Sans/Space Grotesk to Inter for a more professional, human-crafted feel
  - Improved font rendering with optimizeLegibility and font-feature-settings
  - Better letter-spacing and line-height for enhanced readability
  - Refined font weights (400, 500, 600, 700) for proper hierarchy

- **Color System Refinement:**
  - Expanded color palette with semantic naming (--text-secondary, --text-tertiary)
  - Added dedicated background colors (--bg-elevated, --surface, --card)
  - Refined accent colors with hover states (--accent-hover)
  - Subject-specific background colors for better visual distinction
  - Improved border colors with hover states (--border, --border-hover)
  - Professional shadow system (--shadow-sm through --shadow-xl)

- **Component Redesign:**
  - Navigation: Refined backdrop blur (24px), improved shadow depth
  - Search: Added search icon, inset shadow, focus ring effect
  - Tabs: Subtle background with inset shadow, refined active state
  - Subject Cards: Reduced border radius (16px), improved hover lift (4px)
  - Icons: Larger size (44px), subtle borders, refined hover scale (1.08x)
  - PDF Items: Left accent bar on hover, improved spacing, better typography
  - PDF Badge: Larger (32px), refined gradient, better shadow
  - Download Button: Refined gradient overlay, improved shadow depth
  - Modal: Better header shadow, refined button sizes (36px)

- **Spacing & Layout:**
  - Consistent padding system (32px desktop, 24px tablet, 20px mobile)
  - Improved max-width (1280px) for better readability
  - Better gap spacing throughout (14px, 18px, 20px, 24px)
  - Refined grid system (auto-fill, minmax(360px, 1fr))

- **Micro-Interactions:**
  - Refined cubic-bezier easing (0.4, 0, 0.2, 1) for smoother animations
  - Better hover states with subtle color transitions
  - Improved focus states with ring effects
  - Refined transform values for more natural movement
  - Better button press feedback

- **Visual Hierarchy:**
  - Clearer distinction between primary, secondary, and tertiary text
  - Better use of opacity for depth perception
  - Improved contrast ratios for accessibility
  - Refined border usage for subtle separation
  - Better shadow usage for elevation

### Technical Improvements
- Removed unnecessary pseudo-elements and overlays
- Simplified CSS with better use of CSS variables
- Improved performance with optimized selectors
- Better mobile responsiveness with refined breakpoints
- Maintained zero console statements and zero vulnerabilities

### Design Philosophy
- Human-crafted feel: Intentional spacing, refined typography, thoughtful details
- Premium aesthetic: Subtle shadows, refined colors, professional polish
- Functional beauty: Every design decision serves usability
- Accessibility-first: Proper contrast, readable text, clear hierarchy

## [1.3.0] - 2026-03-28

### Added
- **Real-time Generation Animations:** Sophisticated staggered animations create a "generating in real-time" effect
  - Page elements animate in sequentially on load (nav → hero → content)
  - Subjects, categories, and items animate with cascading delays
  - Smooth fade transitions when switching between classes
  - Modal animations with scale and fade effects
  - Enhanced button hover states with micro-interactions
  
- **Performance Optimizations:**
  - Hardware acceleration using `transform: translateZ(0)` and `backface-visibility: hidden`
  - `will-change` property for optimized animations
  - `requestAnimationFrame` for smooth 60fps animations
  - Respects `prefers-reduced-motion` for accessibility
  
- **Enhanced Interactions:**
  - Download button icon bounces on hover
  - Close button rotates 90° on hover
  - PDF badge scales and glows on hover
  - Subject icons rotate and scale on hover
  - Tab buttons with smooth background transitions
  - Search input lifts with shadow on focus
  
- **Smooth Transitions:**
  - Content fades out/in when switching classes (300ms)
  - Modal overlay fades in (200ms)
  - Modal content scales in (300ms)
  - Install banner slides up from bottom

### Changed
- Increased app.js from 334 to 374 lines (animation logic)
- Increased styles.css from 634 to 908 lines (animation styles)
- All animations use CSS for optimal performance
- Staggered delays calculated dynamically in JavaScript

### Technical Details
- Zero performance impact: animations use GPU-accelerated properties (transform, opacity)
- Accessibility-first: respects user's motion preferences
- No layout shifts: animations use transform instead of position changes
- Optimized rendering: uses `requestAnimationFrame` for smooth animations
- Security maintained: zero console statements, zero vulnerabilities

## [1.2.6] - 2026-03-26

### Fixed
- **CRITICAL BUG:** Class 12th Physics modules now showing all 15 files (was showing only 5)
  - Added missing modules: Capacitance, Diffraction & Polarisation, Errors in Measurements & Instruments, Geometrical Optics, Gravitation, Magnetic Properties of Matter & Electromagnetic Waves, Optical Instruments, Surface Tension & Viscosity, Wave Optics
  - Fixed file path casing (Mega_XII vs mega_XII)
  - Reorganized into 4 categories: Electromagnetism (6), Optics (4), Modern Physics (2), Mechanics & Others (3)

- **CRITICAL BUG:** Class 12th Mathematics modules now showing all 14 files (was showing only 7)
  - Added missing modules: Functions, Inverse Trigonometric Functions, Complex Numbers, Statistics, Conic Section
  - Combined related topics: "Indefinite & Definite Integration", "Differential Equation & Area Under the Curve", "Vectors & 3-D"
  - Fixed file path casing to match actual files
  - Reorganized into 3 categories: Calculus (7), Algebra & Vectors (6), Coordinate Geometry (1)

### Changed
- Updated data.js to match actual file structure in directories
- All 29 Class 12th modules now properly accessible (15 Physics + 14 Mathematics)

## [1.2.5] - 2026-03-26

### Added
- **Native App Feel:** Disabled pull-to-refresh gesture for more native application experience
- Added `overscroll-behavior: none` to prevent browser refresh on downward scroll
- Improves PWA usability on mobile devices

### Changed
- Enhanced mobile UX by preventing default browser pull-to-refresh behavior

## [1.2.4] - 2026-03-26

### Fixed
- **Mobile PDF Viewing:** Removed Google Docs Viewer dependency (was showing "No preview available")
- PDFs now open directly in new tab on mobile devices for native viewing
- Desktop continues to use iframe with fallback to new tab
- Simplified and more reliable PDF viewing across all devices

### Changed
- Mobile devices now open PDFs in new tab using device's native PDF viewer
- Removed external dependency on Google Docs Viewer
- Reduced timeout back to 3 seconds for better responsiveness
- Cleaner, more maintainable code

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
