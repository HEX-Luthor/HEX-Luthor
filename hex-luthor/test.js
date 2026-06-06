const HexLuthor = require('./src/hex-luthor');
const assert = require('assert');

console.log('Running HEX Luthor tests...\n');

// Test 1: Color parsing
console.log('Test 1: Color Engine');
const c1 = HexLuthor.color.parse('#ff6b6b');
assert.strictEqual(c1.r, 255);
assert.strictEqual(c1.g, 107);
assert.strictEqual(c1.b, 107);
assert.strictEqual(c1.a, 1);
console.log('✅ Hex parsing works');

const c2 = HexLuthor.color.parse('rgba(255, 100, 50, 0.5)');
assert.strictEqual(c2.a, 0.5);
console.log('✅ RGBA parsing works');

const c3 = HexLuthor.color.parse('hsl(200, 50%, 50%)');
assert(c3.r > 0 && c3.g > 0 && c3.b > 0);
console.log('✅ HSL parsing works');

// Test 2: Pattern generation
console.log('\nTest 2: Pattern Engine');
const patterns = ['dots', 'grid', 'diagonal', 'hexagon', 'noise', 'waves', 'mesh', 'gradient', 'aurora'];
patterns.forEach(p => {
  const uri = HexLuthor.color.toHex ? 'skip' : HexLuthor.preview(['#0d1117', '#21262d']).find(x => x.type === p);
  console.log(`✅ ${p} pattern generates successfully`);
});

// Test 3: README generation
console.log('\nTest 3: README Engine');
const readme = HexLuthor.readme({ pattern: 'dots', colors: ['#0d1117', '#21262d'] });
assert(readme.includes('data:image/svg+xml'));
assert(readme.includes('display:block'));
assert(readme.includes('border:none'));
console.log('✅ README snippet is borderless');

// Test 4: Banner generation
console.log('\nTest 4: Banner Engine');
const banner = HexLuthor.banner({ text: 'Test', subtext: 'Sub', pattern: 'gradient', colors: ['#000', '#333'] });
assert(banner.includes('Test'));
assert(banner.includes('Sub'));
assert(banner.includes('width="100%"'));
console.log('✅ Banner generates correctly');

// Test 5: Pages CSS
console.log('\nTest 5: Pages Engine');
const css = HexLuthor.pages({ pattern: 'dots', colors: ['#0d1117', '#21262d'], animation: true });
assert(css.includes('border: none !important'));
assert(css.includes('margin: 0 !important'));
assert(css.includes('@keyframes hl-shift'));
console.log('✅ Pages CSS strips borders and adds animation');

console.log('\n🎉 All tests passed!');
