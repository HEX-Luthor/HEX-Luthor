#!/usr/bin/env node
/**
 * HEX Luthor CLI
 * Usage: npx hex-luthor <command> [options]
 */

const fs = require('fs');
const path = require('path');
const HexLuthor = require('./src/hex-luthor');

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  ⚡ HEX LUTHER v${HexLuthor.version} - Seamless Backgrounds for GitHub  ║
╠══════════════════════════════════════════════════════════╣

  USAGE:
    hex-luthor <command> [options]

  COMMANDS:
    readme    Generate borderless README background snippet
    banner    Generate a full-width banner with text overlay
    pages     Generate CSS for GitHub Pages (Jekyll/Actions)
    preview   Generate all pattern previews as HTML
    init      Create a hex-luthor.config.js in your project

  OPTIONS:
    --pattern, -p     Pattern type (dots, grid, diagonal, hexagon, 
                      noise, waves, mesh, gradient, aurora)
    --colors, -c      Comma-separated colors (e.g., "#0d1117,#21262d")
    --text, -t        Banner text
    --subtext, -s     Banner subtitle
    --height, -h      Banner height in pixels
    --output, -o      Output file path
    --animation, -a   Enable animated background (pages only)

  EXAMPLES:
    hex-luthor readme -p gradient -c "#0d1117,#161b22" -o bg.md
    hex-luthor banner -t "My Project" -s "A cool description" -p aurora
    hex-luthor pages -p dots -c "#ff6b6b,#4ecdc4" -a -o style.css
    hex-luthor preview -c "#0d1117,#21262d" -o preview.html

╚══════════════════════════════════════════════════════════╝
`);
}

function parseArgs() {
  const opts = {};
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg.startsWith('--')) {
      opts[arg.replace('--', '')] = next && !next.startsWith('-') ? next : true;
      if (next && !next.startsWith('-')) i++;
    } else if (arg.startsWith('-')) {
      const key = { p: 'pattern', c: 'colors', t: 'text', s: 'subtext', h: 'height', o: 'output', a: 'animation' }[arg.replace('-', '')];
      if (key) {
        opts[key] = next && !next.startsWith('-') ? next : true;
        if (next && !next.startsWith('-')) i++;
      }
    }
  }
  return opts;
}

const opts = parseArgs();

switch (command) {
  case 'readme': {
    const colors = (opts.colors || '#0d1117,#21262d').split(',');
    const result = HexLuthor.readme({
      pattern: opts.pattern || 'dots',
      colors,
      height: opts.height || '200'
    });
    if (opts.output) {
      fs.writeFileSync(opts.output, result);
      console.log(`✅ README snippet saved to ${opts.output}`);
    } else {
      console.log(result);
    }
    break;
  }

  case 'banner': {
    const colors = (opts.colors || '#0d1117,#21262d').split(',');
    const result = HexLuthor.banner({
      text: opts.text || 'HEX Luthor',
      subtext: opts.subtext || 'Seamless Backgrounds',
      pattern: opts.pattern || 'gradient',
      colors,
      height: parseInt(opts.height) || 300
    });
    if (opts.output) {
      fs.writeFileSync(opts.output, result);
      console.log(`✅ Banner saved to ${opts.output}`);
    } else {
      console.log(result);
    }
    break;
  }

  case 'pages': {
    const colors = (opts.colors || '#0d1117,#21262d').split(',');
    const result = HexLuthor.pages({
      pattern: opts.pattern || 'gradient',
      colors,
      animation: opts.animation === true || opts.animation === 'true'
    });
    if (opts.output) {
      fs.writeFileSync(opts.output, result);
      console.log(`✅ Pages CSS saved to ${opts.output}`);
    } else {
      console.log(result);
    }
    break;
  }

  case 'preview': {
    const colors = (opts.colors || '#0d1117,#21262d').split(',');
    const previews = HexLuthor.preview(colors);
    const html = `<!DOCTYPE html>
<html><head><title>HEX Luthor Patterns</title>
<style>
body { background: ${colors[0]}; color: #fff; font-family: system-ui; margin: 0; padding: 2rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
.card { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1rem; }
.card img { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; display: block; border: none; }
.label { margin-top: 0.5rem; font-family: monospace; font-size: 0.9rem; opacity: 0.8; }
</style></head><body>
<h1>⚡ HEX Luthor Pattern Preview</h1>
<div class="grid">
${previews.map(p => `<div class="card"><img src="${p.dataUri}" alt="${p.type}"><div class="label">${p.type}</div></div>`).join('\n')}
</div></body></html>`;
    if (opts.output) {
      fs.writeFileSync(opts.output, html);
      console.log(`✅ Preview saved to ${opts.output}`);
    } else {
      console.log(html);
    }
    break;
  }

  case 'init': {
    const config = `module.exports = {
  // HEX Luthor Configuration
  readme: {
    pattern: 'gradient',
    colors: ['#0d1117', '#161b22'],
    height: 200
  },
  banner: {
    text: 'Your Project Name',
    subtext: 'A short description',
    pattern: 'aurora',
    colors: ['#0d1117', '#21262d']
  },
  pages: {
    pattern: 'dots',
    colors: ['#0d1117', '#21262d'],
    animation: true
  }
};`;
    fs.writeFileSync('hex-luthor.config.js', config);
    console.log('✅ Created hex-luthor.config.js');
    break;
  }

  default:
    showHelp();
    process.exit(command ? 1 : 0);
}
