// Run with: node tests/test_vendor_security.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const vendor = 'gravis/_internal/plotting/third_party/';

for (const loader of [vendor + 'require/require.min.js', 'docs/source/_static/js/require.js']) {
  const context = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval });
  const run = code => vm.runInContext(code, context, { timeout: 1000 });
  run(fs.readFileSync(path.join(root, loader), 'utf8'));
  // GHSA-x3m3-4wpv-5vgc: configuration must not modify Object.prototype.
  run(`requirejs.config(JSON.parse('{"paths":{"__proto__":{"polluted":"yes"}}}'));`);
  assert.equal(run('({}).polluted'), undefined, loader);
  run(fs.readFileSync(path.join(root, vendor + 'd3/d3.v7.min.def.js'), 'utf8'));
  context.requirejs(['gravis-d3-v7'], d3 => {
    assert.equal(d3.color('red').formatHex(), '#ff0000');
    context.d3 = d3;
    // GHSA-36jr-mh4h-2g58: reject pathological color input within the VM timeout.
    assert.equal(run(`d3.color('rgb(' + ' '.repeat(100000) + 'x)')`), null);
    console.log(loader + ': prototype pollution and D3 color checks passed');
  }, error => { throw error; });
}
