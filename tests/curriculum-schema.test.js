const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT_DIR, 'curriculum.json');

const REQUIRED_TOPIC_FIELDS = [
  'id', 'cat', 'title', 'sub', 'plain', 'def', 'exam', 'trap', 'example', 'q', 'a'
];

const REQUIRED_QUIZ_FIELDS = [
  'q', 'opts', 'ans', 'cat', 'correctFb', 'distractors'
];

test('Curriculum Schema & Pedagogy Quality (R2)', async (t) => {
  assert.ok(fs.existsSync(JSON_PATH), 'curriculum.json must exist in project root');
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  const data = JSON.parse(raw);

  await t.test('Root metadata complies with ASTU specifications', () => {
    assert.equal(data.version, '2.0.0', 'version must be 2.0.0');
    assert.match(data.institution, /Assam Science and Technology University|ASTU/, 'institution must reference ASTU');
    assert.match(data.semester, /5th Semester/, 'semester descriptor must mention 5th Semester');
    assert.ok(Array.isArray(data.subjects), 'subjects must be an array');
    assert.ok(data.subjects.length > 0, 'subjects array must not be empty');
  });

  await t.test('Every topic card strictly adheres to the 11-field active recall schema', () => {
    let checkedTopics = 0;
    const globalTopicIds = new Set();

    for (const subj of data.subjects) {
      assert.ok(subj.id, 'subject must have an id');
      for (const mod of (subj.modules || [])) {
        for (const [idx, topic] of (mod.topics || []).entries()) {
          const loc = `[${subj.id}/m${mod.num || '?'}/topic#${idx + 1} (${topic.id || 'unknown'})]`;

          // All 11 required fields must exist and be non-empty strings
          for (const field of REQUIRED_TOPIC_FIELDS) {
            assert.ok(
              typeof topic[field] === 'string' && topic[field].trim().length > 0,
              `${loc} missing or empty required field '${field}'`
            );
          }

          // Topic ID format & uniqueness
          assert.ok(
            !globalTopicIds.has(topic.id),
            `${loc} duplicate topic id '${topic.id}' encountered`
          );
          globalTopicIds.add(topic.id);

          // Pedagogical depth thresholds
          assert.ok(
            topic.plain.trim().length >= 20,
            `${loc} 'plain' explanation too short (<20 chars, got ${topic.plain.trim().length})`
          );
          assert.ok(
            topic.def.trim().length >= 30,
            `${loc} 'def' formal definition too short (<30 chars, got ${topic.def.trim().length})`
          );
          assert.ok(
            topic.exam.trim().length >= 15,
            `${loc} 'exam' punchline too short (<15 chars, got ${topic.exam.trim().length})`
          );
          assert.ok(
            topic.trap.trim().length >= 15,
            `${loc} 'trap' common pitfall too short (<15 chars, got ${topic.trap.trim().length})`
          );
          assert.ok(
            topic.example.trim().length >= 20,
            `${loc} 'example' demonstration too short (<20 chars, got ${topic.example.trim().length})`
          );
          assert.ok(
            topic.q.trim().length >= 10,
            `${loc} 'q' active retrieval prompt too short (<10 chars, got ${topic.q.trim().length})`
          );
          assert.ok(
            topic.a.trim().length >= 10,
            `${loc} 'a' model answer too short (<10 chars, got ${topic.a.trim().length})`
          );

          checkedTopics++;
        }
      }
    }

    assert.ok(checkedTopics > 0, 'Must have at least one topic card checked');
  });

  await t.test('Every quiz item strictly complies with 6-field schema, 4 distinct options, valid answer index, and distractor analyses', () => {
    let checkedQuizzes = 0;

    for (const subj of data.subjects) {
      for (const mod of (subj.modules || [])) {
        for (const [qIdx, quiz] of (mod.quiz || []).entries()) {
          const loc = `[${subj.id}/m${mod.num || '?'}/quiz#${qIdx + 1}]`;

          // Required fields
          for (const field of REQUIRED_QUIZ_FIELDS) {
            assert.notEqual(
              quiz[field],
              undefined,
              `${loc} missing required field '${field}'`
            );
          }

          // Question prompt
          assert.ok(
            typeof quiz.q === 'string' && quiz.q.trim().length >= 15,
            `${loc} question prompt 'q' missing or too short (<15 chars)`
          );

          // Options array
          assert.ok(
            Array.isArray(quiz.opts),
            `${loc} 'opts' must be an array`
          );
          assert.equal(
            quiz.opts.length,
            4,
            `${loc} 'opts' must contain exactly 4 options, got ${quiz.opts.length}`
          );

          for (let i = 0; i < 4; i++) {
            assert.ok(
              typeof quiz.opts[i] === 'string' && quiz.opts[i].trim().length > 0,
              `${loc} option [${i}] must be a non-empty string`
            );
          }

          // Distinct options
          const distinctOpts = new Set(quiz.opts.map(o => o.trim().toLowerCase()));
          assert.equal(
            distinctOpts.size,
            4,
            `${loc} options must be 4 distinct choices, duplicates found in: ${JSON.stringify(quiz.opts)}`
          );

          // Answer index
          assert.ok(
            Number.isInteger(quiz.ans),
            `${loc} 'ans' must be an integer`
          );
          assert.ok(
            quiz.ans >= 0 && quiz.ans <= 3,
            `${loc} 'ans' index must be in range 0..3, got ${quiz.ans}`
          );

          // Category tag
          assert.ok(
            typeof quiz.cat === 'string' && quiz.cat.trim().length > 0,
            `${loc} 'cat' must be a non-empty category string`
          );

          // Correct feedback
          assert.ok(
            typeof quiz.correctFb === 'string' && quiz.correctFb.trim().length >= 20,
            `${loc} 'correctFb' explanation too short (<20 chars, got ${quiz.correctFb ? quiz.correctFb.trim().length : 0})`
          );

          // Distractor explanations
          assert.ok(
            Array.isArray(quiz.distractors),
            `${loc} 'distractors' must be an array`
          );
          assert.equal(
            quiz.distractors.length,
            3,
            `${loc} 'distractors' must contain exactly 3 refutations, got ${quiz.distractors.length}`
          );

          for (let d = 0; d < 3; d++) {
            assert.ok(
              typeof quiz.distractors[d] === 'string' && quiz.distractors[d].trim().length >= 15,
              `${loc} distractor explanation [${d}] too short (<15 chars)`
            );
          }

          checkedQuizzes++;
        }
      }
    }

    assert.ok(checkedQuizzes > 0, 'Must have at least one quiz item checked');
  });
});
