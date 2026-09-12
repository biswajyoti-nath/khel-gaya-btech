const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const APP_JS_PATH = path.join(ROOT_DIR, 'js/app.js');
const JSON_PATH = path.join(ROOT_DIR, 'curriculum.json');

test('Boss Fight Challenges & 4-Criterion Examiner Rubrics (R2)', async (t) => {
  await t.test('js/app.js contains BOSS_CHALLENGES engine and 4-criterion rubric rendering', () => {
    assert.ok(fs.existsSync(APP_JS_PATH), 'js/app.js must exist');
    const appCode = fs.readFileSync(APP_JS_PATH, 'utf8');

    // Engine patterns
    assert.match(appCode, /const BOSS_CHALLENGES\s*=\s*\[/, 'BOSS_CHALLENGES array must be defined in js/app.js');
    assert.match(appCode, /\[10 MARKS\]/, 'Must support [10 MARKS] university exam question');
    assert.match(appCode, /\[5 MARKS\]/, 'Must support [5 MARKS] practical / differentiate question');
    assert.match(appCode, /currentBossRubric\s*=\s*challenge\.rubric/, 'Current rubric must be assigned to challenge.rubric');
    assert.match(appCode, /rubricEl\.innerHTML\s*=/, 'Rubric criteria must be rendered in DOM');
  });

  await t.test('BOSS_CHALLENGES generators produce valid 4-criterion rubrics for 5-mark and 10-mark challenges', () => {
    const appCode = fs.readFileSync(APP_JS_PATH, 'utf8');

    // Extract BOSS_CHALLENGES array definition
    const match = appCode.match(/const BOSS_CHALLENGES\s*=\s*(\[[\s\S]*?\n\s*\]);/);
    assert.ok(match, 'Failed to extract BOSS_CHALLENGES definition from js/app.js');

    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`BOSS_CHALLENGES = ${match[1]};`, sandbox);

    const challenges = sandbox.BOSS_CHALLENGES;
    assert.ok(Array.isArray(challenges), 'BOSS_CHALLENGES must evaluate to an array');
    assert.ok(challenges.length >= 3, 'BOSS_CHALLENGES must have at least 3 scenario generators');

    const mockTopic = {
      id: 'test_topic',
      cat: 'Core Concepts',
      title: 'TEST TOPIC ARCHITECTURE',
      sub: 'Mechanisms & Implementations',
      plain: 'Intuitive explanation of the test topic.',
      def: 'Formal university academic definition of the test topic.',
      exam: 'Exam mnemonic and key punchline.',
      trap: 'Common pitfalls and student traps.',
      example: 'Concrete production example and demonstration.',
      q: 'Active retrieval question?',
      a: 'Active retrieval model answer.'
    };

    challenges.forEach((gen, idx) => {
      assert.equal(typeof gen, 'function', `Challenge generator #${idx + 1} must be a function`);
      const result = gen(mockTopic);

      assert.ok(result && typeof result === 'object', `Challenge #${idx + 1} must return an object`);
      assert.ok(
        typeof result.prompt === 'string' && result.prompt.length >= 30,
        `Challenge #${idx + 1} prompt must be >= 30 chars, got: ${result.prompt}`
      );
      assert.match(
        result.prompt,
        /\[(10|5) MARKS\]/,
        `Challenge #${idx + 1} prompt must declare [10 MARKS] or [5 MARKS]`
      );

      assert.ok(
        Array.isArray(result.rubric),
        `Challenge #${idx + 1} rubric must be an array`
      );
      assert.equal(
        result.rubric.length,
        4,
        `Challenge #${idx + 1} rubric must have exactly 4 grading criteria, got ${result.rubric.length}`
      );

      result.rubric.forEach((crit, cIdx) => {
        assert.ok(
          typeof crit === 'string' && crit.trim().length >= 10,
          `Challenge #${idx + 1} criterion #${cIdx + 1} must be non-empty string (>= 10 chars)`
        );
      });
    });
  });

  await t.test('Module-authored boss challenges in curriculum.json strictly comply with rubric specifications', () => {
    assert.ok(fs.existsSync(JSON_PATH), 'curriculum.json must exist');
    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

    let checkedModuleBossChallenges = 0;

    for (const subj of data.subjects || []) {
      for (const mod of subj.modules || []) {
        if (mod.bossChallenges) {
          assert.ok(
            Array.isArray(mod.bossChallenges),
            `[${subj.id}/m${mod.num}] bossChallenges must be an array`
          );

          mod.bossChallenges.forEach((bc, bIdx) => {
            const loc = `[${subj.id}/m${mod.num}/boss#${bIdx + 1}]`;

            assert.ok(
              [5, 10].includes(bc.marks),
              `${loc} marks must be 5 or 10, got ${bc.marks}`
            );

            assert.ok(
              typeof bc.scenario === 'string' && bc.scenario.trim().length >= 30,
              `${loc} scenario prompt must be >= 30 chars`
            );

            assert.ok(
              Array.isArray(bc.rubric),
              `${loc} rubric must be an array`
            );

            assert.equal(
              bc.rubric.length,
              4,
              `${loc} rubric must have exactly 4 criteria, got ${bc.rubric.length}`
            );

            bc.rubric.forEach((crit, cIdx) => {
              assert.ok(
                typeof crit === 'string' && crit.trim().length >= 10,
                `${loc} criterion #${cIdx + 1} must be non-empty string (>= 10 chars)`
              );
            });

            checkedModuleBossChallenges++;
          });
        }
      }
    }

    // Passively note how many module boss challenges were authored
    assert.ok(checkedModuleBossChallenges >= 0);
  });
});
