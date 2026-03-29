# Vibrant Academy Study Materials

A comprehensive progressive web application providing curated study materials for Class 11th and 12th students, as well as Computer Science and Engineering resources for undergraduate students.

## Overview

Vibrant Academy is a lightweight, high-performance web application designed to provide organized access to educational materials across multiple disciplines. Built as a Progressive Web App, it offers offline functionality and can be installed on any device, functioning like a native application without the overhead of traditional app stores.

The platform serves two primary audiences: secondary school students preparing for board examinations and competitive entrance tests, and undergraduate Computer Science students seeking technical resources for their coursework and career preparation.

## Features

- Modern, accessible interface with optimized dark theme
- Real-time search functionality across all materials
- Integrated PDF viewer with download capabilities
- Complete offline support through Service Worker caching
- Installable as Progressive Web App on all platforms
- Fully responsive design optimized for mobile and desktop
- Zero tracking, advertisements, or external dependencies
- WCAG 2.1 AA accessibility compliant
- Keyboard navigation support

## Content Library

### Class 11th Materials

**Physics**
- Core Topics: Unit and Dimension, Kinematics, Particle Dynamics, Rotational Dynamics
- Mechanics: Elasticity, Fluid Mechanics, Simple Harmonic Motion
- Waves and Thermodynamics: Waves in String, Sound Waves, KTG and Thermodynamics, Thermal Expansion and Heat Transfer

**Chemistry**
- Physical Chemistry: Atomic Structure, Stoichiometry, Gaseous State, Chemical Equilibrium, Ionic Equilibrium
- Inorganic Chemistry: Periodic Properties, Chemical Bonding
- Organic Chemistry: Common Names, Electronic Displacement Effects

**Mathematics**
- Algebra: Logarithm, Quadratic Equations, Sequence and Progression, Binomial Theorem, Permutation and Combination, Determinants
- Trigonometry: Compound Angles, Trigonometric Equations and Inequations, Solutions of Triangles
- Coordinate Geometry: Straight Line, Circle, Conic Sections (Parabola, Ellipse, Hyperbola)

### Class 12th Materials

**Physics**
- Electromagnetism: Electrostatics, Capacitance, Current Electricity, Magnetic Effects, Electromagnetic Induction, Alternating Current
- Optics: Geometrical Optics, Wave Optics, Diffraction, Polarization, Optical Instruments
- Modern Physics: Atomic Physics, Semiconductors
- Additional Topics: Gravitation, Surface Tension, Viscosity, Measurement Errors

**Chemistry**
- Physical Chemistry: Solid State, Liquid Solutions, Electrochemistry, Chemical Kinetics, Surface Chemistry, Thermochemistry, Thermodynamics, Stoichiometry
- Inorganic Chemistry: Chemical Bonding, Coordination Compounds, d and f-Block Elements, p-Block Elements, s-Block Elements, Hydrogen Compounds, Metallurgy, Salt Analysis, Environmental Chemistry
- Organic Chemistry: Electronic Displacement Effects, Isomerism, Hydrocarbons, Alkyl Halides, Alcohols and Ethers, Carbonyl Compounds, Carbene and Nitrene, Biomolecules, Polymers, Chemistry in Everyday Life

**Mathematics**
- Calculus: Functions, Inverse Trigonometric Functions, Limits, Continuity, Differentiability, Methods of Differentiation, Applications of Derivatives, Integration (Indefinite and Definite), Differential Equations, Area Under Curves
- Algebra and Vectors: Complex Numbers, Determinants, Matrices, Vectors and 3D Geometry, Probability, Statistics
- Coordinate Geometry: Conic Sections (Advanced)

### Computer Science and Engineering Resources

**College and Career Information**
- BTech CSE Program Guide
- Comprehensive College Lists
- CUET College Information
- Engineering Entrance Examinations Guide

**Core Computer Science**
- Data Structures and Algorithms (C++ Edition)
- Data Structures and Algorithms (Multi-Language Edition)
- Object-Oriented Programming (Multi-Language Edition)
- System Design Fundamentals
- Technical Interview Preparation

**DevOps and Cloud Computing**
- Cloud Computing Fundamentals
- DevOps and Cloud Integration

**Security and Research**
- Dorking Encyclopedia

## Installation and Usage

### Web Access

Visit the live application at: https://Mohammad-Faiz-Cloud-Engineer.github.io/Vibrant-Academy/

The application loads instantly and can be used immediately. Use the search bar to locate specific topics, and click any material to view it in the integrated PDF viewer. On mobile devices, PDFs open in a new tab for optimal viewing experience.

### Installing as PWA

**Desktop (Chrome, Edge, Brave)**
1. Visit the application URL
2. Click the install icon in the address bar
3. Confirm installation
4. Access from your applications menu

**Mobile (Android)**
1. Open the site in Chrome or Samsung Internet
2. Tap the menu and select "Add to Home Screen"
3. Confirm installation
4. Launch from your home screen

**Mobile (iOS)**
1. Open the site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm and launch from home screen

## Local Development

### Prerequisites
- Git
- A local web server (Python, Node.js, or any HTTP server)

### Setup

```bash
# Clone the repository
git clone https://github.com/god-hand1/Vibrant-Academy.git
cd Vibrant-Academy

# Serve using Python 3
python -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000

# Access at http://localhost:8000
```

### Development Guidelines

The application is built with vanilla JavaScript and requires no build process. All code is directly editable and testable in the browser. When adding new materials:

