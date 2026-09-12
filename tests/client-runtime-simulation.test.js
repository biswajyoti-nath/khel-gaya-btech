const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
const JSON_PATH = path.join(ROOT_DIR, 'curriculum.json');
const AUDIO_JS_PATH = path.join(ROOT_DIR, 'js/audio.js');
const CURRICULUM_JS_PATH = path.join(ROOT_DIR, 'js/curriculum.js');
const ENGINE_JS_PATH = path.join(ROOT_DIR, 'js/engine.js');
const APP_JS_PATH = path.join(ROOT_DIR, 'js/app.js');
const STYLES_CSS_PATH = path.join(ROOT_DIR, 'css/styles.css');

// --- LIGHTWEIGHT ADVERSARIAL DOM SIMULATOR FOR BROWSER RUNTIME IN NODE ---

class MockClassList {
  constructor(el) {
    this.el = el;
    this._classes = new Set();
    this._syncFromClassName();
  }
  _syncFromClassName() {
    this._classes.clear();
    if (this.el._className) {
      this.el._className.split(/\s+/).filter(Boolean).forEach(c => this._classes.add(c));
    }
  }
  _syncToClassName() {
    this.el._className = Array.from(this._classes).join(' ');
  }
  add(...classes) {
    classes.forEach(c => this._classes.add(c));
    this._syncToClassName();
  }
  remove(...classes) {
    classes.forEach(c => this._classes.delete(c));
    this._syncToClassName();
  }
  contains(cls) {
    return this._classes.has(cls);
  }
  toggle(cls, force) {
    if (force !== undefined) {
      if (force) this.add(cls);
      else this.remove(cls);
      return force;
    }
    if (this.contains(cls)) {
      this.remove(cls);
      return false;
    } else {
      this.add(cls);
      return true;
    }
  }
}

class MockElement {
  constructor(tagName = 'div', ownerDoc = null) {
    this.tagName = tagName.toUpperCase();
    this.ownerDoc = ownerDoc;
    this.id = '';
    this._className = '';
    this.classList = new MockClassList(this);
    this.style = {};
    this.dataset = {};
    this._textContent = '';
    this._innerHTML = '';
    this._value = '';
    this.disabled = false;
    this.children = [];
    this.parentElement = null;
    this.attributes = {};
    this.eventListeners = {};
  }
  get className() { return this._className; }
  set className(val) {
    this._className = val || '';
    this.classList._syncFromClassName();
  }
  get textContent() {
    if (this.children.length > 0) return this.children.map(c => c.textContent).join('');
    return this._textContent;
  }
  set textContent(val) {
    this._textContent = String(val);
    this.children = [];
    this._innerHTML = String(val);
  }
  get value() { return this._value; }
  set value(val) { this._value = String(val); }
  get innerHTML() { return this._innerHTML; }
  set innerHTML(html) {
    this._innerHTML = String(html);
    this.children = [];
    if (this.ownerDoc) {
      parseHtmlToDom(this._innerHTML, this, this.ownerDoc);
    }
  }
  setAttribute(k, v) {
    this.attributes[k] = String(v);
    if (k === 'id') {
      this.id = String(v);
      if (this.ownerDoc) this.ownerDoc.elementsById.set(this.id, this);
    }
    if (k === 'class') this.className = String(v);
    if (k.startsWith('data-')) {
      const prop = k.slice(5).replace(/-([a-z])/g, (_, g) => g.toUpperCase());
      this.dataset[prop] = String(v);
    }
    if (k === 'value') this._value = String(v);
  }
  getAttribute(k) { return this.attributes[k] !== undefined ? this.attributes[k] : null; }
  removeAttribute(k) { delete this.attributes[k]; }
  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    if (this.ownerDoc && child.id) this.ownerDoc.elementsById.set(child.id, child);
    return child;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentElement = null;
    }
    return child;
  }
  remove() {
    if (this.parentElement) this.parentElement.removeChild(this);
  }
  scrollIntoView() {}
  click() {
    if (typeof this.onclick === 'function') {
      this.onclick({ target: this, preventDefault() {} });
    }
  }
  addEventListener(event, fn) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(fn);
  }
  removeEventListener(event, fn) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(f => f !== fn);
    }
  }
  querySelectorAll(selector) {
    const matches = [];
    const walk = (node) => {
      for (const child of node.children) {
        if (matchesSelector(child, selector)) matches.push(child);
        walk(child);
      }
    };
    walk(this);
    return matches;
  }
  querySelector(selector) {
    const all = this.querySelectorAll(selector);
    return all.length > 0 ? all[0] : null;
  }
}

