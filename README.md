<div align="center">

<img src="assets/logo-original.png" width="180" alt="HEX Luthor Logo">

# ⚡ HEX Luthor

**Seamless, borderless backgrounds for GitHub READMEs & GitHub Pages**

[![npm](https://img.shields.io/npm/v/hex-luthor?color=%23cb3837&style=flat-square)](https://www.npmjs.com/package/hex-luthor)
[![license](https://img.shields.io/badge/license-MIT-%230d1117?style=flat-square)](LICENSE)
[![downloads](https://img.shields.io/npm/dm/hex-luthor?color=%230d1117&style=flat-square)](https://www.npmjs.com/package/hex-luthor)

</div>

---

## What is HEX Luthor?

HEX Luthor is a zero-dependency tool that generates **seamless, borderless SVG backgrounds** for your GitHub repositories. Unlike regular images that show borders or padding artifacts, HEX Luthor creates edge-to-edge backgrounds that blend perfectly into GitHub's dark/light themes.

### ✨ Features

- **🚫 Zero Borders** — True edge-to-edge backgrounds with no visible seams
- **🎨 9 Built-in Patterns** — Dots, grid, diagonal, hexagon, noise, waves, mesh, gradient, aurora
- **🌗 Dark/Light Aware** — Auto-adapts to GitHub's color schemes
- **📱 README & Pages** — Works in both GitHub READMEs and GitHub Pages sites
- **⚡ Zero Dependencies** — Pure SVG/CSS, no external assets needed
- **🖼️ Data URI Output** — Everything embedded, no broken image links

---

## Installation

```bash
# Global install
npm install -g hex-luthor

# Or use npx (no install)
npx hex-luthor <command>
```

---

### CDN (Simple Embed)

```html
<script src="https://cdn.jsdelivr.net/npm/hex-luthor@latest/dist/embed.min.js" 
  data-pattern="gradient" 
  data-colors="#0d1117,#161b22"
  data-target="body"
  data-text="My Project"
  data-animation="true">
</script>
```

## Quick Start

### 1. README Background

Generate a borderless background snippet for your README:

```bash
hex-luthor readme -p gradient -c "#0d1117,#161b22" -o background.md
```

Then paste the contents of `background.md` at the top of your `README.md`.

### 2. Banner with Text

Create a stunning project banner:

```bash
hex-luthor banner -t "My Awesome Project" -s "Built with HEX Luthor" -p aurora -o banner.md
```

### 3. GitHub Pages CSS

Generate CSS for your GitHub Pages site:

```bash
hex-luthor pages -p dots -c "#ff6b6b,#4ecdc4" -a -o assets/css/hex-luthor.css
```

Then include it in your Jekyll layout:

```html
<link rel="stylesheet" href="/assets/css/hex-luthor.css">
```

---

## Available Patterns

| Pattern | Description | Best For |
|---------|-------------|----------|
| `dots` | Subtle dot matrix | Clean, minimal repos |
| `grid` | Fine grid lines | Technical docs |
| `diagonal` | Diagonal stripes | Dynamic projects |
| `hexagon` | Honeycomb pattern | Dev tools, APIs |
| `noise` | Fractal noise texture | Creative portfolios |
| `waves` | Flowing wave lines | Data viz, analytics |
| `mesh` | Connected node mesh | Network, graph projects |
| `gradient` | Smooth color blend | General purpose |
| `aurora` | Northern lights effect | Showcases, demos |

---

## API Usage

```javascript
const HexLuthor = require('hex-luthor');

// Generate a README background
const readmeBg = HexLuthor.readme({
  pattern: 'gradient',
  colors: ['#0d1117', '#161b22'],
  height: 200
});

// Generate a banner
const banner = HexLuthor.banner({
  text: 'My Project',
  subtext: 'A cool description',
  pattern: 'aurora',
  colors: ['#0d1117', '#21262d']
});

// Generate Pages CSS
const css = HexLuthor.pages({
  pattern: 'dots',
  colors: ['#0d1117', '#21262d'],
  animation: true
});

// Get all pattern previews
const previews = HexLuthor.preview(['#0d1117', '#21262d']);
```

---

## Configuration File

Create `hex-luthor.config.js` in your project root:

```bash
hex-luthor init
```

Example config:

```javascript
module.exports = {
  readme: {
    pattern: 'gradient',
    colors: ['#0d1117', '#161b22'],
    height: 200
  },
  banner: {
    text: 'Your Project',
    subtext: 'Description here',
    pattern: 'aurora',
    colors: ['#0d1117', '#21262d']
  },
  pages: {
    pattern: 'dots',
    colors: ['#0d1117', '#21262d'],
    animation: true
  }
};
```

---

## How It Works

HEX Luthor uses **SVG data URIs** with `patternUnits="userSpaceOnUse"` to create truly seamless tiles. Unlike PNG/JPG images that show visible edges when scaled, SVG patterns mathematically tile without borders.

The tool also injects CSS that strips GitHub's default margins and borders:

```css
body {
  background: var(--hl-bg) !important;
  margin: 0 !important;
  border: none !important;
}
```

---

## Examples

### Dark Theme Banner
```bash
hex-luthor banner -t "API Gateway" -s "High-performance routing" -p mesh -c "#0d1117,#21262d"
```

### Light Theme Banner
```bash
hex-luthor banner -t "Docs" -s "Beautiful documentation" -p waves -c "#ffffff,#f6f8fa"
```

### Animated Pages Background
```bash
hex-luthor pages -p gradient -c "#667eea,#764ba2" -a -o style.css
```

### Vibrant Pattern
```bash
hex-luthor readme -p hexagon -c "#ff6b6b,#feca57" -o vibrant.md
```

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © HEX Luthor Contributors
