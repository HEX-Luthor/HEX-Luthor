/**
 * HEX Luthor - Simple Embed
 * Drop-in script for non-technical users
 * 
 * Usage: <script src="https://cdn.jsdelivr.net/npm/hex-luthor@latest/dist/embed.min.js" 
 *         data-pattern="gradient" 
 *         data-colors="#0d1117,#161b22"
 *         data-target="body"></script>
 */

(function() {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  // Parse data attributes
  const config = {
    pattern: script.dataset.pattern || 'gradient',
    colors: (script.dataset.colors || '#0d1117,#161b22').split(','),
    target: script.dataset.target || 'body',
    height: script.dataset.height || '300',
    text: script.dataset.text || '',
    subtext: script.dataset.subtext || '',
    animation: script.dataset.animation === 'true',
    opacity: parseFloat(script.dataset.opacity || '0.8'),
    size: parseInt(script.dataset.size || '64')
  };

  // Simple color parser
  function parseColor(color) {
    if (!color) return { r: 0, g: 0, b: 0, a: 1 };
    if (color.startsWith('#')) {
      let hex = color.slice(1);
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const num = parseInt(hex, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1 };
    }
    const rgb = color.match(/\d+/g);
    if (rgb) return { r: +rgb[0], g: +rgb[1], b: +rgb[2], a: 1 };
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  function toHex(c) {
    return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  // Pattern generators
  const patterns = {
    dots: (c1, c2, s, o) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
      <rect width="100%" height="100%" fill="${c1}"/>
      <circle cx="${s/2}" cy="${s/2}" r="${s/8}" fill="${c2}" opacity="${o}"/>
      <circle cx="0" cy="0" r="${s/8}" fill="${c2}" opacity="${o}"/>
      <circle cx="${s}" cy="0" r="${s/8}" fill="${c2}" opacity="${o}"/>
      <circle cx="0" cy="${s}" r="${s/8}" fill="${c2}" opacity="${o}"/>
      <circle cx="${s}" cy="${s}" r="${s/8}" fill="${c2}" opacity="${o}"/>
    </svg>`,

    grid: (c1, c2, s, o) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
      <rect width="100%" height="100%" fill="${c1}"/>
      <path d="M ${s/2} 0 L ${s/2} ${s} M 0 ${s/2} L ${s} ${s/2}" stroke="${c2}" stroke-width="${s/64}" opacity="${o * 0.3}" fill="none"/>
    </svg>`,

    diagonal: (c1, c2, s, o) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
      <rect width="100%" height="100%" fill="${c1}"/>
      <path d="M 0 ${s} L ${s} 0 M -${s/2} ${s/2} L ${s/2} -${s/2} M ${s/2} ${s*1.5} L ${s*1.5} ${s/2}" stroke="${c2}" stroke-width="${s/32}" opacity="${o * 0.15}" fill="none"/>
    </svg>`,

    hexagon: (c1, c2, s, o) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s*1.732}" height="${s*2}" viewBox="0 0 ${s*1.732} ${s*2}">
      <rect width="100%" height="100%" fill="${c1}"/>
      <path d="M${s*0.866} 0 L${s*1.732} ${s*0.5} L${s*1.732} ${s*1.5} L${s*0.866} ${s*2} L0 ${s*1.5} L0 ${s*0.5} Z" stroke="${c2}" stroke-width="${s/64}" opacity="${o * 0.2}" fill="none" transform="translate(${s*0.866/2}, ${s/2}) scale(0.5)"/>
    </svg>`,

    noise: (c1, c2, s, o) => `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter>
      <rect width="100%" height="100%" fill="${c1}"/>
      <rect width="100%" height="100%" filter="url(#n)" opacity="${o * 0.08}" fill="${c2}"/>
    </svg>`,

    waves: (c1, c2, s, o) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s*2}" height="${s}" viewBox="0 0 ${s*2} ${s}">
      <rect width="100%" height="100%" fill="${c1}"/>
      <path d="M0 ${s*0.5} Q${s*0.5} 0 ${s} ${s*0.5} T${s*2} ${s*0.5}" stroke="${c2}" stroke-width="${s/32}" fill="none" opacity="${o * 0.3}"/>
      <path d="M0 ${s*0.75} Q${s*0.5} ${s*0.25} ${s} ${s*0.75} T${s*2} ${s*0.75}" stroke="${c2}" stroke-width="${s/48}" fill="none" opacity="${o * 0.15}"/>
    </svg>`,

    mesh: (c1, c2, s, o) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
      <defs><pattern id="m" width="${s}" height="${s}" patternUnits="userSpaceOnUse">
        <rect width="${s}" height="${s}" fill="${c1}"/>
        <circle cx="${s*0.25}" cy="${s*0.25}" r="1" fill="${c2}" opacity="${o}"/>
        <circle cx="${s*0.75}" cy="${s*0.25}" r="1" fill="${c2}" opacity="${o}"/>
        <circle cx="${s*0.25}" cy="${s*0.75}" r="1" fill="${c2}" opacity="${o}"/>
        <circle cx="${s*0.75}" cy="${s*0.75}" r="1" fill="${c2}" opacity="${o}"/>
        <circle cx="0" cy="0" r="1" fill="${c2}" opacity="${o}"/>
        <circle cx="${s}" cy="0" r="1" fill="${c2}" opacity="${o}"/>
        <circle cx="0" cy="${s}" r="1" fill="${c2}" opacity="${o}"/>
        <circle cx="${s}" cy="${s}" r="1" fill="${c2}" opacity="${o}"/>
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#m)"/>
    </svg>`,

    gradient: (c1, c2, s, o) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`,

    aurora: (c1, c2, s, o) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><linearGradient id="a1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${c1}" stop-opacity="0"/><stop offset="50%" stop-color="${c2}" stop-opacity="0.5"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></linearGradient>
      <linearGradient id="a2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${c2}" stop-opacity="0.3"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></linearGradient></defs>
      <rect width="100%" height="100%" fill="${c1}"/>
      <rect width="100%" height="100%" fill="url(#a1)"/>
      <rect width="100%" height="100%" fill="url(#a2)"/>
    </svg>`
  };

  function generateSvg(type, colors, opts) {
    const c1 = toHex(parseColor(colors[0] || '#0d1117'));
    const c2 = toHex(parseColor(colors[1] || '#21262d'));
    const svg = (patterns[type] || patterns.gradient)(c1, c2, opts.size, opts.opacity);
    return 'data:image/svg+xml,' + encodeURIComponent(svg.replace(/>\s+</g, '><').trim());
  }

  // Apply background
  const target = document.querySelector(config.target);
  if (!target) return;

  const bgUrl = generateSvg(config.pattern, config.colors, config);

  target.style.cssText += `
    background-image: url('${bgUrl}') !important;
    background-size: ${config.pattern === 'gradient' || config.pattern === 'aurora' ? 'cover' : 'auto'} !important;
    background-attachment: fixed !important;
    background-position: center !important;
    background-repeat: ${config.pattern === 'gradient' || config.pattern === 'aurora' ? 'no-repeat' : 'repeat'} !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  `;

  // Add text overlay if provided
  if (config.text) {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <div style="text-align:center; padding: 4rem 2rem; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="font-size: 3rem; font-weight: 700; color: #fff; margin: 0; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">${config.text}</h1>
        ${config.subtext ? `<p style="font-size: 1.2rem; color: rgba(255,255,255,0.8); margin-top: 0.5rem;">${config.subtext}</p>` : ''}
      </div>
    `;
    target.insertBefore(overlay.firstElementChild, target.firstChild);
  }

  // Animation
  if (config.animation) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes hl-embed-shift {
        0% { background-position: 0% 0%; }
        50% { background-position: 100% 100%; }
        100% { background-position: 0% 0%; }
      }
      ${config.target} {
        animation: hl-embed-shift 30s ease infinite !important;
        background-size: 200% 200% !important;
      }
    `;
    document.head.appendChild(style);
  }

  console.log('[HEX Luthor] Embedded background applied:', config.pattern);
})();