function hasAncestor(node, tagName) {
  let curr = node.parentElement;
  while (curr) {
    if (curr.tagName === tagName.toUpperCase()) return true;
    curr = curr.parentElement;
  }
  return false;
}

function matchesSelector(node, sel) {
  sel = sel.trim();
  if (sel.startsWith('.')) return node.classList.contains(sel.slice(1));
  if (sel.startsWith('#')) return node.id === sel.slice(1);
  if (sel === 'nav button') return node.tagName === 'BUTTON' && hasAncestor(node, 'NAV');
  if (/^[a-zA-Z0-9]+$/.test(sel)) return node.tagName === sel.toUpperCase();
  return false;
}

function parseHtmlToDom(html, rootElement, ownerDoc) {
  const tokenRegex = /<!--[\s\S]*?-->|<(\/)?([a-zA-Z0-9]+)((?:\s+[a-zA-Z0-9_-]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/)?>|([^<]+)/g;
  const stack = [rootElement];
  const VOID_TAGS = new Set(['AREA','BASE','BR','COL','EMBED','HR','IMG','INPUT','LINK','META','PARAM','SOURCE','TRACK','WBR']);

  let match;
  while ((match = tokenRegex.exec(html)) !== null) {
    const [full, isClosing, tagNameRaw, attrStr, isSelfClosing, textContent] = match;
    if (textContent) {
      const text = textContent.trim();
      if (text) {
        const top = stack[stack.length - 1];
        if (!top._textContent) top._textContent = text;
        else top._textContent += ' ' + text;
      }
      continue;
    }
    if (!tagNameRaw) continue;
    const tagName = tagNameRaw.toUpperCase();
    if (isClosing) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName === tagName) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    const el = new MockElement(tagName, ownerDoc);
    if (attrStr) {
      const attrRegex = /([a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
      let aMatch;
      while ((aMatch = attrRegex.exec(attrStr)) !== null) {
        const k = aMatch[1];
        const v = aMatch[2] !== undefined ? aMatch[2] : (aMatch[3] !== undefined ? aMatch[3] : (aMatch[4] !== undefined ? aMatch[4] : ''));
        el.setAttribute(k, v);
      }
    }
    const currentParent = stack[stack.length - 1];
    currentParent.appendChild(el);
    if (!VOID_TAGS.has(tagName) && !isSelfClosing) stack.push(el);
  }
}

class MockDocument {
  constructor() {
    this.elementsById = new Map();
    this.body = new MockElement('BODY', this);
    this.eventListeners = {};
  }
  getElementById(id) {
    return this.elementsById.get(id) || null;
  }
  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }
  querySelector(selector) {
    return this.body.querySelector(selector);
  }
  createElement(tag) {
    return new MockElement(tag, this);
  }
  addEventListener(event, fn) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(fn);
  }
  removeEventListener(event, fn) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(f => f !== fn);
    }
  }
  dispatchEvent(event) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach(fn => fn(event));
    }
  }
}

class MockLocalStorage {
  constructor() { this.store = new Map(); }
  getItem(k) { return this.store.has(k) ? this.store.get(k) : null; }
  setItem(k, v) { this.store.set(k, String(v)); }
  removeItem(k) { this.store.delete(k); }
  clear() { this.store.clear(); }
}

class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = 'running';
    this.destination = {};
  }
  resume() { return Promise.resolve(); }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime() {} },
      connect() {},
      start() {},
      stop() {}
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      connect() {}
    };
  }
}

