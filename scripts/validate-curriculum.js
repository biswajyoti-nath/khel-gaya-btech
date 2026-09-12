#!/usr/bin/env node
/**
 * scripts/validate-curriculum.js
 *
 * Comprehensive Curriculum Validator for Khel Gaya B.Tech (ASTU 5th Sem CSE)
 *
 * Validates:
 * 1. Dual serialization & sync integrity (curriculum.json <=> js/curriculum.js)
 * 2. ASTU prescribed subjects (all 6) and exact official course codes
 * 3. Module completeness (5 modules per subject = 30 modules)
 * 4. Scale & depth requirements (>= 10 topics and >= 10 questions per module, totals >= 300)
 * 5. 11-field Topic Schema (id, cat, title, sub, plain, def, exam, trap, example, q, a)
 * 6. 6-field Quiz Schema (q, opts, ans, cat, correctFb, distractors)
 *    - Exactly 4 distinct options
 *    - Valid 0-3 answer index
 *    - Non-empty correct feedback (>= 20 chars)
 *    - Exactly 3 distractor refutations (>= 15 chars each)
 * 7. Boss Fight multi-mark challenges and 4-criterion grading rubrics
 *
 * Output: Detailed tabular summary and exact violation report.
 * Exit code: 0 if valid, 1 if any validation error exists.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT_DIR, 'curriculum.json');
const JS_PATH = path.join(ROOT_DIR, 'js/curriculum.js');

const EXPECTED_SYLLABUS = {
  ai: {
    code: 'CS241501',
    title: 'Artificial Intelligence',
    minModules: 5,
    expectedModules: [
      'Introduction to Artificial Intelligence and Intelligent Agents',
      'Search Techniques',
      'Knowledge Representation and Reasoning',
      'Reasoning Under Uncertainty',
      'Machine Learning in AI'
    ]
  },
  os: {
    code: 'CS241502',
    title: 'Operating Systems',
    minModules: 5,
    expectedModules: [
      'Introduction to Operating Systems and System Structure',
      'Process Management and CPU Scheduling',
      'Process Synchronization and Deadlocks',
      'Memory Management',
      'File Systems and I/O Management'
    ]
  },
  cn: {
    code: 'CS241503',
    title: 'Computer Networks',
    minModules: 5,
    expectedModules: [
      'Introduction to Computer Networks and Physical Layer',
      'Data Link Layer',
      'Network Layer',
      'Transport Layer',
      'Application Layer and Network Security'
    ]
  },
  flat: {
    code: 'CS241504',
    title: 'Formal Language and Automata Theory',
    minModules: 5,
    expectedModules: [
      'Finite Automata and Regular Languages',
      'Regular Expressions and Properties of Regular Languages',
      'Context-Free Grammars and Pushdown Automata',
      'Turing Machines and Computability',
      'Decidability and Computational Complexity'
    ]
  },
  cyber: {
    code: 'CS241505',
    title: 'Cyber Security',
    minModules: 5,
    expectedModules: [
      'Fundamentals of Information Security',
      'Cryptography and Network Security',
      'Network Security',
      'Web and System Security',
      'Cyber Laws and Emerging Trends'
    ]
  },
  devops: {
    code: 'CS241513',
    title: 'Software DevOps and Automation Lab',
    minModules: 5,
    expectedModules: [
      'Version Control Systems',
      'Continuous Integration (CI)',
      'Containerization Fundamentals',
      'Multi-Service Orchestration',
      'Continuous Deployment & Monitoring'
    ]
  }
};

const REQUIRED_TOPIC_FIELDS = [
  'id', 'cat', 'title', 'sub', 'plain', 'def', 'exam', 'trap', 'example', 'q', 'a'
];

const REQUIRED_QUIZ_FIELDS = [
  'q', 'opts', 'ans', 'cat', 'correctFb', 'distractors'
];

function validateCurriculum(options = {}) {
  const targetJsonPath = options.jsonPath || JSON_PATH;
  const targetJsPath = options.jsPath || JS_PATH;
  const checkSync = options.checkSync !== false;

  const errors = [];
  const warnings = [];

  let totalModules = 0;
  let totalTopics = 0;
  let totalQuiz = 0;
  let totalBossChallenges = 0;

  console.log('\n========================================================================');
  console.log('  KHEL GAYA B.TECH: CURRICULUM INTEGRITY & SYLLABUS VALIDATOR (R1-R3)');
  console.log('========================================================================\n');

  // 1. File Existence
  if (!fs.existsSync(targetJsonPath)) {
    errors.push(`curriculum.json not found at ${targetJsonPath}`);
    return { passed: false, errors, warnings, totalModules, totalTopics, totalQuiz };
  }

  // 2. Parse JSON
  let data;
  try {
    const raw = fs.readFileSync(targetJsonPath, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    errors.push(`curriculum.json parse failure: ${err.message}`);
    return { passed: false, errors, warnings, totalModules, totalTopics, totalQuiz };
  }

  // 3. Serialization Sync Check
  if (checkSync) {
    if (!fs.existsSync(targetJsPath)) {
      errors.push(`js/curriculum.js not found at ${targetJsPath}`);
    } else {
      try {
        const jsRaw = fs.readFileSync(targetJsPath, 'utf8');
        const match = jsRaw.match(/DEFAULT_CURRICULUM\s*=\s*(\{[\s\S]*\});?\s*$/m);
        if (!match) {
          errors.push('js/curriculum.js missing DEFAULT_CURRICULUM assignment');
        } else {
          const jsData = JSON.parse(match[1]);
          if (JSON.stringify(data) !== JSON.stringify(jsData)) {
            errors.push('OUT OF SYNC: curriculum.json and js/curriculum.js content mismatch');
          }
        }
      } catch (err) {
        errors.push(`js/curriculum.js parse / sync verification failure: ${err.message}`);
      }
    }
  }

  // 4. Root Schema Checks
  if (!data.version || typeof data.version !== 'string') {
    errors.push('Root curriculum missing version string');
  }
  if (!data.institution || typeof data.institution !== 'string' || !/ASTU|Assam Science and Technology/i.test(data.institution)) {
    errors.push('Root curriculum institution must reference ASTU');
  }
  if (!data.semester || typeof data.semester !== 'string' || !/5th/i.test(data.semester)) {
    errors.push('Root curriculum semester must reference 5th Semester');
  }
  if (!Array.isArray(data.subjects)) {
    errors.push('Root curriculum missing "subjects" array');
    return { passed: false, errors, warnings, totalModules, totalTopics, totalQuiz };
  }

  const subjectMap = new Map();
  const summaryRows = [];
  const knownTopicIds = new Set();

  for (const subj of data.subjects) {
    subjectMap.set(subj.id, subj);
  }

  // 5. Subject & Module Validation
  for (const [subjId, spec] of Object.entries(EXPECTED_SYLLABUS)) {
    const subj = subjectMap.get(subjId);
    if (!subj) {
      errors.push(`Missing prescribed subject '${subjId}' (${spec.title}, code: ${spec.code})`);
      summaryRows.push({
        Subject: spec.title,
        Code: spec.code,
        Modules: `0 / ${spec.minModules}`,
        Topics: `0 / ${spec.minModules * 10}`,
        Quizzes: `0 / ${spec.minModules * 10}`,
        Boss: '0',
        Status: 'FAIL (MISSING)'
      });
      continue;
    }

    // Check code
    if (subj.code !== spec.code) {
      errors.push(`Subject '${subjId}' code '${subj.code}' does not match official '${spec.code}'`);
    }

    // Check icon
    if (!subj.icon || typeof subj.icon !== 'string') {
      warnings.push(`Subject '${subjId}' missing icon property`);
    }

    const mods = subj.modules || [];
    totalModules += mods.length;

    let subjTopics = 0;
    let subjQuiz = 0;
    let subjBoss = 0;
    let subjHasErrors = false;

    if (mods.length < spec.minModules) {
      errors.push(`Subject '${subjId}' has ${mods.length} modules; required >= ${spec.minModules}`);
      subjHasErrors = true;
    }

    mods.forEach((mod, modIdx) => {
      const modNum = mod.num || (modIdx + 1);
      const modTag = `[${subjId}/m${modNum}]`;

      if (mod.num !== modIdx + 1) {
        errors.push(`${modTag} Module num property (${mod.num}) does not match 1-based index (${modIdx + 1})`);
        subjHasErrors = true;
      }

      if (!mod.title || typeof mod.title !== 'string' || mod.title.trim().length < 4) {
        errors.push(`${modTag} Module title missing or too short`);
        subjHasErrors = true;
      }

      const topics = mod.topics || [];
      const quiz = mod.quiz || [];
      const bossChallenges = mod.bossChallenges || [];

      subjTopics += topics.length;
      subjQuiz += quiz.length;
      subjBoss += bossChallenges.length;
      totalTopics += topics.length;
      totalQuiz += quiz.length;
      totalBossChallenges += bossChallenges.length;

      // Module Topic Count Check
      if (topics.length < 10) {
        errors.push(`${modTag} Topic count (${topics.length}) < 10`);
        subjHasErrors = true;
      }

      // Topic Schema Validation (11 fields)
      topics.forEach((t, tIdx) => {
        const tTag = `${modTag} Topic #${tIdx + 1} (${t.id || 'unnamed'})`;

        if (!t.id || typeof t.id !== 'string') {
          errors.push(`${tTag} Missing id`);
          subjHasErrors = true;
        } else {
          if (knownTopicIds.has(t.id)) {
            errors.push(`${tTag} Duplicate topic id '${t.id}'`);
            subjHasErrors = true;
          }
          knownTopicIds.add(t.id);
        }

        for (const field of REQUIRED_TOPIC_FIELDS) {
          const val = t[field];
          if (typeof val !== 'string' || val.trim().length === 0) {
            errors.push(`${tTag} Missing or empty required field '${field}'`);
            subjHasErrors = true;
          }
        }

        // Length & Pedagogical thresholds
        if (t.plain && t.plain.length < 20) {
          errors.push(`${tTag} 'plain' explanation too short (<20 chars)`);
          subjHasErrors = true;
        }
        if (t.def && t.def.length < 30) {
          errors.push(`${tTag} 'def' formal definition too short (<30 chars)`);
          subjHasErrors = true;
        }
        if (t.exam && t.exam.length < 15) {
          errors.push(`${tTag} 'exam' punchline too short (<15 chars)`);
          subjHasErrors = true;
        }
        if (t.trap && t.trap.length < 15) {
          errors.push(`${tTag} 'trap' common pitfall too short (<15 chars)`);
          subjHasErrors = true;
        }
        if (t.example && t.example.length < 20) {
          errors.push(`${tTag} 'example' demonstration too short (<20 chars)`);
          subjHasErrors = true;
        }
        if (t.q && t.q.trim().length < 10) {
          errors.push(`${tTag} 'q' active retrieval prompt too short (<10 chars)`);
          subjHasErrors = true;
        }
        if (t.a && t.a.trim().length < 10) {
          errors.push(`${tTag} 'a' model answer too short (<10 chars)`);
          subjHasErrors = true;
        }
      });

      // Module Quiz Count Check
      if (quiz.length < 10) {
        errors.push(`${modTag} Quiz questions count (${quiz.length}) < 10`);
        subjHasErrors = true;
      }

      // Quiz Schema Validation (6 fields)
      quiz.forEach((q, qIdx) => {
        const qTag = `${modTag} Quiz #${qIdx + 1}`;

        for (const field of REQUIRED_QUIZ_FIELDS) {
          if (q[field] === undefined) {
            errors.push(`${qTag} Missing required field '${field}'`);
            subjHasErrors = true;
          }
        }

        if (typeof q.q !== 'string' || q.q.trim().length < 15) {
          errors.push(`${qTag} 'q' prompt missing or too short (<15 chars)`);
          subjHasErrors = true;
        }

        if (!Array.isArray(q.opts) || q.opts.length !== 4) {
          errors.push(`${qTag} 'opts' must contain exactly 4 options`);
          subjHasErrors = true;
        } else {
          // Check non-empty options
          q.opts.forEach((opt, optIdx) => {
            if (typeof opt !== 'string' || opt.trim().length === 0) {
              errors.push(`${qTag} Option [${optIdx}] empty`);
              subjHasErrors = true;
            }
          });

          // Check distinct options
          const distinct = new Set(q.opts.map(o => String(o).trim().toLowerCase()));
          if (distinct.size !== 4) {
            errors.push(`${qTag} 'opts' contains duplicate choices: ${JSON.stringify(q.opts)}`);
            subjHasErrors = true;
          }
        }

        if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans > 3) {
          errors.push(`${qTag} 'ans' must be an integer 0..3, got: ${q.ans}`);
          subjHasErrors = true;
        }

        if (typeof q.cat !== 'string' || q.cat.trim().length === 0) {
          errors.push(`${qTag} 'cat' category tag missing or empty`);
          subjHasErrors = true;
        }

        if (typeof q.correctFb !== 'string' || q.correctFb.trim().length < 20) {
          errors.push(`${qTag} 'correctFb' explanation too short (<20 chars)`);
          subjHasErrors = true;
        }

        if (!Array.isArray(q.distractors) || q.distractors.length !== 3) {
          errors.push(`${qTag} 'distractors' must be an array of exactly 3 strings`);
          subjHasErrors = true;
        } else {
          q.distractors.forEach((d, dIdx) => {
            if (typeof d !== 'string' || d.trim().length < 15) {
              errors.push(`${qTag} Distractor #${dIdx + 1} too short (<15 chars)`);
              subjHasErrors = true;
            }
          });
        }
      });

      // Boss Fight Rubrics Validation (if present on module)
      if (mod.bossChallenges) {
        if (!Array.isArray(mod.bossChallenges)) {
          errors.push(`${modTag} 'bossChallenges' must be an array`);
          subjHasErrors = true;
        } else {
          mod.bossChallenges.forEach((bc, bIdx) => {
            const bTag = `${modTag} Boss #${bIdx + 1}`;
            if (!bc.scenario || typeof bc.scenario !== 'string' || bc.scenario.trim().length < 30) {
              errors.push(`${bTag} scenario prompt missing or < 30 chars`);
              subjHasErrors = true;
            }
            if (!bc.marks || ![5, 10].includes(bc.marks)) {
              errors.push(`${bTag} marks must be explicitly 5 or 10, got: ${bc.marks}`);
              subjHasErrors = true;
            }
            if (!Array.isArray(bc.rubric) || bc.rubric.length !== 4) {
              errors.push(`${bTag} rubric must contain exactly 4 criteria strings`);
              subjHasErrors = true;
            } else {
              bc.rubric.forEach((crit, cIdx) => {
                if (typeof crit !== 'string' || crit.trim().length < 10) {
                  errors.push(`${bTag} Rubric criterion #${cIdx + 1} missing or too short`);
                  subjHasErrors = true;
                }
              });
            }
          });
        }
      }
    });

    const isPass = !subjHasErrors &&
                   mods.length >= spec.minModules &&
                   subjTopics >= (spec.minModules * 10) &&
                   subjQuiz >= (spec.minModules * 10);

    summaryRows.push({
      Subject: subj.title,
      Code: subj.code,
      Modules: `${mods.length} / ${spec.minModules}`,
      Topics: `${subjTopics} / ${spec.minModules * 10}`,
      Quizzes: `${subjQuiz} / ${spec.minModules * 10}`,
      Boss: `${subjBoss}`,
      Status: isPass ? 'PASS' : 'FAIL'
    });
  }

  // 6. Check for unauthorized extra subjects
  for (const subj of data.subjects) {
    if (!EXPECTED_SYLLABUS[subj.id]) {
      warnings.push(`Encountered non-standard subject id '${subj.id}'`);
    }
  }

  // 7. Render Tabular Report
  console.table(summaryRows);
  console.log(`TOTALS: Modules: ${totalModules}/30 | Topics: ${totalTopics}/300 | Quizzes: ${totalQuiz}/300 | Boss Challenges: ${totalBossChallenges}`);
  console.log('------------------------------------------------------------------------\n');

  if (warnings.length > 0) {
    console.log(`⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(w => console.log(`  - ${w}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.log(`❌ VALIDATION FAILED WITH ${errors.length} ISSUE(S):\n`);
    const displayLimit = 40;
    errors.slice(0, displayLimit).forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${err}`);
    });
    if (errors.length > displayLimit) {
      console.log(`  ... and ${errors.length - displayLimit} additional errors.`);
    }
    console.log('\nResult: FAILED (Exit Code 1)\n');
    return { passed: false, errors, warnings, totalModules, totalTopics, totalQuiz };
  }

  console.log('✅ ALL VALIDATION CHECKS PASSED (Exit Code 0)\n');
  return { passed: true, errors, warnings, totalModules, totalTopics, totalQuiz };
}

if (require.main === module) {
  const result = validateCurriculum();
  process.exit(result.passed ? 0 : 1);
}

module.exports = {
  validateCurriculum,
  EXPECTED_SYLLABUS,
  REQUIRED_TOPIC_FIELDS,
  REQUIRED_QUIZ_FIELDS,
  JSON_PATH,
  JS_PATH
};
