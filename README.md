# Vibrant Academy

A web app for accessing study materials for Class 11th and 12th students preparing for competitive exams.

Built by Mohammad Faiz.

## What's This?

This is a simple, fast web app that lets you browse and view study materials for Physics, Chemistry, and Mathematics. No ads, no tracking, just your study materials organized in one place.

Works offline once you've loaded it. You can also install it on your phone or computer like a regular app.

## What's Inside

**Class 11th:**
- Physics (Kinematics, Dynamics, Thermodynamics, Waves, etc.)
- Chemistry (Physical, Inorganic, Organic)
- Mathematics (Algebra, Trigonometry, Coordinate Geometry)

**Class 12th:**
- Physics (Electromagnetism, Optics, Modern Physics)
- Chemistry (Physical, Inorganic, Organic)
- Mathematics (Calculus, Vectors, 3D Geometry, Probability)

## How to Use

Just visit: https://god-hand1.github.io/Vibrant-Academy/

Search for what you need, click to view PDFs. That's it.

On mobile, you'll get a prompt to install it. On desktop, look for the install icon in your browser's address bar.

## Running Locally

If you want to run this on your own machine:

```bash
git clone https://github.com/god-hand1/Vibrant-Academy.git
cd Vibrant-Academy

# Then open index.html in your browser
# Or use a simple server:
python -m http.server 8000
```

## Tech Stack

Plain HTML, CSS, and JavaScript. No frameworks, no build process, no npm packages.

Uses Service Workers for offline support and a Web App Manifest to make it installable.

## File Structure

```
├── index.html           # Main page
├── styles.css           # All the styling
├── app.js              # App logic
├── config.js           # Settings
├── data.js             # Study materials list
├── manifest.json       # PWA config
├── service-worker.js   # Offline support
└── Vibrant Academy Modules/  # PDF files
```

## Browser Support

Works on any modern browser from the last couple years. Chrome, Firefox, Safari, Edge - all good.

## License

GNU GPL v3 - see LICENSE file.

## Contributing

Found a bug? Have a suggestion? Open an issue or send a pull request.

---

Made with ☕ by Mohammad Faiz