function createBrowserSandbox() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const doc = new MockDocument();
  parseHtmlToDom(html, doc.body, doc);

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    document: doc,
    localStorage: new MockLocalStorage(),
    AudioContext: MockAudioContext,
    webkitAudioContext: MockAudioContext,
    scrollTo: () => {},
    confirm: () => true,
    prompt: () => null,
    encodeURIComponent,
    decodeURIComponent
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;

  vm.createContext(sandbox);
  return { sandbox, doc };
}

// --- TEST SUITE ---

test('Adversarial Client-Side Runtime Simulation & Zero-CDN Integrity', async (t) => {

  await t.test('Audit zero external CDNs, unbundled imports, and verify static assets', () => {
    assert.ok(fs.existsSync(INDEX_PATH), 'index.html must exist');
    const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

    // 1. No external CDN scripts in index.html
    const scriptSrcMatches = Array.from(indexHtml.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g));
    assert.ok(scriptSrcMatches.length >= 4, 'index.html must contain at least 4 script tags');
    for (const match of scriptSrcMatches) {
      const src = match[1];
      assert.ok(
        !/^https?:\/\//i.test(src) && !/^\/\//.test(src),
        `index.html contains external script: ${src}`
      );
      assert.ok(
        fs.existsSync(path.join(ROOT_DIR, src)),
        `Physical script does not exist: ${src}`
      );
    }

    // 2. No external stylesheets or remote fonts
    const linkMatches = Array.from(indexHtml.matchAll(/<link\s+[^>]*href=["']([^"']+)["']/g));
    for (const match of linkMatches) {
      const href = match[1];
      assert.ok(
        !/^https?:\/\//i.test(href) && !/^\/\//.test(href),
        `index.html contains external link: ${href}`
      );
    }

    // 3. No @import or external url() in styles.css
    if (fs.existsSync(STYLES_CSS_PATH)) {
      const css = fs.readFileSync(STYLES_CSS_PATH, 'utf8');
      assert.ok(!/@import\s+url\(['"]?https?:/i.test(css), 'CSS must not import external stylesheets');
      assert.ok(!/url\(['"]?https?:/i.test(css), 'CSS must not load external assets');
    }

    // 4. No ES module import / require in js/*.js
    const jsFiles = ['audio.js', 'curriculum.js', 'engine.js', 'app.js'];
    for (const file of jsFiles) {
      const code = fs.readFileSync(path.join(ROOT_DIR, 'js', file), 'utf8');
      assert.ok(!/^\s*import\s+[^'"]+\s+from/m.test(code), `${file} contains unbundled static import statement`);
      assert.ok(!/\bimport\s*\(/m.test(code), `${file} contains dynamic import()`);
      assert.ok(!/\brequire\s*\(/m.test(code), `${file} contains CommonJS require()`);
    }
  });

  await t.test('Client-side script loading sequence execution in simulated browser context', () => {
    const { sandbox } = createBrowserSandbox();

    // Sequentially load scripts matching index.html order:
    // 1. js/audio.js
    const audioCode = fs.readFileSync(AUDIO_JS_PATH, 'utf8');
    assert.doesNotThrow(() => {
      vm.runInContext(audioCode, sandbox, { filename: 'js/audio.js' });
    }, 'Loading js/audio.js must not throw');
    assert.ok(sandbox.window.cyberSound, 'window.cyberSound must be initialized by audio.js');
    assert.equal(typeof sandbox.window.cyberSound.click, 'function');

    // 2. js/curriculum.js
    const curriculumCode = fs.readFileSync(CURRICULUM_JS_PATH, 'utf8');
    assert.doesNotThrow(() => {
      vm.runInContext(curriculumCode, sandbox, { filename: 'js/curriculum.js' });
    }, 'Loading js/curriculum.js must not throw');
    assert.ok(sandbox.window.DEFAULT_CURRICULUM, 'window.DEFAULT_CURRICULUM must be initialized by curriculum.js');
    assert.equal(sandbox.window.DEFAULT_CURRICULUM.subjects.length, 6, 'Must contain 6 ASTU subjects');

    // 3. js/engine.js
    const engineCode = fs.readFileSync(ENGINE_JS_PATH, 'utf8');
    assert.doesNotThrow(() => {
      vm.runInContext(engineCode, sandbox, { filename: 'js/engine.js' });
    }, 'Loading js/engine.js must not throw');
    assert.ok(sandbox.window.gamifyEngine, 'window.gamifyEngine must be initialized by engine.js');
    assert.equal(typeof sandbox.window.gamifyEngine.getCurriculum, 'function');

    // 4. js/app.js
    const appCode = fs.readFileSync(APP_JS_PATH, 'utf8');
    assert.doesNotThrow(() => {
      vm.runInContext(appCode, sandbox, { filename: 'js/app.js' });
    }, 'Loading js/app.js must not throw');

    assert.equal(typeof sandbox.window.onSubjectChange, 'function', 'window.onSubjectChange must be exposed');
    assert.equal(typeof sandbox.window.onModuleChange, 'function', 'window.onModuleChange must be exposed');
    assert.equal(typeof sandbox.window.go, 'function', 'window.go must be exposed');
  });

  await t.test('GamificationEngine loads default curriculum and authoring functions operate correctly', () => {
    const { sandbox } = createBrowserSandbox();
    vm.runInContext(fs.readFileSync(CURRICULUM_JS_PATH, 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(ENGINE_JS_PATH, 'utf8'), sandbox);

    const engine = sandbox.window.gamifyEngine;
    const curriculum = engine.getCurriculum();

    assert.ok(curriculum, 'Curriculum must be returned');
    assert.equal(curriculum.subjects.length, 6, 'Curriculum must have 6 subjects');

    // Test gamifyTopic
    const pack = engine.gamifyTopic('Virtual Memory Paging', 'Operating Systems', 'Memory Management', 'Paging translates virtual to physical addresses.');
    assert.ok(pack && pack.topic && pack.quiz, 'gamifyTopic must return topic and quiz');
    assert.equal(pack.topic.title, 'VIRTUAL MEMORY PAGING');
    assert.equal(pack.quiz.opts.length, 4, 'Quiz item must have 4 options');
    assert.equal(pack.quiz.distractors.length, 3, 'Quiz item must have 3 distractors');

    // Test storage persistence
    engine.saveCurriculum(curriculum);
    const persisted = engine.getCurriculum();
    assert.equal(persisted.subjects.length, 6, 'Persisted curriculum must load from localStorage');

    // Test resetToDefault
    const reset = engine.resetToDefault();
    assert.equal(reset.subjects.length, 6, 'Reset to default must restore curriculum');
  });

  await t.test('State synchronization across all 6 subjects and all 30 modules in browser simulation', () => {
    const { sandbox, doc } = createBrowserSandbox();
    vm.runInContext(fs.readFileSync(AUDIO_JS_PATH, 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(CURRICULUM_JS_PATH, 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(ENGINE_JS_PATH, 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(APP_JS_PATH, 'utf8'), sandbox);

    const curr = sandbox.window.gamifyEngine.getCurriculum();
    assert.equal(curr.subjects.length, 6);

    let totalModulesTested = 0;
    let totalTopicsTested = 0;

    for (const subj of curr.subjects) {
      // 1. Test subject change
      assert.doesNotThrow(() => {
        sandbox.window.onSubjectChange(subj.id);
      }, `onSubjectChange('${subj.id}') must not throw`);

      const topTitle = doc.getElementById('top-subj-title');
      assert.ok(topTitle.textContent.includes(subj.title.toUpperCase()), `top-subj-title must contain '${subj.title.toUpperCase()}'`);

      assert.equal(subj.modules.length, 5, `Subject '${subj.id}' must have 5 modules`);

      for (const mod of subj.modules) {
        // 2. Test module change
        assert.doesNotThrow(() => {
          sandbox.window.onModuleChange(mod.id);
        }, `onModuleChange('${mod.id}') must not throw`);

        const modBadge = doc.getElementById('curr-module-badge');
        assert.ok(
          modBadge.textContent.includes(`MODULE ${mod.num}`),
          `curr-module-badge must show MODULE ${mod.num}, got ${modBadge.textContent}`
        );

        const topicCountBadge = doc.getElementById('curr-topic-count');
        assert.ok(
          topicCountBadge.textContent.includes(`${mod.topics.length} TOPICS`),
          `curr-topic-count must indicate ${mod.topics.length} topics`
        );

        // 3. Test active views and interactions within this module:
        // A. Flashcard deck (Learn view)
        sandbox.window.go('learn');
        const qEl = doc.getElementById('q');
        assert.ok(qEl.textContent.trim().length > 0, `Learn view question prompt must not be empty`);
        sandbox.window.reveal();
        const aEl = doc.getElementById('a');
        assert.ok(aEl.classList.contains('show'), `Model answer must be revealed`);
        sandbox.window.rate(2); // Got it (+2 XP)
        sandbox.window.next();
        sandbox.window.prevCard();

        // B. Active Recall Quiz
        sandbox.window.go('quiz');
        const qqEl = doc.getElementById('qq');
        assert.ok(qqEl.textContent.trim().length > 0, `Quiz prompt must not be empty`);
        sandbox.window.answerQuiz(0);
        sandbox.window.nextQuiz();

        // C. Boss Fight Evaluation
        sandbox.window.go('boss');
        const bqEl = doc.getElementById('bq');
        assert.ok(bqEl.textContent.trim().length > 0, `Boss prompt must not be empty`);
        assert.match(bqEl.textContent, /\[(10|5) MARKS\]/, `Boss prompt must specify marks`);
        sandbox.window.showBoss();
        const rubricEl = doc.getElementById('boss-rubric');
        assert.ok(rubricEl.innerHTML.includes('[Criterion 1]'), `Boss rubric must render Criterion 1`);
        assert.ok(rubricEl.innerHTML.includes('[Criterion 4]'), `Boss rubric must render Criterion 4`);
        sandbox.window.gradeBoss(5); // Nailed it (+5 XP)
        sandbox.window.newBoss();

        // D. Exam Cheat Sheet & Filters
        sandbox.window.go('refs');
        sandbox.window.setFilter('ALL');
        const refGrid = doc.getElementById('refgrid');
        assert.ok(refGrid.innerHTML.trim().length > 0, `Cheat sheet grid must not be empty`);

        totalModulesTested++;
        totalTopicsTested += mod.topics.length;
      }
    }

    assert.equal(totalModulesTested, 30, `Must have tested exactly 30 modules, tested ${totalModulesTested}`);
    assert.ok(totalTopicsTested >= 300, `Must have tested >= 300 topics across modules`);

    // Verify cumulative XP accumulated through testing
    const xpEl = doc.getElementById('xp');
    assert.ok(Number(xpEl.textContent) > 0, `XP must be greater than 0 after simulated user runs`);
  });

  await t.test('BOSS_CHALLENGES generators produce valid 5-mark and 10-mark challenges with 4-criterion rubrics for topics across all 30 modules', () => {
    const appCode = fs.readFileSync(APP_JS_PATH, 'utf8');
    const match = appCode.match(/const BOSS_CHALLENGES\s*=\s*(\[[\s\S]*?\n\s*\]);/);
    assert.ok(match, 'BOSS_CHALLENGES must be defined in js/app.js');

    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`BOSS_CHALLENGES = ${match[1]};`, sandbox);
    const generators = sandbox.BOSS_CHALLENGES;
    assert.equal(generators.length, 3, 'Must contain 3 boss challenge generators');

    const curriculumData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    let totalChallengesGenerated = 0;

    for (const subj of curriculumData.subjects) {
      for (const mod of subj.modules) {
        for (const topic of mod.topics) {
          generators.forEach((gen, gIdx) => {
            const result = gen(topic);
            const loc = `[${subj.id}/m${mod.num}/${topic.id}/gen#${gIdx}]`;

            assert.ok(result && typeof result === 'object', `${loc} must return challenge object`);
            assert.ok(typeof result.prompt === 'string' && result.prompt.length >= 30, `${loc} prompt must be >= 30 chars`);
            assert.match(result.prompt, /\[(10|5) MARKS\]/, `${loc} prompt must declare [10 MARKS] or [5 MARKS]`);
            assert.ok(result.prompt.includes(topic.title), `${loc} prompt must reference topic title`);

            assert.ok(Array.isArray(result.rubric), `${loc} rubric must be an array`);
            assert.equal(result.rubric.length, 4, `${loc} rubric must have exactly 4 grading criteria`);

            result.rubric.forEach((crit, cIdx) => {
              assert.ok(typeof crit === 'string' && crit.trim().length >= 10, `${loc} criterion #${cIdx + 1} must be >= 10 chars`);
              assert.ok(crit.includes('<b>') && crit.includes('</b>'), `${loc} criterion #${cIdx + 1} must have bold category tag`);
            });

            totalChallengesGenerated++;
          });
        }
      }
    }

    assert.ok(
      totalChallengesGenerated >= 900,
      `Expected at least 900 generated challenge instances across all topics, evaluated ${totalChallengesGenerated}`
    );
  });

  await t.test('Adversarial edge cases, invalid inputs, and boundary state recovery', () => {
    const { sandbox, doc } = createBrowserSandbox();
    vm.runInContext(fs.readFileSync(AUDIO_JS_PATH, 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(CURRICULUM_JS_PATH, 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(ENGINE_JS_PATH, 'utf8'), sandbox);
    vm.runInContext(fs.readFileSync(APP_JS_PATH, 'utf8'), sandbox);

    // 1. Invalid subject ID fallback
    assert.doesNotThrow(() => {
      sandbox.window.onSubjectChange('non_existent_subject_999');
    }, 'onSubjectChange with non-existent subject ID must not throw and must fall back gracefully');

    // 2. Invalid module ID fallback
    assert.doesNotThrow(() => {
      sandbox.window.onModuleChange('m999_invalid');
    }, 'onModuleChange with non-existent module ID must not throw and must handle empty list cleanly');

    // 3. 'all' module selection
    assert.doesNotThrow(() => {
      sandbox.window.onModuleChange('all');
    }, 'onModuleChange("all") must successfully aggregate all module topics');
    const countBadge = doc.getElementById('curr-topic-count');
    assert.ok(parseInt(countBadge.textContent) >= 50, 'All modules selection must contain >= 50 topics');

    // 4. Topic Studio interactive auto-gamification & saving
    sandbox.window.go('engine');
    const titleInput = doc.getElementById('eng-title');
    const notesInput = doc.getElementById('eng-notes');
    titleInput.value = 'Zero-Day Exploit Mitigation';
    notesInput.value = 'Proactive vulnerability patching and memory safety compiler flags.';
    assert.doesNotThrow(() => {
      sandbox.window.autoGamifyInStudio();
      sandbox.window.saveTopicFromStudio();
    }, 'Topic Studio auto-gamify and save must execute cleanly');

    // 5. Sound toggle & mute state
    assert.doesNotThrow(() => {
      sandbox.window.toggleSound();
      sandbox.window.toggleSound();
    }, 'Sound toggle must execute cleanly');

    // 6. Reset study progress
    assert.doesNotThrow(() => {
      sandbox.window.resetProgress();
    }, 'resetProgress must reset study run safely');
    assert.equal(doc.getElementById('xp').textContent, '0', 'XP must be 0 after reset');
    assert.equal(doc.getElementById('streak').textContent, '0', 'Streak must be 0 after reset');

    // 7. Keyboard shortcut dispatching
    assert.doesNotThrow(() => {
      sandbox.window.go('learn');
      doc.dispatchEvent({
        type: 'keydown',
        key: 'r',
        code: 'KeyR',
        target: { tagName: 'DIV' },
        preventDefault() {}
      });
      doc.dispatchEvent({
        type: 'keydown',
        key: '2',
        code: 'Digit2',
        target: { tagName: 'DIV' },
        preventDefault() {}
      });
    }, 'Keyboard shortcuts must execute cleanly');
  });

});
