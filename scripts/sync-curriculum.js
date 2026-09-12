#!/usr/bin/env node
/**
 * scripts/sync-curriculum.js
 *
 * Compiles modular subject files from curriculum_data/*.json and synchronizes
 * master curriculum dataset into:
 *   1. curriculum.json (JSON format, 2-space indented)
 *   2. js/curriculum.js (client-side JS with DEFAULT_CURRICULUM assignment)
 *
 * Supports fallback to existing curriculum.json if modular files are not yet fully authored.
 * Supports --split flag to extract existing curriculum.json subjects into curriculum_data/*.json.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'curriculum_data');
const JSON_PATH = path.join(ROOT_DIR, 'curriculum.json');
const JS_PATH = path.join(ROOT_DIR, 'js/curriculum.js');

const PRESCRIBED_SUBJECT_ORDER = ['cyber', 'os', 'cn', 'ai', 'flat', 'devops'];

const DEFAULT_METADATA = {
  version: '2.0.0',
  institution: 'Assam Science and Technology University (ASTU)',
  semester: '5th Semester B.Tech Computer Science & Engineering'
};

const JS_HEADER = '// KHEL GAYA B.TECH CURRICULUM DATA (ASTU 5TH SEMESTER)\n' +
                  'var DEFAULT_CURRICULUM = window.DEFAULT_CURRICULUM = ';
const JS_FOOTER = ';\n';

function loadJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn(`[sync-curriculum] Warning: Failed to parse JSON at ${filePath}: ${err.message}`);
  }
  return null;
}

function splitCurriculum() {
  console.log('[sync-curriculum] Splitting master curriculum.json into curriculum_data/*.json...');
  const master = loadJsonSafe(JSON_PATH);
  if (!master || !Array.isArray(master.subjects)) {
    console.error('[sync-curriculum] Error: Unable to read valid subjects from curriculum.json to split.');
    return false;
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  for (const subj of master.subjects) {
    if (!subj.id) continue;
    const targetFile = path.join(DATA_DIR, `${subj.id}.json`);
    fs.writeFileSync(targetFile, JSON.stringify(subj, null, 2) + '\n', 'utf8');
    const topicCount = (subj.modules || []).reduce((acc, m) => acc + (m.topics ? m.topics.length : 0), 0);
    const quizCount = (subj.modules || []).reduce((acc, m) => acc + (m.quiz ? m.quiz.length : 0), 0);
    console.log(`  -> Wrote ${subj.id}.json: ${(subj.modules || []).length} modules, ${topicCount} topics, ${quizCount} questions`);
  }
  console.log('[sync-curriculum] Split completed successfully.');
  return true;
}

function syncCurriculum(options = {}) {
  const silent = options.silent || false;
  if (!silent) {
    console.log('====================================================');
    console.log('  Khel Gaya B.Tech: Curriculum Synchronizer');
    console.log('====================================================');
  }

  // 1. Read existing master curriculum for fallback metadata & subjects
  const existingMaster = loadJsonSafe(JSON_PATH) || {};
  const metadata = {
    version: existingMaster.version || DEFAULT_METADATA.version,
    institution: existingMaster.institution || DEFAULT_METADATA.institution,
    semester: existingMaster.semester || DEFAULT_METADATA.semester
  };

  const subjectMap = new Map();

  // Populate fallback subjects from existing curriculum.json
  if (Array.isArray(existingMaster.subjects)) {
    for (const subj of existingMaster.subjects) {
      if (subj && subj.id) {
        subjectMap.set(subj.id, { source: 'curriculum.json', data: subj });
      }
    }
  }

  // 2. Read modular files from curriculum_data/ if present
  let modularCount = 0;
  if (fs.existsSync(DATA_DIR)) {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(DATA_DIR, file);
      const parsed = loadJsonSafe(filePath);
      if (!parsed) continue;

      // File may contain a single subject object or a full curriculum
      if (parsed.id && Array.isArray(parsed.modules)) {
        subjectMap.set(parsed.id, { source: `curriculum_data/${file}`, data: parsed });
        modularCount++;
      } else if (Array.isArray(parsed.subjects)) {
        for (const subj of parsed.subjects) {
          if (subj && subj.id) {
            subjectMap.set(subj.id, { source: `curriculum_data/${file}`, data: subj });
            modularCount++;
          }
        }
      }
    }
  }

  if (subjectMap.size === 0) {
    console.error('[sync-curriculum] Fatal: No subjects found in either curriculum_data/ or curriculum.json!');
    return { success: false, reason: 'No subject data found' };
  }

  // 3. Assemble subjects according to prescribed syllabus order
  const finalSubjects = [];
  const addedIds = new Set();

  for (const subjId of PRESCRIBED_SUBJECT_ORDER) {
    if (subjectMap.has(subjId)) {
      finalSubjects.push(subjectMap.get(subjId).data);
      addedIds.add(subjId);
    }
  }

  // Append any extra subjects not in predefined order
  for (const [subjId, entry] of subjectMap.entries()) {
    if (!addedIds.has(subjId)) {
      finalSubjects.push(entry.data);
      addedIds.add(subjId);
    }
  }

  const compiledCurriculum = {
    version: metadata.version,
    institution: metadata.institution,
    semester: metadata.semester,
    subjects: finalSubjects
  };

  // 4. Metrics calculation
  let totalModules = 0;
  let totalTopics = 0;
  let totalQuiz = 0;

  for (const subj of finalSubjects) {
    const modules = subj.modules || [];
    totalModules += modules.length;
    for (const mod of modules) {
      totalTopics += (mod.topics || []).length;
      totalQuiz += (mod.quiz || []).length;
    }
  }

  // 5. Write to curriculum.json
  const jsonContent = JSON.stringify(compiledCurriculum, null, 2) + '\n';
  fs.writeFileSync(JSON_PATH, jsonContent, 'utf8');

  // 6. Write to js/curriculum.js
  const jsContent = JS_HEADER + JSON.stringify(compiledCurriculum, null, 2) + JS_FOOTER;
  fs.writeFileSync(JS_PATH, jsContent, 'utf8');

  if (!silent) {
    console.log(`[sync-curriculum] Integrated ${finalSubjects.length} subjects (${modularCount} from modular files).`);
    for (const subj of finalSubjects) {
      const src = subjectMap.get(subj.id)?.source || 'unknown';
      const mCount = (subj.modules || []).length;
      const tCount = (subj.modules || []).reduce((acc, m) => acc + (m.topics ? m.topics.length : 0), 0);
      const qCount = (subj.modules || []).reduce((acc, m) => acc + (m.quiz ? m.quiz.length : 0), 0);
      console.log(`  - [${subj.id.toUpperCase()}] ${subj.title} (${subj.code}): ${mCount} mods, ${tCount} topics, ${qCount} quiz [Source: ${src}]`);
    }
    console.log('----------------------------------------------------');
    console.log(`Totals: ${finalSubjects.length} Subjects | ${totalModules} Modules | ${totalTopics} Topics | ${totalQuiz} Quizzes`);
    console.log(`[sync-curriculum] Successfully written to:`);
    console.log(`  - ${path.relative(ROOT_DIR, JSON_PATH)}`);
    console.log(`  - ${path.relative(ROOT_DIR, JS_PATH)}`);
    console.log('====================================================\n');
  }

  return {
    success: true,
    subjectsCount: finalSubjects.length,
    modulesCount: totalModules,
    topicsCount: totalTopics,
    quizCount: totalQuiz
  };
}

if (require.main === module) {
  if (process.argv.includes('--split')) {
    const ok = splitCurriculum();
    process.exit(ok ? 0 : 1);
  } else {
    const result = syncCurriculum();
    process.exit(result.success ? 0 : 1);
  }
}

module.exports = {
  syncCurriculum,
  splitCurriculum,
  JSON_PATH,
  JS_PATH,
  DATA_DIR,
  PRESCRIBED_SUBJECT_ORDER
};
