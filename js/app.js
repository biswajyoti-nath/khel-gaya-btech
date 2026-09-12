// CYBER//BRAINROT MAIN APPLICATION CONTROLLER
// Multi-Subject Study & Gamification System for ASTU B.Tech CSE 5th Semester

(function() {
  'use strict';

  // --- STORAGE & APP STATE ---
  function initStorage() {
    try {
      const raw = localStorage.getItem('cbr_meta');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          xp: Number(parsed.xp) || 0,
          streak: Number(parsed.streak) || 0,
          masteryBySubj: parsed.masteryBySubj || {},
          activeSubject: parsed.activeSubject || 'cyber',
          activeModule: parsed.activeModule || 'all'
        };
      }
    } catch (e) {
      console.warn('Storage parse error:', e);
    }
    return {
      xp: 0,
      streak: 0,
      masteryBySubj: {},
      activeSubject: 'cyber',
      activeModule: 'all'
    };
  }

  let S = initStorage();
  let curriculum = window.gamifyEngine.getCurriculum();

  function saveMeta() {
    try {
      localStorage.setItem('cbr_meta', JSON.stringify(S));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  const $ = id => document.getElementById(id);

  // --- ACTIVE DATA RESOLVERS ---
  function getActiveSubject() {
    if (!curriculum || !Array.isArray(curriculum.subjects) || curriculum.subjects.length === 0) {
      curriculum = (window.gamifyEngine && window.gamifyEngine.getCurriculum()) || 
                   (typeof window !== 'undefined' && window.DEFAULT_CURRICULUM) || 
                   { subjects: [{ id: 'cyber', title: 'Cyber Security', modules: [] }] };
    }
    let subj = (curriculum.subjects || []).find(s => s.id === S.activeSubject);
    return subj || curriculum.subjects[0] || { id: 'cyber', title: 'Cyber Security', modules: [] };
  }

  function getActiveModules() {
    const subj = getActiveSubject();
    if (S.activeModule === 'all') {
      return subj.modules || [];
    }
    return (subj.modules || []).filter(m => m.id === S.activeModule);
  }

  function getActiveTopics() {
    const mods = getActiveModules();
    const topics = [];
    mods.forEach(m => {
      (m.topics || []).forEach(t => {
        topics.push({ ...t, _modNum: m.num, _modTitle: m.title });
      });
    });
    return topics;
  }

  function getActiveQuizQuestions() {
    const mods = getActiveModules();
    const list = [];
    mods.forEach(m => {
      (m.quiz || []).forEach(q => {
        list.push({ ...q, _modNum: m.num });
      });
    });
    return list;
  }

  // Active View Models
  let deck = [];
  let di = 0;
  let ri = false;

  let quizPool = [];
  let qi = 0;
  let quizScore = 0;
  let quizAnswered = false;

  let bi = 0;
  let bossRevealed = false;
  let bossGraded = false;
  let currentBossRubric = [];

  let activeFilter = 'ALL';
  let generatedStudioPack = null;

  // --- HIERARCHY SELECTORS ---
  function updateHierarchySelectors() {
    const selSubj = $('sel-subject');
    if (selSubj) {
      selSubj.innerHTML = curriculum.subjects.map(s => 
        `<option value="${s.id}" ${s.id === S.activeSubject ? 'selected' : ''}>${s.icon || '📚'} ${s.title} (${s.code || ''})</option>`
      ).join('');
    }

    const subj = getActiveSubject();
    const selMod = $('sel-module');
    if (selMod) {
      let modOpts = `<option value="all" ${S.activeModule === 'all' ? 'selected' : ''}>All Modules (${(subj.modules || []).length})</option>`;
      modOpts += (subj.modules || []).map(m => 
        `<option value="${m.id}" ${m.id === S.activeModule ? 'selected' : ''}>Module ${m.num}: ${m.title}</option>`
      ).join('');
      selMod.innerHTML = modOpts;
    }

    const topTitle = $('top-subj-title');
    if (topTitle) topTitle.textContent = `${subj.title.toUpperCase()} ${subj.code ? '(' + subj.code + ')' : ''}`;

    const topics = getActiveTopics();
    const countBadge = $('curr-topic-count');
    if (countBadge) countBadge.textContent = `${topics.length} TOPICS`;

    const modBadge = $('curr-module-badge');
    if (modBadge) modBadge.textContent = S.activeModule === 'all' ? 'ALL MODULES' : `MODULE ${S.activeModule.replace('m','')}`;

    // Update Topic Studio Selectors
    const engSubj = $('eng-subject');
    if (engSubj) {
      engSubj.innerHTML = curriculum.subjects.map(s => `<option value="${s.id}">${s.title}</option>`).join('');
      engSubj.value = S.activeSubject;
    }
    updateStudioModules();
  }

  function updateStudioModules() {
    const engSubj = $('eng-subject');
    const engMod = $('eng-module');
    if (!engSubj || !engMod) return;
    const subj = curriculum.subjects.find(s => s.id === engSubj.value) || curriculum.subjects[0];
    engMod.innerHTML = (subj.modules || []).map(m => `<option value="${m.id}">Module ${m.num}: ${m.title}</option>`).join('');
  }

  window.onSubjectChange = function(subjId) {
    if (window.cyberSound) window.cyberSound.click();
    S.activeSubject = subjId;
    S.activeModule = 'all';
    saveMeta();
    syncActiveState();
  };

  window.onModuleChange = function(modId) {
    if (window.cyberSound) window.cyberSound.click();
    S.activeModule = modId;
    saveMeta();
    syncActiveState();
  };

  function syncActiveState() {
    curriculum = window.gamifyEngine.getCurriculum();
    updateHierarchySelectors();

    deck = getActiveTopics();
    di = 0;
    ri = false;

    quizPool = getActiveQuizQuestions();
    qi = 0;
    quizScore = 0;
    quizAnswered = false;

    bi = 0;
    bossRevealed = false;
    bossGraded = false;

    ui();
    card();
    refs();
  }

  // --- STATS & SCORE UI ---
  function ui() {
    const subj = getActiveSubject();
    const allTopicsInSubj = [];
    (subj.modules || []).forEach(m => (m.topics || []).forEach(t => allTopicsInSubj.push(t.id)));

    const masteredInSubj = S.masteryBySubj[subj.id] || [];
    const pct = allTopicsInSubj.length > 0 ? Math.min(100, Math.round((masteredInSubj.length / allTopicsInSubj.length) * 100)) : 0;

    $('xp').textContent = S.xp;
    $('streak').textContent = S.streak;
    $('mastery').textContent = pct + '%';

    const mobXp = $('mob-xp');
    if (mobXp) mobXp.textContent = S.xp;
    const mobStreak = $('mob-streak');
    if (mobStreak) mobStreak.textContent = S.streak;
    const mobMastery = $('mob-mastery');
    if (mobMastery) mobMastery.textContent = pct + '%';

    $('pct').textContent = pct + '%';
    $('bar').style.width = pct + '%';
    $('mastered-count').textContent = `${masteredInSubj.length} of ${allTopicsInSubj.length} topics mastered`;

    const eyebrow = $('home-eyebrow');
    if (eyebrow) eyebrow.textContent = `${subj.code || 'ASTU 5TH SEM'} // MODULE EXPLORER`;
    const homeTitle = $('home-title');
    if (homeTitle) homeTitle.textContent = `${subj.icon || ''} ${subj.title.toUpperCase()}`;
    const homeDesc = $('home-desc');
    if (homeDesc) homeDesc.textContent = `Assam Science and Technology University (ASTU) CSE 5th Semester. Active Module: ${S.activeModule === 'all' ? 'All Modules' : 'Module ' + S.activeModule.replace('m','')}.`;

    const deckInfo = $('deck-subj-info');
    if (deckInfo) deckInfo.textContent = `Subject: ${subj.title} (${subj.code || ''}). Module: ${S.activeModule === 'all' ? 'All Modules' : S.activeModule.toUpperCase()}.`;

    renderTopicsGrid();
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('on');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('on'), 1600);
  }
  window.toast = toast;

  window.resetProgress = function() {
    if (confirm('Reset your total XP, streak, and subject mastery back to 0?')) {
      S.xp = 0;
      S.streak = 0;
      S.masteryBySubj = {};
      saveMeta();
      ui();
      toast('PROGRESS RESET TO 0');
    }
  };

  // Sound Toggle
  window.toggleSound = function() {
    const isMuted = window.cyberSound.toggleMute();
    const btn = $('btn-sound');
    if (btn) {
      btn.textContent = isMuted ? '🔇 MUTED' : '🔊 SOUND';
      btn.classList.toggle('muted', isMuted);
    }
    toast(isMuted ? 'AUDIO MUTED' : 'AUDIO ACTIVE');
  };

  // --- NAVIGATION ---
  window.go = function(id) {
    if (window.cyberSound) window.cyberSound.click();
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = $(id);
    if (target) target.classList.add('active');

    document.querySelectorAll('nav button').forEach(b => b.classList.toggle('active', b.dataset.v === id));

    const hints = $('top-hints');
    if (hints) {
      if (id === 'learn') {
        hints.innerHTML = `<span>DECK:</span> <kbd>R / Space</kbd> reveal • <kbd>N</kbd> next • <kbd>P</kbd> prev • <kbd>1</kbd> missed • <kbd>2</kbd> got it`;
        card();
      } else if (id === 'quiz') {
        hints.innerHTML = `<span>QUIZ:</span> <kbd>1-4</kbd> option • <kbd>N / Enter</kbd> next`;
        if ($('quiz-result').style.display !== 'none') restartQuiz();
        else quiz();
      } else if (id === 'boss') {
        hints.innerHTML = `<span>BOSS:</span> <kbd>Ctrl+Enter</kbd> reveal rubric • <kbd>N</kbd> new threat`;
        boss();
      } else if (id === 'refs') {
        hints.innerHTML = `<span>CHEAT SHEET:</span> Instant search & study notes`;
        refs();
      } else if (id === 'engine') {
        hints.innerHTML = `<span>ENGINE:</span> Add raw topics & gamify syllabus`;
        updateStudioModules();
      } else {
        hints.innerHTML = `<span>SHORTCUTS:</span> <kbd>R</kbd> reveal • <kbd>N</kbd> next • <kbd>P</kbd> prev`;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  document.querySelectorAll('nav button').forEach(b => b.onclick = () => window.go(b.dataset.v));

  // --- HOME TOPICS GRID ---
  function renderTopicsGrid() {
    const el = $('topics');
    if (!el) return;

    const topics = getActiveTopics();
    const subj = getActiveSubject();
    const masteredList = S.masteryBySubj[subj.id] || [];

    if (topics.length === 0) {
      el.innerHTML = `
        <div class="card" style="grid-column:1/-1;text-align:center;padding:36px">
          <h3>NO TOPICS IN THIS MODULE</h3>
          <p>This module does not have gamified topics yet. Use the <b>Topic Studio (Engine)</b> to add syllabus topics!</p>
          <button class="primary" style="margin-top:12px" onclick="go('engine')">⚡ OPEN TOPIC STUDIO →</button>
        </div>
      `;
      return;
    }

    el.innerHTML = topics.map((t, i) => {
      const isMastered = masteredList.includes(t.id);
      return `
        <div class="card topic">
          <div>
            <div class="meta">
              <span class="num">M0${t._modNum} // 0${i + 1 < 10 ? '0' + (i + 1) : (i + 1)}</span>
              <span class="badge ${isMastered ? 'mastered' : ''}">${isMastered ? '✓ MASTERED' : t.cat.toUpperCase()}</span>
            </div>
            <h3>${t.title}</h3>
            <p style="color:var(--text);font-weight:700;margin-bottom:4px">${t.sub}</p>
            <p class="small">${t.plain}</p>
          </div>
          <div class="actions" style="margin-top:12px">
            <button class="primary" onclick="trainSingleTopic('${t.id}')">TRAIN CONCEPT →</button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.trainSingleTopic = function(id) {
    if (window.cyberSound) window.cyberSound.click();
    const idx = deck.findIndex(x => x.id === id);
    if (idx !== -1) {
      di = idx;
      ri = false;
      window.go('learn');
    }
  };

  // --- RETRIEVAL DECK (LEARN) ---
  function card() {
    if (deck.length === 0) deck = getActiveTopics();
    if (deck.length === 0) {
      $('tag').textContent = 'EMPTY DECK';
      $('card-counter').textContent = 'CARD 0 / 0';
      $('q').textContent = 'No topics found for this selection. Add topics via Topic Studio or switch module.';
      $('a').innerHTML = '';
      return;
    }

    if (di < 0) di = 0;
    if (di >= deck.length) di = 0;

    const item = deck[di];
    const subj = getActiveSubject();
    const isMastered = (S.masteryBySubj[subj.id] || []).includes(item.id);

    $('tag').textContent = `${subj.title.toUpperCase()} • MOD ${item._modNum} • ${item.cat.toUpperCase()} ${isMastered ? '★ MASTERED' : ''}`;
    $('card-counter').textContent = `CARD ${di + 1} / ${deck.length}`;
    $('q').textContent = item.q;

    const ansHtml = `
      <div class="sec">
        <div class="sec-title model">✓ OFFICIAL MODEL ANSWER:</div>
        ${item.a}
      </div>
      <div class="sec">
        <div class="sec-title">💡 INTUITIVE BREAKDOWN:</div>
        ${item.plain}
      </div>
      <div class="sec">
        <div class="sec-title exam">⚡ EXAM PUNCHLINE & MNEMONIC:</div>
        ${item.exam}
      </div>
      <div class="sec">
        <div class="sec-title trap">⚠️ EXAM PITFALL / TRAP:</div>
        ${item.trap}
      </div>
      <div class="sec">
        <div class="sec-title">🚨 REAL-WORLD INCIDENT / DEMONSTRATION:</div>
        ${item.example}
      </div>
    `;
    $('a').innerHTML = ansHtml;
    $('a').classList.toggle('show', ri);

    $('btn-reveal').textContent = ri ? 'REVEALED [R]' : 'REVEAL [R / Space]';
  }

  window.reveal = function() {
    if (!ri) {
      if (window.cyberSound) window.cyberSound.flip();
      ri = true;
      card();
      toast('RETRIEVED. NOW EXPLAIN IT OUT LOUD.');
    }
  };

  window.rate = function(points) {
    if (deck.length === 0) return;
    const item = deck[di];
    const subj = getActiveSubject();
    if (!S.masteryBySubj[subj.id]) S.masteryBySubj[subj.id] = [];

    if (!ri) window.reveal();

    if (points === 2) {
      if (window.cyberSound) window.cyberSound.correct();
      S.xp += 2;
      S.streak++;
      if (S.streak % 5 === 0 && window.cyberSound) window.cyberSound.streak();
      if (!S.masteryBySubj[subj.id].includes(item.id)) {
        S.masteryBySubj[subj.id].push(item.id);
      }
      toast(`+2 XP • STREAK ${S.streak}`);
    } else {
      if (window.cyberSound) window.cyberSound.wrong();
      S.xp += 1;
      S.streak = 0;
      S.masteryBySubj[subj.id] = S.masteryBySubj[subj.id].filter(id => id !== item.id);
      toast('+1 XP • STREAK RESET');
    }

    saveMeta();
    ui();
    window.next();
  };

  window.next = function() {
    if (deck.length === 0) return;
    if (window.cyberSound) window.cyberSound.click();
    di = (di + 1) % deck.length;
    ri = false;
    card();
  };

  window.prevCard = function() {
    if (deck.length === 0) return;
    if (window.cyberSound) window.cyberSound.click();
    di = (di - 1 + deck.length) % deck.length;
    ri = false;
    card();
  };

  window.shuffle = function() {
    if (deck.length <= 1) return;
    if (window.cyberSound) window.cyberSound.click();
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    di = 0;
    ri = false;
    card();
    toast('DECK SHUFFLED');
  };

  // --- ACTIVE RECALL QUIZ ---
  function quiz() {
    if (quizPool.length === 0) quizPool = getActiveQuizQuestions();

    const cardEl = $('quiz-card');
    const resEl = $('quiz-result');

    if (quizPool.length === 0) {
      cardEl.style.display = 'block';
      resEl.style.display = 'none';
      $('qn').textContent = 'NO MCQS';
      $('quiz-cat').textContent = 'EMPTY';
      $('qq').textContent = 'No quiz questions available for this module yet. Add them in Topic Studio!';
      $('opts').innerHTML = '';
      $('fb').innerHTML = '';
      $('quiz-next-btn').disabled = true;
      return;
    }

    cardEl.style.display = 'block';
    resEl.style.display = 'none';

    const qItem = quizPool[qi];
    quizAnswered = false;

    $('qn').textContent = `QUESTION ${qi + 1} / ${quizPool.length}`;
    $('quiz-cat').textContent = qItem.cat ? qItem.cat.toUpperCase() : 'CONCEPT';
    $('qq').textContent = qItem.q;

    $('opts').innerHTML = qItem.opts.map((opt, i) => `
      <button class="opt" id="opt-${i}" onclick="answerQuiz(${i})">
        <b>${String.fromCharCode(65 + i)}.</b> ${opt}
      </button>
    `).join('');

    const fb = $('fb');
    fb.className = 'feedback';
    fb.innerHTML = '';

    $('quiz-next-btn').disabled = true;
    $('qs').textContent = `Score: ${quizScore} / ${qi}`;
  }

  window.answerQuiz = function(selectedIdx) {
    if (quizAnswered || quizPool.length === 0) return;
    quizAnswered = true;

    const qItem = quizPool[qi];
    const isCorrect = (selectedIdx === qItem.ans);
    const optButtons = document.querySelectorAll('.opt');

    optButtons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === qItem.ans) {
        btn.classList.add('correct');
      } else if (i === selectedIdx) {
        btn.classList.add('wrong');
      } else {
        btn.classList.add('faded');
      }
    });

    const fb = $('fb');
    fb.classList.add('show');

    const distractorsHtml = (qItem.distractors || []).map(d => `<div>• ${d}</div>`).join('');

    if (isCorrect) {
      if (window.cyberSound) window.cyberSound.correct();
      quizScore++;
      S.xp += 3;
      S.streak++;
      if (S.streak % 5 === 0 && window.cyberSound) window.cyberSound.streak();
      fb.classList.remove('is-wrong');
      fb.innerHTML = `
        <div class="feedback-head">✓ CORRECT! EXPLANATION:</div>
        <div>${qItem.correctFb || 'Accurate recall.'}</div>
        ${distractorsHtml ? `<div class="feedback-distractors"><b>Distractor Analysis:</b>${distractorsHtml}</div>` : ''}
      `;
      toast('+3 XP • CORRECT');
    } else {
      if (window.cyberSound) window.cyberSound.wrong();
      S.xp += 1;
      S.streak = 0;
      fb.classList.add('is-wrong');
      fb.innerHTML = `
        <div class="feedback-head">✗ EXAM REPAIR:</div>
        <div>${qItem.correctFb || 'Review this concept.'}</div>
        ${distractorsHtml ? `<div class="feedback-distractors"><b>Distractor Analysis:</b>${distractorsHtml}</div>` : ''}
      `;
      toast('+1 XP • REPAIR RECALL');
    }

    saveMeta();
    $('qs').textContent = `Score: ${quizScore} / ${qi + 1}`;
    $('quiz-next-btn').disabled = false;
  };

  window.nextQuiz = function() {
    if (window.cyberSound) window.cyberSound.click();
    if (qi + 1 < quizPool.length) {
      qi++;
      quiz();
    } else {
      showQuizResults();
    }
  };

  function showQuizResults() {
    if (window.cyberSound) window.cyberSound.victory();
    $('quiz-card').style.display = 'none';
    const res = $('quiz-result');
    res.style.display = 'block';

    const total = quizPool.length;
    const pct = total > 0 ? Math.round((quizScore / total) * 100) : 0;
    $('result-score').textContent = `${quizScore} / ${total} (${pct}%)`;

    let evalText = '';
    if (pct >= 85) {
      evalText = 'SUPERIOR MASTERY: Outstanding active recall for this subject module. University exam ready.';
    } else if (pct >= 65) {
      evalText = 'COMPETENT UNDERSTANDING: Strong core foundation, but subtle differences in mechanism need one more review run.';
    } else {
      evalText = 'NEEDS WORK: Active retrieval broke down. Re-read the cheat sheet notes and review the retrieval deck before retrying.';
    }
    $('result-feedback').textContent = evalText;

    S.xp += 5;
    saveMeta();
    toast('+5 XP • ASSESSMENT FINISHED');
  }

  window.restartQuiz = function() {
    if (window.cyberSound) window.cyberSound.click();
    quizPool = getActiveQuizQuestions();
    for (let i = quizPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quizPool[i], quizPool[j]] = [quizPool[j], quizPool[i]];
    }
    qi = 0;
    quizScore = 0;
    quiz();
  };

  // --- BOSS FIGHT ---
  const BOSS_CHALLENGES = [
    c => ({
      prompt: `[10 MARKS] University Exam Question: Provide a thorough architectural and theoretical breakdown of "${c.title}" (${c.sub}). Define it formally, explain how it operates at a system level, and illustrate with a concrete real-world scenario.`,
      rubric: [
        `<b>Formal Definition:</b> Standard academic wording for ${c.title}`,
        `<b>Working Architecture:</b> Clear operational explanation of mechanisms`,
        `<b>Concrete Demonstration:</b> Concrete scenario / implementation example`,
        `<b>Exam Distinction:</b> Proper separation from commonly confused concepts`
      ]
    }),
    c => ({
      prompt: `[5 MARKS] Practical Problem-Solving Scenario: A production system encounters a critical failure related to "${c.title}". How would a computer engineer diagnose the root cause, mitigate immediate failure, and harden the system?`,
      rubric: [
        `<b>Diagnostic Accuracy:</b> Identifies why ${c.title} broke or was exploited`,
        `<b>Technical Fix:</b> Names concrete algorithms / protocols to remediate`,
        `<b>Blast Radius Containment:</b> Limits damage across components`,
        `<b>Long-term Prevention:</b> Establishes rigorous verification policies`
      ]
    }),
    c => ({
      prompt: `[5 MARKS] "Differentiate Between" Question: Distinguish "${c.title}" from related mechanisms in ${c.cat}. Provide exact definitions, a 3-point comparison table, and an example for each.`,
      rubric: [
        `<b>Point 1:</b> Clear technical definitions of both concepts`,
        `<b>Point 2:</b> Key mathematical / functional divergence`,
        `<b>Point 3:</b> Distinct real-world use cases`,
        `<b>Point 4:</b> Avoidance of standard student traps`
      ]
    })
  ];

  function boss() {
    const topics = getActiveTopics();
    if (topics.length === 0) {
      $('bq').textContent = 'No topics in current selection. Add topics via Topic Studio!';
      $('ba').innerHTML = '';
      $('boss-eval').classList.remove('show');
      $('boss-reveal-btn').disabled = true;
      return;
    }

    const c = topics[bi % topics.length];
    const gen = BOSS_CHALLENGES[(bi + Math.floor(bi / 3)) % BOSS_CHALLENGES.length];
    const challenge = gen(c);

    $('bq').textContent = challenge.prompt;
    $('boss-input').value = '';
    currentBossRubric = challenge.rubric;

    bossRevealed = false;
    bossGraded = false;

    $('ba').innerHTML = `
      <div class="sec">
        <div class="sec-title model">✓ EXAMINER MODEL ANSWER (FULL 10/10 BREAKDOWN):</div>
        ${c.def}
      </div>
      <div class="sec">
        <div class="sec-title">💡 INTUITIVE CORE LOGIC:</div>
        ${c.plain}
      </div>
      <div class="sec">
        <div class="sec-title exam">⚡ EXAM KEYWORDS & MNEMONIC:</div>
        ${c.exam}
      </div>
      <div class="sec">
        <div class="sec-title trap">⚠️ EXAM PITFALL / COMMON MISTAKE:</div>
        ${c.trap}
      </div>
      <div class="sec">
        <div class="sec-title">🚨 REAL-WORLD INCIDENT / DEMO:</div>
        ${c.example}
      </div>
    `;
    $('ba').classList.remove('show');
    $('boss-eval').classList.remove('show');
    $('boss-reveal-btn').textContent = 'REVEAL MODEL ANSWER & RUBRIC';
    $('boss-reveal-btn').disabled = false;
  }

  window.showBoss = function() {
    if (bossRevealed) return;
    if (window.cyberSound) window.cyberSound.flip();
    bossRevealed = true;
    $('ba').classList.add('show');

    const rubricEl = $('boss-rubric');
    rubricEl.innerHTML = currentBossRubric.map((r, i) => `
      <div class="rubric-item">
        <div><b>[Criterion ${i + 1}]</b></div>
        <div>${r}</div>
      </div>
    `).join('');

    $('boss-eval').classList.add('show');
    $('boss-reveal-btn').textContent = 'ANSWER REVEALED';
    $('boss-reveal-btn').disabled = true;
    $('ba').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.gradeBoss = function(pts) {
    if (bossGraded) return;
    bossGraded = true;

    if (pts >= 5 && window.cyberSound) window.cyberSound.victory();
    else if (pts >= 2 && window.cyberSound) window.cyberSound.correct();
    else if (window.cyberSound) window.cyberSound.wrong();

    S.xp += pts;
    if (pts >= 2) S.streak++;
    else S.streak = 0;

    saveMeta();
    toast(`+${pts} XP • BOSS EVALUATED`);

    $('boss-eval').classList.remove('show');
    setTimeout(() => {
      window.newBoss();
    }, 900);
  };

  window.newBoss = function() {
    if (window.cyberSound) window.cyberSound.click();
    const topics = getActiveTopics();
    if (topics.length > 0) {
      bi = (bi + 1) % topics.length;
    }
    boss();
  };

  // --- CHEAT SHEET ---
  window.setFilter = function(cat) {
    if (window.cyberSound) window.cyberSound.click();
    activeFilter = cat;
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.textContent.includes(cat) || (cat === 'ALL' && b.textContent.includes('ALL')));
    });
    refs();
  };

  window.toggleStudyGuide = function(id) {
    if (window.cyberSound) window.cyberSound.click();
    const box = $(`sg-${id}`);
    const btn = $(`btn-sg-${id}`);
    if (!box) return;
    const isOpen = box.classList.toggle('open');
    if (btn) btn.textContent = isOpen ? 'HIDE STUDY GUIDE ▴' : 'EXPAND STUDY GUIDE ▾';
  };

  function refs() {
    const term = ($('search').value || '').trim().toLowerCase();
    const topics = getActiveTopics();

    const cats = new Set(['ALL']);
    topics.forEach(t => { if (t.cat) cats.add(t.cat); });
    const catFiltersEl = $('cat-filters');
    if (catFiltersEl) {
      catFiltersEl.innerHTML = Array.from(cats).map(c => 
        `<button class="filter-btn ${activeFilter === c ? 'active' : ''}" onclick="setFilter('${c}')">${c.toUpperCase()}</button>`
      ).join('');
    }

    const list = topics.filter(c => {
      const matchesCat = (activeFilter === 'ALL') || (c.cat === activeFilter);
      const matchesTerm = !term || [c.title, c.sub, c.def, c.plain, c.exam, c.trap, c.example, c.cat].join(' ').toLowerCase().includes(term);
      return matchesCat && matchesTerm;
    });

    const grid = $('refgrid');
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="card" style="grid-column:1/-1;text-align:center;padding:36px">
          <p style="font-size:14px">No concept matched "${term}".</p>
          <button class="primary" style="margin-top:12px" onclick="$('search').value='';setFilter('ALL')">VIEW ALL TOPICS</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(c => `
      <div class="card ref">
        <div>
          <div class="ref-header">
            <span class="small" style="color:var(--acid);font-weight:900">MOD ${c._modNum} • ${c.cat.toUpperCase()}</span>
            <span class="badge">SYLLABUS TOPIC</span>
          </div>
          <h3 style="margin-top:4px">${c.title}</h3>
          <p style="color:var(--text);font-weight:bold;margin-bottom:8px">${c.sub}</p>

          <div class="ref-body">
            <div class="sec"><b>DEFINITION:</b> ${c.def}</div>
            <div class="sec" style="color:var(--acid)"><b>EXAM PUNCHLINE:</b> ${c.exam}</div>
            <div class="sec"><b>PRACTICAL SCENARIO:</b> ${c.example}</div>
          </div>

          <div class="study-guide-box" id="sg-${c.id}">
            <div class="sec"><div class="sec-title">💡 INTUITION:</div>${c.plain}</div>
            <div class="sec"><div class="sec-title trap">⚠️ EXAM PITFALL / TRAP:</div>${c.trap}</div>
            <div class="sec"><div class="sec-title model">📝 FLASHCARD QUESTION:</div>${c.q}<br><b style="color:var(--acid)">Answer:</b> ${c.a}</div>
          </div>
        </div>

        <div class="actions" style="margin-top:10px;justify-content:space-between">
          <button class="study-btn" id="btn-sg-${c.id}" onclick="toggleStudyGuide('${c.id}')">EXPAND STUDY GUIDE ▾</button>
          <button class="ghost" style="padding:6px 10px;font-size:11px" onclick="trainSingleTopic('${c.id}')">TRAIN THIS →</button>
        </div>
      </div>
    `).join('');
  }

  // --- TOPIC STUDIO / ENGINE ---
  window.autoGamifyInStudio = function() {
    const title = $('eng-title').value.trim();
    if (!title) {
      toast('PLEASE ENTER A TOPIC TITLE');
      return;
    }
    const cat = $('eng-cat').value.trim() || 'Core';
    const sub = $('eng-sub').value.trim() || `${cat} • ASTU Syllabus`;
    const notes = $('eng-notes').value.trim();

    generatedStudioPack = window.gamifyEngine.gamifyTopic(title, cat, sub, notes);
    if (!generatedStudioPack) return;

    if (window.cyberSound) window.cyberSound.click();

    $('eng-preview').innerHTML = `
      <div style="color:var(--acid);font-weight:900;margin-bottom:8px">✓ TOPIC PACK GAMIFIED SUCCESSFULLY:</div>
      <div><b>TITLE:</b> ${generatedStudioPack.topic.title}</div>
      <div><b>SUBTITLE:</b> ${generatedStudioPack.topic.sub}</div>
      <div style="margin-top:6px"><b>INTUITION:</b> ${generatedStudioPack.topic.plain}</div>
      <div style="margin-top:6px"><b>DEFINITION:</b> ${generatedStudioPack.topic.def}</div>
      <div style="margin-top:6px;color:var(--amber)"><b>TRAP:</b> ${generatedStudioPack.topic.trap}</div>
      <div style="margin-top:6px;color:var(--blue)"><b>QUIZ MCQ:</b> ${generatedStudioPack.quiz.q}</div>
      <div style="margin-top:12px">
        <button class="primary" onclick="saveTopicFromStudio()">CONFIRM & SAVE TO CURRICULUM</button>
      </div>
    `;
    toast('TOPIC GAMIFIED IN PREVIEW');
  };

  window.saveTopicFromStudio = function() {
    if (!generatedStudioPack) window.autoGamifyInStudio();
    if (!generatedStudioPack) return;

    const subjId = $('eng-subject').value || S.activeSubject;
    const modId = $('eng-module').value || (S.activeModule !== 'all' ? S.activeModule : 'm1');

    const subj = curriculum.subjects.find(s => s.id === subjId) || curriculum.subjects[0];
    if (!subj) {
      toast('SUBJECT NOT FOUND');
      return;
    }
    const mod = (subj.modules || []).find(m => m.id === modId) || (subj.modules && subj.modules[0]);
    if (!mod) {
      toast('MODULE NOT FOUND');
      return;
    }

    if (!mod.topics) mod.topics = [];
    if (!mod.quiz) mod.quiz = [];

    mod.topics.push(generatedStudioPack.topic);
    mod.quiz.push(generatedStudioPack.quiz);

    window.gamifyEngine.saveCurriculum(curriculum);
    if (window.cyberSound) window.cyberSound.correct();
    syncActiveState();

    $('eng-title').value = '';
    $('eng-sub').value = '';
    $('eng-notes').value = '';
    generatedStudioPack = null;
    $('eng-preview').innerHTML = `<p style="color:var(--acid)">✓ Topic saved into ${subj.title} -> Module ${mod.num}! Switch to Home or Learn to practice it.</p>`;
    toast('TOPIC SAVED TO CURRICULUM');
  };

  window.exportCurriculumJSON = function() {
    if (window.cyberSound) window.cyberSound.click();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(curriculum, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "curriculum.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast('CURRICULUM EXPORTED AS JSON');
  };

  window.promptImportJSON = function() {
    const raw = prompt('Paste your curriculum JSON below:');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.subjects)) {
        curriculum = parsed;
        window.gamifyEngine.saveCurriculum(curriculum);
        syncActiveState();
        toast('CURRICULUM IMPORTED SUCCESSFULLY');
      } else {
        toast('INVALID FORMAT: MUST CONTAIN "subjects" ARRAY');
      }
    } catch (e) {
      toast('JSON PARSE ERROR: ' + e.message);
    }
  };

  // --- KEYBOARD SHORTCUTS ---
  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      if (e.key === 'Enter' && e.ctrlKey && $('boss').classList.contains('active')) {
        e.preventDefault();
        window.showBoss();
      }
      return;
    }

    const k = e.key.toLowerCase();

    // LEARN SHORTCUTS
    if ($('learn').classList.contains('active')) {
      if (k === 'r' || e.code === 'Space') {
        e.preventDefault();
        window.reveal();
      } else if (k === 'n' || e.key === 'ArrowRight') {
        e.preventDefault();
        window.next();
      } else if (k === 'p' || e.key === 'ArrowLeft') {
        e.preventDefault();
        window.prevCard();
      } else if (k === '1') {
        e.preventDefault();
        window.rate(1);
      } else if (k === '2') {
        e.preventDefault();
        window.rate(2);
      }
    }

    // QUIZ SHORTCUTS
    if ($('quiz').classList.contains('active')) {
      if (['1', '2', '3', '4'].includes(k)) {
        const idx = parseInt(k) - 1;
        if (!quizAnswered) window.answerQuiz(idx);
      } else if (k === 'n' || e.key === 'Enter') {
        if (quizAnswered) window.nextQuiz();
      }
    }

    // BOSS SHORTCUTS
    if ($('boss').classList.contains('active')) {
      if (k === 'n') window.newBoss();
    }
  });

  // INITIALIZE ON LOAD
  syncActiveState();

  // Initialize Sound button text
  const btnSound = $('btn-sound');
  if (btnSound && window.cyberSound) {
    const isMuted = window.cyberSound.isMuted();
    btnSound.textContent = isMuted ? '🔇 MUTED' : '🔊 SOUND';
    btnSound.classList.toggle('muted', isMuted);
  }
})();
