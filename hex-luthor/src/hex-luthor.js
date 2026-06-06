/**
 * HEX Luthor - Seamless Background Engine for GitHub
 * Version: 1.0.0
 * License: MIT
 * 
 * A zero-border, zero-dependency background injection system
 * for GitHub READMEs and GitHub Pages.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.HexLuthor = factory());
})(this, function () {
  'use strict';

  const VERSION = '1.0.0';

  // ─── Color Engine ───
  const ColorEngine = {
    // Parse any color format to RGBA
    parse(color) {
      if (!color) return { r: 0, g: 0, b: 0, a: 1 };

      // Hex 3/4/6/8 digit
      if (color.startsWith('#')) {
        let hex = color.slice(1);
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        if (hex.length === 4) hex = hex.split('').map(c => c + c).join('');
        const num = parseInt(hex, 16);
        return hex.length === 8
          ? { r: (num >> 24) & 255, g: (num >> 16) & 255, b: (num >> 8) & 255, a: (num & 255) / 255 }
          : { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1 };
      }

      // RGB/RGBA
      const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
      if (rgbMatch) {
        const parts = rgbMatch[1].split(',').map(p => parseFloat(p.trim()));
        return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
      }

      // HSL/HSLA
      const hslMatch = color.match(/hsla?\(([^)]+)\)/);
      if (hslMatch) {
        const [h, s, l, a = 1] = hslMatch[1].split(',').map(p => parseFloat(p.trim().replace('%', '')));
        return this.hslToRgb(h, s / 100, l / 100, a);
      }

      // Named colors fallback
      const canvas = document.createElement('canvas');
      canvas.width = 1; canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: a / 255 };
    },

    hslToRgb(h, s, l, a = 1) {
      let r, g, b;
      if (s === 0) { r = g = b = l; }
      else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1/3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1/3);
      }
      return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a };
    },

    toHex({ r, g, b, a }) {
      const toHexChannel = (v) => v.toString(16).padStart(2, '0');
      return a < 1 
        ? `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}${toHexChannel(Math.round(a * 255))}`
        : `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;
    },

    blend(c1, c2, ratio = 0.5) {
      return {
        r: Math.round(c1.r * (1 - ratio) + c2.r * ratio),
        g: Math.round(c1.g * (1 - ratio) + c2.g * ratio),
        b: Math.round(c1.b * (1 - ratio) + c2.b * ratio),
        a: c1.a * (1 - ratio) + c2.a * ratio
      };
    }
  };

  // ─── Pattern Engine ───
  const PatternEngine = {
    // Generate SVG data URI patterns (borderless, seamless)
    generate(type, colors, options = {}) {
      const { size = 64, opacity = 1, rotation = 0 } = options;
      const c1 = ColorEngine.toHex(ColorEngine.parse(colors[0] || '#0d1117'));
      const c2 = ColorEngine.toHex(ColorEngine.parse(colors[1] || '#161b22'));

      const patterns = {
        dots: () => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <rect width="100%" height="100%" fill="${c1}"/>
          <circle cx="${size/2}" cy="${size/2}" r="${size/8}" fill="${c2}" opacity="${opacity}"/>
          <circle cx="0" cy="0" r="${size/8}" fill="${c2}" opacity="${opacity}"/>
          <circle cx="${size}" cy="0" r="${size/8}" fill="${c2}" opacity="${opacity}"/>
          <circle cx="0" cy="${size}" r="${size/8}" fill="${c2}" opacity="${opacity}"/>
          <circle cx="${size}" cy="${size}" r="${size/8}" fill="${c2}" opacity="${opacity}"/>
        </svg>`,

        grid: () => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <rect width="100%" height="100%" fill="${c1}"/>
          <path d="M ${size/2} 0 L ${size/2} ${size} M 0 ${size/2} L ${size} ${size/2}" 
                stroke="${c2}" stroke-width="${size/64}" opacity="${opacity * 0.3}" fill="none"/>
        </svg>`,

        diagonal: () => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <rect width="100%" height="100%" fill="${c1}"/>
          <path d="M 0 ${size} L ${size} 0 M -${size/2} ${size/2} L ${size/2} -${size/2} M ${size/2} ${size*1.5} L ${size*1.5} ${size/2}" 
                stroke="${c2}" stroke-width="${size/32}" opacity="${opacity * 0.15}" fill="none"/>
        </svg>`,

        hexagon: () => `<svg xmlns="http://www.w3.org/2000/svg" width="${size*1.732}" height="${size*2}" viewBox="0 0 ${size*1.732} ${size*2}">
          <rect width="100%" height="100%" fill="${c1}"/>
          <path d="M${size*0.866} 0 L${size*1.732} ${size*0.5} L${size*1.732} ${size*1.5} L${size*0.866} ${size*2} L0 ${size*1.5} L0 ${size*0.5} Z" 
                stroke="${c2}" stroke-width="${size/64}" opacity="${opacity * 0.2}" fill="none" transform="translate(${size*0.866/2}, ${size/2}) scale(0.5)"/>
        </svg>`,

        noise: () => `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
          <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" fill="${c1}"/>
          <rect width="100%" height="100%" filter="url(#n)" opacity="${opacity * 0.08}" fill="${c2}"/>
        </svg>`,

        waves: () => `<svg xmlns="http://www.w3.org/2000/svg" width="${size*2}" height="${size}" viewBox="0 0 ${size*2} ${size}">
          <rect width="100%" height="100%" fill="${c1}"/>
          <path d="M0 ${size*0.5} Q${size*0.5} 0 ${size} ${size*0.5} T${size*2} ${size*0.5}" 
                stroke="${c2}" stroke-width="${size/32}" fill="none" opacity="${opacity * 0.3}"/>
          <path d="M0 ${size*0.75} Q${size*0.5} ${size*0.25} ${size} ${size*0.75} T${size*2} ${size*0.75}" 
                stroke="${c2}" stroke-width="${size/48}" fill="none" opacity="${opacity * 0.15}"/>
        </svg>`,

        mesh: () => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <defs><pattern id="m" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
            <rect width="${size}" height="${size}" fill="${c1}"/>
            <circle cx="${size*0.25}" cy="${size*0.25}" r="1" fill="${c2}" opacity="${opacity}"/>
            <circle cx="${size*0.75}" cy="${size*0.25}" r="1" fill="${c2}" opacity="${opacity}"/>
            <circle cx="${size*0.25}" cy="${size*0.75}" r="1" fill="${c2}" opacity="${opacity}"/>
            <circle cx="${size*0.75}" cy="${size*0.75}" r="1" fill="${c2}" opacity="${opacity}"/>
            <circle cx="0" cy="0" r="1" fill="${c2}" opacity="${opacity}"/>
            <circle cx="${size}" cy="0" r="1" fill="${c2}" opacity="${opacity}"/>
            <circle cx="0" cy="${size}" r="1" fill="${c2}" opacity="${opacity}"/>
            <circle cx="${size}" cy="${size}" r="1" fill="${c2}" opacity="${opacity}"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#m)"/>
        </svg>`,

        gradient: () => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="100%" stop-color="${c2}"/>
          </linearGradient></defs>
          <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>`,

        aurora: () => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs><linearGradient id="a1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${c1}" stop-opacity="0"/><stop offset="50%" stop-color="${c2}" stop-opacity="0.5"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></linearGradient>
          <linearGradient id="a2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${c2}" stop-opacity="0.3"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></linearGradient></defs>
          <rect width="100%" height="100%" fill="${c1}"/>
          <rect width="100%" height="100%" fill="url(#a1)"/>
          <rect width="100%" height="100%" fill="url(#a2)"/>
        </svg>`
      };

      const svg = (patterns[type] || patterns.dots)();
      const encoded = typeof window !== 'undefined' 
        ? 'data:image/svg+xml,' + encodeURIComponent(svg.replace(/>\s+</g, '><').trim())
        : Buffer.from(svg).toString('base64');

      return typeof window !== 'undefined' ? encoded : `data:image/svg+xml;base64,${encoded}`;
    }
  };

  // ─── GitHub README Injection Engine ───
  const ReadmeEngine = {
    // Generate a borderless background markdown snippet
    generate(config) {
      const { 
        pattern = 'dots', 
        colors = ['#0d1117', '#21262d'],
        width = '100%',
        height = '200',
        content = '',
        align = 'center'
      } = config;

      // Generate the SVG background
      const bgSvg = PatternEngine.generate(pattern, colors, { size: 64, opacity: 0.8 });

      // Create a seamless wrapper using GitHub's supported HTML subset
      // Using a 1x1 transparent pixel as spacer to avoid border artifacts
      const spacer = 'https://raw.githubusercontent.com/hex-luthor/hex-luthor/main/assets/spacer.gif';

      return `<div align="${align}">
<img src="${bgSvg}" width="${width}" height="${height}" style="display:block; border:none; margin:0; padding:0; max-width:100%;" alt="background">
${content ? `<div style="position:relative; margin-top:-${height}px;">\n${content}\n</div>` : ''}
</div>`;
    },

    // Generate a full-width banner (no borders)
    banner(config) {
      const { text, subtext, pattern, colors, textColor = '#ffffff', height = 300 } = config;

      // Build an SVG with text overlay for true borderless rendering
      const bg = PatternEngine.generate(pattern, colors, { size: 64 });
      const c1 = ColorEngine.toHex(ColorEngine.parse(colors[0] || '#0d1117'));

      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${height}" viewBox="0 0 1200 ${height}" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="bg" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <rect width="64" height="64" fill="${c1}"/>
            <circle cx="32" cy="32" r="8" fill="${ColorEngine.toHex(ColorEngine.parse(colors[1] || '#21262d'))}" opacity="0.5"/>
          </pattern>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${c1}" stop-opacity="0"/>
            <stop offset="100%" stop-color="${c1}" stop-opacity="0.8"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <rect width="100%" height="100%" fill="url(#fade)"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" 
              font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" 
              font-size="72" font-weight="700" fill="${textColor}">${text}</text>
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" 
              font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" 
              font-size="28" font-weight="400" fill="${textColor}" opacity="0.8">${subtext}</text>
      </svg>`;

      const encoded = 'data:image/svg+xml,' + encodeURIComponent(svgContent.replace(/>\s+</g, '><'));
      return `<img src="${encoded}" width="100%" alt="${text}" style="display:block; border:none; margin:0; padding:0;">`;
    }
  };

  // ─── GitHub Pages Engine ───
  const PagesEngine = {
    generate(config) {
      const {
        pattern = 'gradient',
        colors = ['#0d1117', '#161b22'],
        animation = false,
        customCSS = ''
      } = config;

      const bgUrl = PatternEngine.generate(pattern, colors, { size: 64 });

      return `/* HEX Luthor - Auto-generated borderless background */
