const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT_DIR, 'curriculum.json');
const JS_PATH = path.join(ROOT_DIR, 'js/curriculum.js');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');

test('Application Integration & Runtime Integrity (R3)', async (t) => {
  await t.test('curriculum.json and js/curriculum.js are in 100% deep strict data equality', () => {
    assert.ok(fs.existsSync(JSON_PATH), 'curriculum.json must exist');
    assert.ok(fs.existsSync(JS_PATH), 'js/curriculum.js must exist');

    const jsonRaw = fs.readFileSync(JSON_PATH, 'utf8');
    const jsonData = JSON.parse(jsonRaw);

    const jsRaw = fs.readFileSync(JS_PATH, 'utf8');

    // Header prefix assertion
    assert.match(
      jsRaw,
      /^\/\/ KHEL GAYA B\.TECH CURRICULUM DATA \(ASTU 5TH SEMESTER\)\r?\nvar DEFAULT_CURRICULUM = window\.DEFAULT_CURRICULUM = /,
      'js/curriculum.js must start with official ASTU 5th semester comment and variable assignment'
    );

    // Extraction & deep equality
    const match = jsRaw.match(/DEFAULT_CURRICULUM\s*=\s*(\{[\s\S]*\});?\s*$/m);
    assert.ok(match, 'Failed to extract JSON object from js/curriculum.js');

    const jsData = JSON.parse(match[1]);
    assert.deepStrictEqual(jsonData, jsData, 'curriculum.json and js/curriculum.js must have identical payload');
  });

  await t.test('index.html script loading sequence and zero-dependency static integrity', () => {
    assert.ok(fs.existsSync(INDEX_PATH), 'index.html must exist');
    const html = fs.readFileSync(INDEX_PATH, 'utf8');

    // Expected local scripts in order
    const expectedScriptOrder = [
      'js/audio.js',
      'js/curriculum.js',
      'js/engine.js',
      'js/app.js'
    ];

    let lastIndex = -1;
    for (const scriptPath of expectedScriptOrder) {
      const scriptTag = `<script src="${scriptPath}"></script>`;
      const tagIndex = html.indexOf(scriptTag);
      assert.ok(
        tagIndex !== -1,
        `index.html must contain script tag: ${scriptTag}`
      );
      assert.ok(
        tagIndex > lastIndex,
        `Script ${scriptPath} must be loaded after previous scripts in sequence`
      );
      lastIndex = tagIndex;

      // Verify physical file existence
      const absPath = path.join(ROOT_DIR, scriptPath);
      assert.ok(
        fs.existsSync(absPath),
        `Physical script file referenced by index.html does not exist: ${absPath}`
      );
    }

    // Zero external CDN scripts check
    const scriptSrcMatches = html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g);
    for (const match of scriptSrcMatches) {
      const src = match[1];
      assert.ok(
        !/^https?:\/\//i.test(src) && !/^\/\//.test(src),
        `External script dependency found in index.html: ${src}. Must have zero external runtime build dependencies.`
      );
    }

    // Verify local stylesheets exist
    const cssLinkMatches = html.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g);
    for (const match of cssLinkMatches) {
      const href = match[1];
      if (!/^https?:\/\//i.test(href)) {
        const absCssPath = path.join(ROOT_DIR, href);
        assert.ok(
          fs.existsSync(absCssPath),
          `Physical stylesheet referenced by index.html does not exist: ${absCssPath}`
        );
      }
    }
  });
});
