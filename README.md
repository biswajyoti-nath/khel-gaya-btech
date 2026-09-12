# ⚡ KHEL GAYA B.TECH — Multi-Subject Study & Gamification Engine

> **"Break the concepts before they break you."**  
> An active-recall, spaced-repetition study and gamification engine built for **Assam Science and Technology University (ASTU) B.Tech CSE 5th Semester** (based on `B.Tech-CSE-5th-Sem-Final.pdf`).

---

## 🚀 Live Vercel Deployment

This project is pre-configured for instant zero-config deployment on **[Vercel](https://vercel.com)**:

### Option A: Deploy with Vercel CLI
```bash
# 1. In this directory, run:
npx vercel

# 2. Deploy to production:
npx vercel --prod
```

### Option B: Deploy via GitHub
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete multi-subject gamification engine"
   git push -u origin main
   # Remote: https://github.com/biswajyoti-nath/khel-gaya-btech
   ```
2. Go to [vercel.com](https://vercel.com/new), select your repository, and click **Deploy**.
3. Vercel automatically detects the static configuration (`vercel.json`) and deploys to its global Edge Network with 100/100 Lighthouse performance.

---

## 🏛️ Multi-Subject Architecture
Navigate seamlessly across all 5th semester courses:  
**`Subject ➔ Module ➔ Topic`**

### Pre-loaded ASTU 5th Semester Subjects:
1. **🛡️ Cyber Security (`CS241505`)**: 5 Modules (CIA, Cryptography, Firewalls, Web Security SQLi/XSS, IT Act 2000)
2. **⚙️ Operating Systems (`CS241502`)**: 5 Modules (Dual-mode, Process PCB & CPU Scheduling, Semaphores & Banker's Algorithm, Paging & Virtual Memory, Disk Scheduling)
3. **🌐 Computer Networks (`CS241503`)**: 5 Modules (OSI vs TCP/IP, CRC & Sliding Window, Subnetting & CIDR, Routing OSPF/BGP, TCP 3-Way Handshake & Congestion Control, DNS)
4. **🤖 Artificial Intelligence (`CS241501`)**: Intelligent Agents & PEAS, Search Algorithms (A*, BFS/DFS, Heuristics), Knowledge Representation & Propositional Logic
5. **⚡ Formal Language & Automata (`CS241504`)**: Finite Automata (DFA/NFA), Regular Expressions & Pumping Lemma, Turing Machines & Computability
6. **🚀 Software DevOps & Automation (`CS241513`)**: Git Workflows, Docker Containerization, CI/CD pipelines

---

## 🎮 The Gamification Engine (Topic Studio)

You can feed **ANY** syllabus bullet point, textbook topic, or exam heading into the engine, and it automatically formats it into the **Khel Gaya B.Tech Active-Recall Schema**:
1. 💡 **Intuitive Mental Model (Plain English / ELI5)**
2. 📝 **University Full-Marks Academic Definition**
3. ⚡ **Exam Punchline & Mnemonic**
4. ⚠️ **Common Exam Trap / Gotcha where students lose marks**
5. 🚨 **Concrete Practical / Attack Demonstration**
6. 🗂️ **Active Retrieval Flashcard (Prompt + Model Answer)**
7. 🎯 **Active Recall MCQ with Distractor Analysis**
8. ⚔️ **Boss Fight Exam Challenge (5/10 marks with examiner rubric)**

### In-App Studio (`index.html` ➔ `⚙️ TOPIC STUDIO`)
1. Select target **Subject** & **Module** (or create a custom subject).
2. Type any **Topic Title** and optional notes/bullets.
3. Click **`⚡ AUTO-GAMIFY & PREVIEW`** to generate the active recall pack.
4. Click **`SAVE TO CURRICULUM`** — instantly saved in `localStorage`.
5. **Export & Import:** Use `EXPORT JSON` or `IMPORT JSON` to back up or share study packs.

### Python CLI Engine (`gamify_engine.py`)
```bash
# List all subjects, modules, and topic counts from the ASTU syllabus PDF:
python3 gamify_engine.py --list

# Run the interactive topic gamifier wizard:
python3 gamify_engine.py --interactive

# Add a topic directly via CLI arguments:
python3 gamify_engine.py --add --subject os --module 3 --title "Dining Philosophers Problem" --category Synchronization
```

---

## 🕹️ Game Mechanics & Features
- **Fluid, Accessible Scrolling**: Natural full-page window scrolling with sticky sidebar navigation.
- **Synthesized 8-Bit Cyber Audio (`js/audio.js`)**: Real-time sound effects for card reveals, streak rewards, and quiz answers synthesized via the browser's Web Audio API (zero audio files needed, includes mute button!).
- **Active Recall Quiz**: 4-option MCQs with detailed explanations for why the correct answer is right and why the other 3 choices are wrong.
- **Boss Fight Generation**: 5-mark and 10-mark ASTU questions with an interactive 4-criterion marking rubric.
- **Expandable Cheat Sheet**: Instant search & category filters with in-depth study notes.
- **Keyboard Shortcuts**:
  - `R` / `Space` = Reveal flashcard
  - `N` / `→` = Next card / question
  - `P` / `←` = Previous card
  - `1` = Missed (+1 XP, resets streak)
  - `2` = Got it (+2 XP, increments streak)
  - `1-4` = Choose option A-D in Quiz
  - `Ctrl+Enter` = Reveal Boss Fight rubric
- **PWA & Mobile Ready**: Responsive layout and `manifest.json` for adding to homescreen.

---

## 🛠️ Local Development

```bash
# Run local preview server:
npm run dev

# Run automated integrity test:
npm test

# Launch CLI syllabus engine:
npm run engine
```