1. Place PDF files in the appropriate directory under `Vibrant Academy Modules/`
2. Update `data.js` with the new material information
3. Test the search functionality
4. Verify PDF loading in both desktop and mobile views
5. Update the service worker cache version if needed

## Technical Architecture

### Technology Stack

- HTML5 with semantic markup and ARIA attributes
- CSS3 with CSS Grid, Flexbox, and CSS Variables
- Vanilla JavaScript (ES6+) with no external dependencies
- Service Worker API for offline functionality and caching
- Web App Manifest for Progressive Web App capabilities
- Cache API for efficient resource management

### Project Structure

```
vibrant-academy/
├── index.html                    # Main application entry point
├── styles.css                    # Application styles and responsive design
├── app.js                        # Core application logic and UI management
├── config.js                     # Configuration constants and settings
├── data.js                       # Study materials data structure
├── manifest.json                 # PWA manifest configuration
├── service-worker.js             # Service worker for offline support
├── icon/                         # Application icons and assets
│   └── logo.png
└── Vibrant Academy Modules/      # Study materials organized by class
    ├── Class 11th/
    │   ├── Physics/
    │   ├── Chemistry/
    │   └── Mathematics/
    ├── Class 12th/
    │   ├── Physics/
    │   ├── Chemistry/
    │   └── Mathematics/
    └── ├── Others/
    │   ├── BTech CSE.pdf               # BTech CSE program guide
    │   ├── College List.pdf            # Comprehensive college information
    │   ├── College List(CUET).pdf      # CUET-specific college list
    │   ├── Engineering_Entrance_Exams_Guide.pdf
    │   └── CSE/                        # 8 Computer Science resources
    │       ├── Cloud Computing.pdf
    │       ├── DevOps Cloud.pdf
    │       ├── Dorking Encyclopedia.pdf
    │       ├── DSA & Algorithms C++ Edition.pdf
    │       ├── DSA & Algorithms Multi-Language Edition.pdf
    │       ├── Interview Preparation.pdf
    │       ├── OOP Multi-Language Edition.pdf
    │       └── System Design.pdf
    ├── Class 11th (Modules).zip        # Complete Class 11 materials archive
    └── Class 12th (Modules).zip        # Complete Class 12 materials archive

Total: 100 PDF study materials across all categories
```

### Key Components

**Application Core (app.js)**
- Material rendering and filtering
- Search functionality with debouncing
- PDF viewer modal management
- PWA installation handling
- Offline status detection
- Toast notification system

**Service Worker (service-worker.js)**
- Core asset caching on installation
- Runtime caching with size limits
- Network-first strategy with cache fallback
- Automatic cache cleanup and versioning

**Data Structure (data.js)**
- Hierarchical organization of materials
- Categorization by subject and topic
- File path management
- Easy extensibility for new content

## Browser Compatibility

The application supports all modern browsers with the following minimum versions:

- Chrome/Edge 90 and above
- Firefox 88 and above
- Safari 14 and above
- iOS Safari 14 and above
- Chrome Mobile (Android)
- Samsung Internet

Legacy browser support is not provided to maintain modern web standards and optimal performance.

## Performance Characteristics

- First Contentful Paint: Under 1.5 seconds
- Time to Interactive: Under 3.5 seconds
- Lighthouse Performance Score: 95+
- Total JavaScript Bundle: Approximately 18KB
- Total CSS Bundle: Approximately 18KB
- Service Worker Cache: Intelligent size management

The application is optimized for mobile networks and performs efficiently even on slower connections.

## Security and Privacy

### Security Measures

- Input sanitization to prevent XSS attacks
- Output encoding for all dynamic content
- Content Security Policy implementation
- Iframe sandboxing for PDF viewer
- No external script dependencies
- HTTPS-only operation

### Privacy Commitment

- Zero data collection or analytics
- No cookies or local storage of personal information
- No third-party integrations
- No advertisement networks
- No user tracking of any kind

All application data remains on the user's device. The only network requests made are for loading the application itself and the study materials.

## Accessibility

The application is designed to be accessible to all users and complies with WCAG 2.1 Level AA standards:

- Semantic HTML structure
- ARIA labels and roles throughout
- Keyboard navigation support (Tab, Enter, Escape, Ctrl+K)
- Screen reader compatibility
- Sufficient color contrast ratios
- Focus indicators on all interactive elements
- Reduced motion support for users with vestibular disorders
- Responsive text sizing

## Contributing

Contributions to improve the application or add new study materials are welcome. Please follow these guidelines:

### Reporting Issues

When reporting bugs or requesting features, please include:
- Browser and version
- Operating system
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

### Submitting Changes

1. Fork the repository
2. Create a feature branch from main
3. Make your changes with clear, descriptive commits
4. Test thoroughly across different browsers
5. Update documentation if needed
6. Submit a pull request with a detailed description

### Adding Study Materials

To add new study materials:
1. Ensure PDFs are properly formatted and readable
2. Place files in the appropriate directory structure
3. Update `data.js` with accurate metadata
4. Test the search functionality
5. Verify mobile and desktop viewing

## License

This project is licensed under the GNU General Public License v3.0. See the LICENSE file for complete details.

The GPL v3.0 ensures that this software remains free and open source, and that any derivative works are also distributed under the same license terms.

## Acknowledgments

Study materials are provided by Vibrant Academy for educational purposes. All content remains the intellectual property of its respective creators and is used with permission for educational distribution.

## Author

**Mohammad Faiz**

For questions, suggestions, or collaboration opportunities, please open an issue on the GitHub repository.

---

This application is developed and maintained with the goal of making quality educational resources accessible to all students, regardless of their economic circumstances or geographic location.