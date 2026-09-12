const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT_DIR, 'curriculum.json');

const EXPECTED_COURSES = {
  ai: {
    code: 'CS241501',
    title: 'Artificial Intelligence',
    modules: 5,
    minTopics: 50,
    minQuizzes: 50
  },
  os: {
    code: 'CS241502',
    title: 'Operating Systems',
    modules: 5,
    minTopics: 50,
    minQuizzes: 50
  },
  cn: {
    code: 'CS241503',
    title: 'Computer Networks',
    modules: 5,
    minTopics: 50,
    minQuizzes: 50
  },
  flat: {
    code: 'CS241504',
    title: 'Formal Language and Automata Theory',
    modules: 5,
    minTopics: 50,
    minQuizzes: 50
  },
  cyber: {
    code: 'CS241505',
    title: 'Cyber Security',
    modules: 5,
    minTopics: 50,
    minQuizzes: 50
  },
  devops: {
    code: 'CS241513',
    title: 'Software DevOps and Automation Lab',
    modules: 5,
    minTopics: 50,
    minQuizzes: 50
  }
};

test('Syllabus Coverage & Volume Requirements (R1)', async (t) => {
  assert.ok(fs.existsSync(JSON_PATH), 'curriculum.json must exist in project root');
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  const data = JSON.parse(raw);

  await t.test('All 6 prescribed ASTU 5th Sem subjects are present with exact course codes', () => {
    assert.ok(Array.isArray(data.subjects), 'subjects must be an array');
    assert.equal(data.subjects.length, 6, `Expected exactly 6 subjects, got ${data.subjects.length}`);

    const subjectMap = new Map(data.subjects.map(s => [s.id, s]));

    for (const [id, exp] of Object.entries(EXPECTED_COURSES)) {
      const subj = subjectMap.get(id);
      assert.ok(subj, `Subject '${id}' (${exp.title}) must be present in curriculum`);
      assert.equal(subj.code, exp.code, `Subject '${id}' course code mismatch (expected ${exp.code}, got ${subj.code})`);
      assert.ok(subj.icon && typeof subj.icon === 'string' && subj.icon.trim().length > 0, `Subject '${id}' missing icon`);
    }
  });

  // Individual Subject Subtests
  for (const [subjId, exp] of Object.entries(EXPECTED_COURSES)) {
    await t.test(`Subject [${subjId.toUpperCase()}]: ${exp.title} (${exp.code}) coverage`, () => {
      const subj = (data.subjects || []).find(s => s.id === subjId);
      assert.ok(subj, `Subject '${subjId}' not found in curriculum dataset`);

      const mods = subj.modules || [];
      assert.equal(
        mods.length,
        exp.modules,
        `Subject '${subjId}' must contain ${exp.modules} modules, found ${mods.length}`
      );

      let subjTopics = 0;
      let subjQuizzes = 0;

      mods.forEach((mod, idx) => {
        const expectedNum = idx + 1;
        assert.equal(
          mod.num,
          expectedNum,
          `Subject '${subjId}' module at index ${idx} must have num = ${expectedNum}, got ${mod.num}`
        );
        assert.ok(
          typeof mod.title === 'string' && mod.title.trim().length >= 5,
          `Subject '${subjId}' module ${mod.num} missing valid title`
        );

        const topics = mod.topics || [];
        const quiz = mod.quiz || [];
        subjTopics += topics.length;
        subjQuizzes += quiz.length;

        assert.ok(
          topics.length >= 10,
          `Subject '${subjId}' module ${mod.num} requires >= 10 topics, found ${topics.length}`
        );
        assert.ok(
          quiz.length >= 10,
          `Subject '${subjId}' module ${mod.num} requires >= 10 questions, found ${quiz.length}`
        );
      });

      assert.ok(
        subjTopics >= exp.minTopics,
        `Subject '${subjId}' requires >= ${exp.minTopics} topics, found ${subjTopics}`
      );
      assert.ok(
        subjQuizzes >= exp.minQuizzes,
        `Subject '${subjId}' requires >= ${exp.minQuizzes} questions, found ${subjQuizzes}`
      );
    });
  }

  await t.test('Global Curriculum Totals: exactly 30 modules, >= 300 topics, >= 300 questions', () => {
    let totalModules = 0;
    let totalTopics = 0;
    let totalQuizzes = 0;

    for (const subj of data.subjects || []) {
      const mods = subj.modules || [];
      totalModules += mods.length;
      for (const mod of mods) {
        totalTopics += (mod.topics || []).length;
        totalQuizzes += (mod.quiz || []).length;
      }
    }

    assert.equal(totalModules, 30, `Total modules across curriculum must be exactly 30, found ${totalModules}`);
    assert.ok(totalTopics >= 300, `Total topics across curriculum must be >= 300, found ${totalTopics}`);
    assert.ok(totalQuizzes >= 300, `Total questions across curriculum must be >= 300, found ${totalQuizzes}`);
  });
});
