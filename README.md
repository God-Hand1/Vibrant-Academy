# Vibrant Academy Study Materials

A progressive web application for accessing Class 11th and 12th study materials for Physics, Chemistry, and Mathematics.

## Overview

This is a lightweight, fast web application that provides organized access to educational materials for students preparing for competitive exams. The application works offline once loaded and can be installed on any device like a native app.

## Features

- Clean, modern interface with dark theme
- Real-time search across all materials
- In-app PDF viewer
- Offline support via Service Worker
- Installable as Progressive Web App (PWA)
- Mobile-optimized responsive design
- Zero tracking or advertisements

## Content

### Class 11th
- Physics: Kinematics, Dynamics, Thermodynamics, Waves, Mechanics
- Chemistry: Physical, Inorganic, and Organic Chemistry
- Mathematics: Algebra, Trigonometry, Coordinate Geometry

### Class 12th
- Physics: Electromagnetism, Optics, Modern Physics
- Chemistry: Physical, Inorganic, and Organic Chemistry
- Mathematics: Calculus, Vectors, 3D Geometry, Probability, Statistics

### Additional Resources
- College information and entrance exam guides

## Usage

Visit: https://god-hand1.github.io/Vibrant-Academy/

Use the search bar to find specific topics, click any PDF to view it instantly. On mobile devices, you'll receive a prompt to install the app for offline access.

## Local Development

```bash
git clone https://github.com/god-hand1/Vibrant-Academy.git
cd Vibrant-Academy

# Serve locally (requires Python 3)
python -m http.server 8000

# Or use any static file server
# Then open http://localhost:8000
```

## Technical Stack

- Pure HTML5, CSS3, and JavaScript (ES6+)
- No frameworks or build tools required
- Service Worker API for offline functionality
- Web App Manifest for PWA capabilities
- Responsive CSS Grid and Flexbox layouts

## Project Structure

```
├── index.html              # Main application page
├── styles.css              # Application styles
├── app.js                  # Core application logic
├── config.js               # Configuration constants
├── data.js                 # Study materials data structure
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── icon/                   # Application icons
└── Vibrant Academy Modules/ # PDF study materials
```

## Browser Compatibility

Supports all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security

- All user input is sanitized to prevent XSS attacks
- No external dependencies or third-party scripts
- Content Security Policy compliant
- No data collection or tracking

## Performance

- First load: < 1.5s
- Time to interactive: < 3s
- Lighthouse score: 95+
- Optimized for mobile networks

## License

GNU General Public License v3.0 - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Author

Mohammad Faiz

---

Built with care for students preparing for competitive examinations.
