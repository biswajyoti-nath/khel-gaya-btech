// KHEL GAYA B.TECH SYLLABUS GAMIFICATION ENGINE
// Transforms raw college syllabus topics, textbook outlines, or PDF bullets into active recall packs.

class GamificationEngine {
  constructor() {
    this.storageKey = 'cbr_curriculum';
  }

  getCurriculum() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.subjects) && parsed.subjects.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage curriculum load error:', e);
    }
    const def = (typeof window !== 'undefined' && window.DEFAULT_CURRICULUM) || 
                (typeof DEFAULT_CURRICULUM !== 'undefined' ? DEFAULT_CURRICULUM : null);
    return def || { subjects: [] };
  }

  saveCurriculum(curr) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(curr));
    } catch (e) {
      console.warn('LocalStorage curriculum save failed:', e);
    }
  }

  resetToDefault() {
    localStorage.removeItem(this.storageKey);
    const def = (typeof window !== 'undefined' && window.DEFAULT_CURRICULUM) || 
                (typeof DEFAULT_CURRICULUM !== 'undefined' ? DEFAULT_CURRICULUM : null);
    return def || { subjects: [] };
  }

  /**
   * Generates a complete gamified topic pack from raw user input.
   */
  gamifyTopic(title, cat = 'Core', sub = '', notes = '') {
    title = title.trim();
    if (!title) return null;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const category = cat.trim() || 'Core';
    const subtitle = sub.trim() || `${category} • University Syllabus`;

    // 1. Intuition (Plain English)
    let plain = '';
    if (notes && notes.length > 10) {
      plain = `Intuition for ${title}: ${notes}`;
    } else {
      plain = `Mental model for ${title}: Visualizing how it operates in simple terms without heavy textbook jargon. Focuses on the why and how before academic formulas.`;
    }

    // 2. Formal Academic Definition (ASTU exam standard)
    const def = `${title} is formally defined in computer science and engineering curricula as a critical foundational mechanism. It establishes the theoretical constraints, architectural state transitions, and deterministic requirements necessary for system correctness.`;

    // 3. Exam Takeaway & Mnemonic
    const exam = `Exam Punchline: Remember the core 3-part formula for ${title}: 1) Formal definition, 2) Underlying architectural/mathematical mechanism, 3) Real-world system manifestation.`;

    // 4. Common Exam Pitfall / Trap
    const trap = `Exam Trap: Students frequently lose marks on ${title} by confusing it with related surface concepts or failing to specify edge conditions in 5-mark and 10-mark questions.`;

    // 5. Concrete Real-World Incident / Attack / Demonstration
    const example = `Real-world Implementation: Concrete scenario demonstrating how ${title} operates in production operating systems, network stacks, or enterprise security architectures.`;

    // 6. Active Retrieval Flashcard
    const q = `In university examinations, what is the core operational principle and primary significance of ${title}?`;
    const a = `${title} guarantees that system state transitions satisfy formal specifications and operate deterministically under hardware and software constraints.`;

    // 7. Active Recall MCQ with Distractor Analysis
    const quizItem = {
      q: `Which of the following statements most accurately reflects the primary technical purpose of ${title}?`,
      opts: [
        `It provides the formal mechanism and operational guarantees for ${title}`,
        `It is an optional cosmetic wrapper with no performance or security consequence`,
        `It completely eliminates the need for underlying hardware or OS primitives`,
        `It violates isolation, security, and deterministic boundaries`
      ],
      ans: 0,
      cat: category,
      correctFb: `Correct! ${title} satisfies formal system, architectural, and operational specifications.`,
      distractors: [
        `Option B is false: It is a critical functional and evaluative requirement.`,
        `Option C is false: It directly coordinates with hardware and protocol layers.`,
        `Option D is false: It strictly preserves isolation and safety principles.`
      ]
    };

    return {
      topic: {
        id: slug,
        cat: category,
        title: title.toUpperCase(),
        sub: subtitle,
        plain,
        def,
        exam,
        trap,
        example,
        q,
        a
      },
      quiz: quizItem
    };
  }

  /**
   * Batch gamifies raw syllabus lines (e.g. from copy-pasting a PDF page).
   */
  batchGamifyText(text, subjId, modId, defaultCat = 'Core') {
    const lines = text
      .split(/\n||•|\*|;/)
      .map(l => l.trim())
      .filter(l => l.length > 3 && !l.toLowerCase().startsWith('page ') && !l.toLowerCase().startsWith('assam science'));

    if (lines.length === 0) return 0;

    const curr = this.getCurriculum();
    const subj = curr.subjects.find(s => s.id === subjId) || curr.subjects[0];
    if (!subj) return 0;

    let mod = (subj.modules || []).find(m => m.id === modId);
    if (!mod) {
      mod = { id: modId, num: parseInt(modId.replace(/\D/g, '')) || 1, title: `Module ${modId}`, topics: [], quiz: [] };
      if (!subj.modules) subj.modules = [];
      subj.modules.push(mod);
    }

    if (!mod.topics) mod.topics = [];
    if (!mod.quiz) mod.quiz = [];

    let count = 0;
    lines.forEach(line => {
      // Split into title and details if colon exists
      let title = line;
      let notes = '';
      if (line.includes(':')) {
        const parts = line.split(':');
        title = parts[0].trim();
        notes = parts.slice(1).join(':').trim();
      }
      const pack = this.gamifyTopic(title, defaultCat, `${defaultCat} • Syllabus Topic`, notes);
      if (pack) {
        // Avoid exact duplicates
        if (!mod.topics.some(t => t.id === pack.topic.id)) {
          mod.topics.push(pack.topic);
          mod.quiz.push(pack.quiz);
          count++;
        }
      }
    });

    this.saveCurriculum(curr);
    return count;
  }
}

window.gamifyEngine = new GamificationEngine();