:root {
  --hl-bg-primary: ${colors[0]};
  --hl-bg-secondary: ${colors[1]};
  --hl-bg-url: url("${bgUrl}");
}

body {
  background: var(--hl-bg-primary) var(--hl-bg-url) !important;
  background-size: cover !important;
  background-attachment: fixed !important;
  background-position: center !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

/* Remove all default borders and margins */
body::before, body::after,
.markdown-body::before, .markdown-body::after,
.container::before, .container::after,
.wrapper::before, .wrapper::after {
  display: none !important;
  content: none !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Seamless content wrapper */
.markdown-body, .container, .wrapper, main, article {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  margin: 0 auto !important;
  padding: 2rem !important;
  max-width: 1012px;
}

${animation ? `
/* Subtle animated background */
@keyframes hl-shift {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}
body {
  animation: hl-shift 30s ease infinite;
  background-size: 200% 200% !important;
}` : ''}

${customCSS}`;
    }
  };

  // ─── CLI / Node API ───
  const API = {
    version: VERSION,

    readme(config) {
      return ReadmeEngine.generate(config);
    },

    banner(config) {
      return ReadmeEngine.banner(config);
    },

    pages(config) {
      return PagesEngine.generate(config);
    },

    // Generate all patterns preview
    preview(colors) {
      const types = ['dots', 'grid', 'diagonal', 'hexagon', 'noise', 'waves', 'mesh', 'gradient', 'aurora'];
      return types.map(type => ({
        type,
        dataUri: PatternEngine.generate(type, colors, { size: 64 })
      }));
    },

    // Color utilities
    color: ColorEngine
  };

  return API;
});
