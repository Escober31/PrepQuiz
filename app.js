/**
 * PrepQuiz - Interactive Student Exam Practice Portal
 * Core Client-Side Application Logic with Gamification Engine (XP, Streaks & Achievements)
 * Pure Vanilla JavaScript (No backend required)
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. Audio Synthesis Engine (Web Audio API - Pure synthesized sound)
  // ==========================================================================
  const SoundEngine = {
    enabled: true,
    audioCtx: null,

    init() {
      if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }
    },

    playTone(frequency, type, duration, delay = 0) {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.audioCtx.state === "suspended") {
          this.audioCtx.resume();
        }

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const startTime = this.audioCtx.currentTime + delay;
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      } catch (err) {
        console.warn("Audio error:", err);
      }
    },

    correct() {
      this.playTone(523.25, "sine", 0.12, 0);       // C5
      this.playTone(659.25, "sine", 0.12, 0.08);    // E5
      this.playTone(783.99, "sine", 0.25, 0.16);    // G5
    },

    wrong() {
      this.playTone(293.66, "triangle", 0.15, 0);   // D4
      this.playTone(220.00, "triangle", 0.25, 0.12); // A3
    },

    tick() {
      this.playTone(880, "sine", 0.03, 0);          // High click
    },

    finish() {
      this.playTone(440, "sine", 0.1, 0);
      this.playTone(554.37, "sine", 0.1, 0.09);
      this.playTone(659.25, "sine", 0.15, 0.18);
      this.playTone(880, "sine", 0.35, 0.27);
    },

    levelUp() {
      this.playTone(440, "sine", 0.1, 0);
      this.playTone(554.37, "sine", 0.1, 0.08);
      this.playTone(659.25, "sine", 0.1, 0.16);
      this.playTone(880, "sine", 0.3, 0.24);
    },

    achievement() {
      this.playTone(587.33, "sine", 0.12, 0);
      this.playTone(739.99, "sine", 0.12, 0.1);
      this.playTone(880.00, "sine", 0.15, 0.2);
      this.playTone(1174.66, "sine", 0.35, 0.3);
    }
  };

  // ==========================================================================
  // 2. Gamification Engine (XP, Levels, Streaks & Achievements)
  // ==========================================================================
  const LEVEL_TIERS = [
    { level: 1, title: "Novice Scholar", minXP: 0, maxXP: 100 },
    { level: 2, title: "Apprentice Thinker", minXP: 100, maxXP: 250 },
    { level: 3, title: "Knowledge Seeker", minXP: 250, maxXP: 450 },
    { level: 4, title: "Master Student", minXP: 450, maxXP: 700 },
    { level: 5, title: "Academic Pro", minXP: 700, maxXP: 1000 },
    { level: 6, title: "Quiz Grandmaster", minXP: 1000, maxXP: 999999 }
  ];

  const ACHIEVEMENTS_CATALOG = [
    { id: "first_quiz", title: "First Step", desc: "Complete your first practice quiz", icon: "🌟", reward: 50 },
    { id: "streak_3", title: "Hot Streak", desc: "Answer 3 questions correctly in a row", icon: "🔥", reward: 30 },
    { id: "streak_5", title: "Sharpshooter", desc: "Answer 5 questions correctly in a row", icon: "🎯", reward: 60 },
    { id: "speed_demon", title: "Speed Demon", desc: "Answer any question correctly in under 5 seconds", icon: "⚡", reward: 40 },
    { id: "perfect_score", title: "Flawless Victory", desc: "Score 100% on a practice quiz", icon: "💯", reward: 100 },
    { id: "polymath", title: "Renaissance Scholar", desc: "Complete quizzes in at least 3 distinct subjects", icon: "🌐", reward: 75 },
    { id: "tactician", title: "Strategic Review", desc: "Flag a question and complete your quiz", icon: "⚑", reward: 35 },
    { id: "level_up", title: "Rising Star", desc: "Reach Level 2 in your study progression", icon: "🏆", reward: 50 }
  ];

  const Gamification = {
    STORAGE_KEY: "prepmaster_gamification_v1",

    state: {
      totalXP: 0,
      dailyStreak: 1,
      lastActiveDate: null,
      bestInQuizStreak: 0,
      quizzesCompleted: 0,
      subjectsPracticed: [],
      unlockedAchievements: {} // { [id]: unlockDateString }
    },

    // Session-specific tracking
    currentInQuizStreak: 0,
    sessionTotalXPGained: 0,
    sessionXPBreakdown: [],
    questionStartTime: 0,
    newlyUnlockedThisQuiz: [],

    load() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          this.state = Object.assign(this.state, parsed);
        }
      } catch (err) {
        console.warn("Could not load gamification state:", err);
      }
      this.updateDailyStreak();
      this.save();
      this.updateUI();
    },

    save() {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      } catch (err) {
        console.warn("Could not save gamification state:", err);
      }
    },

    updateDailyStreak() {
      const today = new Date().toISOString().slice(0, 10);
      if (!this.state.lastActiveDate) {
        this.state.lastActiveDate = today;
        this.state.dailyStreak = 1;
        return;
      }

      if (this.state.lastActiveDate === today) {
        // Already active today
        return;
      }

      const lastDate = new Date(this.state.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.state.dailyStreak += 1;
      } else if (diffDays > 1) {
        this.state.dailyStreak = 1;
      }
      this.state.lastActiveDate = today;
    },

    getLevelInfo(xp = this.state.totalXP) {
      let currentTier = LEVEL_TIERS[0];
      for (const tier of LEVEL_TIERS) {
        if (xp >= tier.minXP) {
          currentTier = tier;
        } else {
          break;
        }
      }

      const nextTier = LEVEL_TIERS.find(t => t.level === currentTier.level + 1) || currentTier;
      const range = nextTier.minXP - currentTier.minXP;
      const progressInTier = Math.max(0, xp - currentTier.minXP);
      const percent = currentTier.level === 6 ? 100 : Math.min(100, Math.round((progressInTier / (range || 1)) * 100));

      return {
        level: currentTier.level,
        title: currentTier.title,
        currentXP: xp,
        nextLevelXP: nextTier.minXP,
        percent: percent
      };
    },

    addXP(amount, reason = "Practice") {
      const oldLevelInfo = this.getLevelInfo();
      this.state.totalXP += amount;
      this.sessionTotalXPGained += amount;
      this.sessionXPBreakdown.push({ label: reason, amount });

      const newLevelInfo = this.getLevelInfo();
      if (newLevelInfo.level > oldLevelInfo.level) {
        SoundEngine.levelUp();
        showToast(`🎉 Level Up! You reached Level ${newLevelInfo.level}: ${newLevelInfo.title}!`, "🏆");
        this.unlockAchievement("level_up");
      }

      this.save();
      this.updateUI();
    },

    unlockAchievement(id) {
      if (this.state.unlockedAchievements[id]) return; // Already unlocked

      const item = ACHIEVEMENTS_CATALOG.find(a => a.id === id);
      if (!item) return;

      this.state.unlockedAchievements[id] = new Date().toISOString();
      this.newlyUnlockedThisQuiz.push(item);

      // Award achievement XP
      this.addXP(item.reward, `Achievement: ${item.title}`);
      SoundEngine.achievement();
      showToast(`🏆 Achievement Unlocked: ${item.title} (+${item.reward} XP)!`, item.icon);

      this.save();
      this.updateUI();
    },

    updateUI() {
      const info = this.getLevelInfo();
      const unlockedCount = Object.keys(this.state.unlockedAchievements).length;

      // Header pills
      if (dom.headerXpVal) dom.headerXpVal.textContent = this.state.totalXP;
      if (dom.headerStreakVal) dom.headerStreakVal.textContent = this.state.dailyStreak;

      // Home Screen Hub
      if (dom.hubLevelBadge) dom.hubLevelBadge.textContent = `Level ${info.level}`;
      if (dom.hubLevelTitle) dom.hubLevelTitle.textContent = info.title;
      if (dom.hubXpProgressText) {
        dom.hubXpProgressText.textContent = info.level === 6 
          ? `${this.state.totalXP} XP (Max Level)` 
          : `${info.currentXP} / ${info.nextLevelXP} XP to Level ${info.level + 1}`;
      }
      if (dom.hubXpFill) dom.hubXpFill.style.width = `${info.percent}%`;
      if (dom.hubDailyStreak) dom.hubDailyStreak.textContent = `${this.state.dailyStreak} Day${this.state.dailyStreak > 1 ? "s" : ""}`;
      if (dom.hubTotalXp) dom.hubTotalXp.textContent = `${this.state.totalXP} XP`;
      if (dom.hubBestStreak) dom.hubBestStreak.textContent = this.state.bestInQuizStreak;
      if (dom.hubAchievementsCount) dom.hubAchievementsCount.textContent = `${unlockedCount}/${ACHIEVEMENTS_CATALOG.length}`;
      if (dom.modalAchievementsUnlockedCount) dom.modalAchievementsUnlockedCount.textContent = unlockedCount;
    },

    renderAchievementsModal() {
      if (!dom.achievementsListModal) return;
      dom.achievementsListModal.innerHTML = "";

      ACHIEVEMENTS_CATALOG.forEach(ach => {
        const isUnlocked = Boolean(this.state.unlockedAchievements[ach.id]);
        const card = document.createElement("div");
        card.className = `achievement-card ${isUnlocked ? "unlocked" : "locked"}`;

        let statusText = isUnlocked 
          ? `✓ Unlocked • +${ach.reward} XP` 
          : `🔒 Locked • Reward: +${ach.reward} XP`;

        card.innerHTML = `
          <div class="achieve-icon-box">${ach.icon}</div>
          <div class="achieve-info">
            <div class="achieve-title">
              ${ach.title}
              ${isUnlocked ? '<span style="font-size: 0.75rem; color: #10b981; font-weight: 800;">✓</span>' : ''}
            </div>
            <div class="achieve-desc">${ach.desc}</div>
            <div class="achieve-meta">${statusText}</div>
          </div>
          <div class="achieve-reward-badge">+${ach.reward} XP</div>
        `;

        dom.achievementsListModal.appendChild(card);
      });
    }
  };

  // ==========================================================================
  // 3. Application State
  // ==========================================================================
  const state = {
    // Configuration
    category: "Understanding Global Warming: A Quiz",
    difficulty: "ALL",
    timerEnabled: true,
    timerMode: "quiz", // "quiz" | "question"
    wholeQuizSecondsTotal: 300,
    perQuestionSecondsTotal: 30,

    // Active Quiz Session
    sessionQuestions: [],
    currentIndex: 0,
    quizStartTime: null,
    totalElapsedSeconds: 0,

    // Timers
    globalTimerInterval: null,
    globalSecondsRemaining: 0,
    questionTimerInterval: null,
    questionSecondsRemaining: 0,

    // Modal Callback
    pendingConfirmAction: null
  };

  // ==========================================================================
  // 4. DOM Element References
  // ==========================================================================
  const dom = {
    // Views
    homeView: document.getElementById("home-view"),
    quizView: document.getElementById("quiz-view"),
    resultsView: document.getElementById("results-view"),

    // Header & Global
    headerXpBadge: document.getElementById("header-xp-badge"),
    headerXpVal: document.getElementById("header-xp-val"),
    headerStreakBadge: document.getElementById("header-streak-badge"),
    headerStreakVal: document.getElementById("header-streak-val"),
    headerAchievementsBtn: document.getElementById("header-achievements-btn"),
    soundToggleBtn: document.getElementById("sound-toggle-btn"),
    headerHomeBtn: document.getElementById("header-home-btn"),
    brandHomeLink: document.getElementById("brand-home-link"),
    toast: document.getElementById("toast"),
    toastText: document.getElementById("toast-text"),
    toastIcon: document.getElementById("toast-icon"),

    // Home Gamification Hub
    hubLevelBadge: document.getElementById("hub-level-badge"),
    hubLevelTitle: document.getElementById("hub-level-title"),
    hubXpProgressText: document.getElementById("hub-xp-progress-text"),
    hubXpFill: document.getElementById("hub-xp-fill"),
    hubDailyStreak: document.getElementById("hub-daily-streak"),
    hubTotalXp: document.getElementById("hub-total-xp"),
    hubBestStreak: document.getElementById("hub-best-streak"),
    hubAchievementsCount: document.getElementById("hub-achievements-count"),
    hubViewAchievementsBtn: document.getElementById("hub-view-achievements-btn"),

    // Home Setup
    quizConfigForm: document.getElementById("quiz-config-form"),
    categorySelect: document.getElementById("category-select"),
    quickCategoryCards: document.querySelectorAll(".cat-card-option"),
    difficultyBtns: document.querySelectorAll("#difficulty-control .segment-btn"),
    timerToggle: document.getElementById("timer-toggle"),
    timerOptionsContainer: document.getElementById("timer-options-container"),
    wholeQuizMinutes: document.getElementById("whole-quiz-minutes"),
    perQuestionSeconds: document.getElementById("per-question-seconds"),
    timerModeRadios: document.querySelectorAll("input[name='timerMode']"),

    // Active Quiz
    quizCategoryBadge: document.getElementById("quiz-category-badge"),
    quizDifficultyBadge: document.getElementById("quiz-difficulty-badge"),
    quizStreakWidget: document.getElementById("quiz-streak-widget"),
    quizStreakCount: document.getElementById("quiz-streak-count"),
    timerWidget: document.getElementById("timer-widget"),
    timerDisplay: document.getElementById("timer-display"),
    timerTypeLabel: document.getElementById("timer-type-label"),
    quitQuizBtn: document.getElementById("quit-quiz-btn"),

    questionIndicator: document.getElementById("question-indicator"),
    answeredStatsBadge: document.getElementById("answered-stats-badge"),
    progressBarFill: document.getElementById("progress-bar-fill"),
    questionNavGrid: document.getElementById("question-nav-grid"),

    floatingXpContainer: document.getElementById("floating-xp-container"),
    questionNumTag: document.getElementById("question-num-tag"),
    questionText: document.getElementById("question-text"),
    flagBtn: document.getElementById("flag-btn"),
    flagIcon: document.getElementById("flag-icon"),
    flagText: document.getElementById("flag-text"),
    optionsContainer: document.getElementById("options-container"),
    explanationCard: document.getElementById("explanation-card"),
    explanationText: document.getElementById("explanation-text"),

    prevBtn: document.getElementById("prev-btn"),
    skipBtn: document.getElementById("skip-btn"),
    nextBtn: document.getElementById("next-btn"),
    submitQuizBtn: document.getElementById("submit-quiz-btn"),

    // Results Screen
    resultsIcon: document.getElementById("results-icon"),
    resultsHeading: document.getElementById("results-heading"),
    resultsSubheading: document.getElementById("results-subheading"),
    scorePercentage: document.getElementById("score-percentage"),
    statTotal: document.getElementById("stat-total"),
    statCorrect: document.getElementById("stat-correct"),
    statWrong: document.getElementById("stat-wrong"),
    statSkipped: document.getElementById("stat-skipped"),
    statTime: document.getElementById("stat-time"),

    // Rewards & Gamification on Results
    resultsRewardsCard: document.getElementById("results-rewards-card"),
    resultsTotalXpGained: document.getElementById("results-total-xp-gained"),
    resultsRewardsBreakdown: document.getElementById("results-rewards-breakdown"),
    resultsNewAchievementsContainer: document.getElementById("results-new-achievements-container"),
    resultsNewAchievementsList: document.getElementById("results-new-achievements-list"),

    retakeQuizBtn: document.getElementById("retake-quiz-btn"),
    changeTopicBtn: document.getElementById("change-topic-btn"),
    reviewListContainer: document.getElementById("review-list-container"),
    reviewFilterChips: document.querySelectorAll(".review-filters .filter-chip"),
    countAll: document.getElementById("count-all"),
    countCorrect: document.getElementById("count-correct"),
    countIncorrect: document.getElementById("count-incorrect"),
    countFlagged: document.getElementById("count-flagged"),

    // Achievements Modal
    achievementsModal: document.getElementById("achievements-modal"),
    achievementsModalCloseBtn: document.getElementById("achievements-modal-close-btn"),
    modalAchievementsUnlockedCount: document.getElementById("modal-achievements-unlocked-count"),
    achievementsListModal: document.getElementById("achievements-list-modal"),

    // Confirm Modal
    confirmModal: document.getElementById("confirm-modal"),
    modalTitle: document.getElementById("modal-title"),
    modalBody: document.getElementById("modal-body"),
    modalCancelBtn: document.getElementById("modal-cancel-btn"),
    modalConfirmBtn: document.getElementById("modal-confirm-btn")
  };

  // ==========================================================================
  // 5. Utility Functions (Fisher-Yates Shuffle & Formatting)
  // ==========================================================================
  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function formatTime(totalSeconds) {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.floor(Math.max(0, totalSeconds) % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  let toastTimeout = null;
  function showToast(message, icon = "ℹ️") {
    if (toastTimeout) clearTimeout(toastTimeout);
    dom.toastText.textContent = message;
    dom.toastIcon.textContent = icon;
    dom.toast.classList.add("show");
    toastTimeout = setTimeout(() => {
      dom.toast.classList.remove("show");
    }, 3500);
  }

  function showFloatingXP(text) {
    if (!dom.floatingXpContainer) return;
    const badge = document.createElement("div");
    badge.className = "floating-xp-item";
    badge.textContent = text;
    dom.floatingXpContainer.appendChild(badge);

    setTimeout(() => {
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    }, 1300);
  }

  function switchView(viewName) {
    dom.homeView.classList.remove("active");
    dom.quizView.classList.remove("active");
    dom.resultsView.classList.remove("active");

    if (viewName === "home") {
      dom.homeView.classList.add("active");
      Gamification.updateUI();
    } else if (viewName === "quiz") {
      dom.quizView.classList.add("active");
    } else if (viewName === "results") {
      dom.resultsView.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showConfirmModal(title, body, onConfirm) {
    dom.modalTitle.textContent = title;
    dom.modalBody.textContent = body;
    state.pendingConfirmAction = onConfirm;
    dom.confirmModal.classList.add("open");
  }

  function closeConfirmModal() {
    dom.confirmModal.classList.remove("open");
    state.pendingConfirmAction = null;
  }

  function openAchievementsModal() {
    Gamification.renderAchievementsModal();
    dom.achievementsModal.classList.add("open");
  }

  function closeAchievementsModal() {
    dom.achievementsModal.classList.remove("open");
  }

  // ==========================================================================
  // 6. Quiz Initialization & Randomization
  // ==========================================================================
  function startQuiz() {
    // 1. Filter Questions
    let pool = window.QUESTION_BANK || [];

    if (state.category !== "ALL") {
      pool = pool.filter(q => q.category === state.category);
    }

    if (state.difficulty !== "ALL") {
      pool = pool.filter(q => q.difficulty === state.difficulty);
    }

    if (pool.length === 0) {
      showToast("No questions found for the selected criteria. Try choosing 'All Levels'.", "⚠️");
      return;
    }

    // 2. Randomize Question Order
    const shuffledQuestionPool = shuffleArray(pool);

    // 3. For every question, randomize its answer options (A, B, C, D)
    state.sessionQuestions = shuffledQuestionPool.map((q) => {
      const shuffledOptions = shuffleArray(q.options);
      return {
        originalId: q.id,
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        shuffledOptions: shuffledOptions,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        // Session tracking fields
        selectedAnswer: null,
        isAnswered: false,
        isCorrect: false,
        isFlagged: false
      };
    });

    state.currentIndex = 0;
    state.quizStartTime = Date.now();
    state.totalElapsedSeconds = 0;

    // Reset Gamification In-Quiz Session
    Gamification.currentInQuizStreak = 0;
    Gamification.sessionTotalXPGained = 0;
    Gamification.sessionXPBreakdown = [];
    Gamification.newlyUnlockedThisQuiz = [];
    dom.quizStreakWidget.style.display = "none";
    dom.quizStreakCount.textContent = "0";

    // 4. Update Quiz Header Meta
    dom.quizCategoryBadge.textContent = state.category === "ALL" ? "All Subjects" : state.category;
    dom.quizDifficultyBadge.textContent = state.difficulty;
    dom.quizDifficultyBadge.className = `difficulty-tag ${state.difficulty.toLowerCase()}`;

    // 5. Setup Timers
    clearAllTimers();

    if (state.timerEnabled) {
      dom.timerWidget.style.display = "inline-flex";
      dom.timerWidget.classList.remove("warning");

      if (state.timerMode === "quiz") {
        dom.timerTypeLabel.textContent = "(Whole Quiz)";
        state.globalSecondsRemaining = state.wholeQuizSecondsTotal;
        dom.timerDisplay.textContent = formatTime(state.globalSecondsRemaining);
        startGlobalQuizTimer();
      } else {
        dom.timerTypeLabel.textContent = "(Per Question)";
        state.questionSecondsRemaining = state.perQuestionSecondsTotal;
        dom.timerDisplay.textContent = formatTime(state.questionSecondsRemaining);
        startPerQuestionTimer();
      }
    } else {
      dom.timerWidget.style.display = "none";
    }

    // 6. Build Navigator Grid & Render First Question
    buildNavigatorGrid();
    renderCurrentQuestion();
    switchView("quiz");
  }

  // ==========================================================================
  // 7. Question Navigator
  // ==========================================================================
  function buildNavigatorGrid() {
    dom.questionNavGrid.innerHTML = "";

    state.sessionQuestions.forEach((q, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.textContent = idx + 1;
      btn.dataset.index = idx;
      btn.setAttribute("aria-label", `Jump to Question ${idx + 1}`);

      btn.addEventListener("click", () => {
        navigateToQuestion(idx);
      });

      dom.questionNavGrid.appendChild(btn);
    });

    updateNavigatorStates();
  }

  function updateNavigatorStates() {
    const navButtons = dom.questionNavGrid.querySelectorAll(".nav-btn");
    let answeredCount = 0;

    navButtons.forEach((btn, idx) => {
      const q = state.sessionQuestions[idx];

      btn.classList.remove("current", "answered", "flagged");

      if (idx === state.currentIndex) {
        btn.classList.add("current");
      }

      if (q.isAnswered) {
        btn.classList.add("answered");
        answeredCount++;
      }

      if (q.isFlagged) {
        btn.classList.add("flagged");
      }
    });

    const total = state.sessionQuestions.length;
    dom.questionIndicator.textContent = `Question ${state.currentIndex + 1} of ${total}`;
    dom.answeredStatsBadge.textContent = `${answeredCount} of ${total} Answered`;

    const progressPercent = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
    dom.progressBarFill.style.width = `${progressPercent}%`;
  }

  // ==========================================================================
  // 8. Render Current Question & Options
  // ==========================================================================
  function renderCurrentQuestion() {
    const q = state.sessionQuestions[state.currentIndex];
    const total = state.sessionQuestions.length;

    // Record question start time for speed achievement tracking
    Gamification.questionStartTime = Date.now();

    dom.questionNumTag.textContent = `Question ${state.currentIndex + 1} of ${total} • ${q.difficulty}`;
    dom.questionText.textContent = q.question;

    // Update Flag Button
    if (q.isFlagged) {
      dom.flagBtn.classList.add("flagged");
      dom.flagIcon.textContent = "⚑";
      dom.flagText.textContent = "Flagged";
    } else {
      dom.flagBtn.classList.remove("flagged");
      dom.flagIcon.textContent = "⚐";
      dom.flagText.textContent = "Flag for Review";
    }

    // Build Options (A to D)
    dom.optionsContainer.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    q.shuffledOptions.forEach((optionText, optIdx) => {
      const optBtn = document.createElement("button");
      optBtn.type = "button";
      optBtn.className = "option-btn";
      optBtn.dataset.optionIndex = optIdx;

      const letterBadge = document.createElement("span");
      letterBadge.className = "option-letter";
      letterBadge.textContent = letters[optIdx] || optIdx + 1;

      const textSpan = document.createElement("span");
      textSpan.className = "option-text";
      textSpan.textContent = optionText;

      const statusIcon = document.createElement("span");
      statusIcon.className = "option-status-icon";

      optBtn.appendChild(letterBadge);
      optBtn.appendChild(textSpan);
      optBtn.appendChild(statusIcon);

      if (q.isAnswered) {
        optBtn.disabled = true;

        if (optionText === q.correctAnswer) {
          optBtn.classList.add("correct");
          statusIcon.textContent = "✓";
        } else if (optionText === q.selectedAnswer) {
          optBtn.classList.add("wrong");
          statusIcon.textContent = "✕";
        }
      } else {
        optBtn.addEventListener("click", () => {
          handleSelectAnswer(optionText, optBtn);
        });
      }

      dom.optionsContainer.appendChild(optBtn);
    });

    // Render Explanation Card if question is answered
    if (q.isAnswered) {
      dom.explanationCard.style.display = "block";
      dom.explanationText.textContent = q.explanation;
      if (!q.isCorrect) {
        dom.explanationCard.classList.add("is-wrong");
      } else {
        dom.explanationCard.classList.remove("is-wrong");
      }
    } else {
      dom.explanationCard.style.display = "none";
      dom.explanationCard.classList.remove("is-wrong");
    }

    // Navigation Buttons State
    dom.prevBtn.disabled = state.currentIndex === 0;

    if (state.currentIndex === total - 1) {
      dom.nextBtn.style.display = "none";
      dom.skipBtn.style.display = "none";
    } else {
      dom.nextBtn.style.display = "inline-flex";
      dom.skipBtn.style.display = "inline-flex";
    }

    updateNavigatorStates();

    // Reset Per-Question Timer if active
    if (state.timerEnabled && state.timerMode === "question" && !q.isAnswered) {
      restartPerQuestionTimer();
    }
  }

  // ==========================================================================
  // 9. Answer Selection & Feedback Highlighting (with Gamification XP & Streaks)
  // ==========================================================================
  function handleSelectAnswer(selectedText, clickedButton) {
    const q = state.sessionQuestions[state.currentIndex];
    if (q.isAnswered) return; // Prevent double submit

    const responseTimeSec = (Date.now() - Gamification.questionStartTime) / 1000;
    const isCorrect = selectedText === q.correctAnswer;
    q.selectedAnswer = selectedText;
    q.isAnswered = true;
    q.isCorrect = isCorrect;

    // Handle Streaks & XP
    if (isCorrect) {
      SoundEngine.correct();

      // In-Quiz Streak increment
      Gamification.currentInQuizStreak += 1;
      if (Gamification.currentInQuizStreak > Gamification.state.bestInQuizStreak) {
        Gamification.state.bestInQuizStreak = Gamification.currentInQuizStreak;
      }

      // Check In-Quiz Streak Achievements
      if (Gamification.currentInQuizStreak >= 3) {
        Gamification.unlockAchievement("streak_3");
      }
      if (Gamification.currentInQuizStreak >= 5) {
        Gamification.unlockAchievement("streak_5");
      }

      // Check Speed Demon Achievement (< 5s)
      if (responseTimeSec <= 5.0) {
        Gamification.unlockAchievement("speed_demon");
      }

      // Calculate XP
      const baseXP = q.difficulty === "Hard" ? 25 : (q.difficulty === "Medium" ? 20 : 15);
      const streakBonus = Gamification.currentInQuizStreak >= 2 ? (Gamification.currentInQuizStreak * 5) : 0;
      const speedBonus = responseTimeSec <= 5.0 ? 10 : 0;
      const totalEarned = baseXP + streakBonus + speedBonus;

      Gamification.addXP(totalEarned, `Question ${state.currentIndex + 1} (${q.difficulty}${streakBonus ? " + Streak" : ""})`);

      // Visual feedback: Floating XP and Live Streak Widget
      showFloatingXP(`+${totalEarned} XP!`);

      if (Gamification.currentInQuizStreak >= 2) {
        dom.quizStreakWidget.style.display = "inline-flex";
        dom.quizStreakCount.textContent = Gamification.currentInQuizStreak;
      }
    } else {
      SoundEngine.wrong();
      // Reset in-quiz streak
      Gamification.currentInQuizStreak = 0;
      dom.quizStreakWidget.style.display = "none";
    }

    // Disable all options and show colors
    const optionButtons = dom.optionsContainer.querySelectorAll(".option-btn");
    optionButtons.forEach(btn => {
      btn.disabled = true;
      const text = btn.querySelector(".option-text").textContent;
      const icon = btn.querySelector(".option-status-icon");

      if (text === q.correctAnswer) {
        btn.classList.add("correct");
        icon.textContent = "✓";
      } else if (text === selectedText && !isCorrect) {
        btn.classList.add("wrong");
        icon.textContent = "✕";
      }
    });

    // Show Explanation
    dom.explanationCard.style.display = "block";
    dom.explanationText.textContent = q.explanation;
    if (!isCorrect) {
      dom.explanationCard.classList.add("is-wrong");
    } else {
      dom.explanationCard.classList.remove("is-wrong");
    }

    // Pause question timer on answer
    if (state.questionTimerInterval) {
      clearInterval(state.questionTimerInterval);
    }

    updateNavigatorStates();
  }

  // ==========================================================================
  // 10. Navigation Actions (Next, Prev, Skip, Jump, Flag)
  // ==========================================================================
  function navigateToQuestion(newIndex) {
    if (newIndex >= 0 && newIndex < state.sessionQuestions.length) {
      state.currentIndex = newIndex;
      renderCurrentQuestion();
    }
  }

  function handleNext() {
    if (state.currentIndex < state.sessionQuestions.length - 1) {
      navigateToQuestion(state.currentIndex + 1);
    }
  }

  function handlePrev() {
    if (state.currentIndex > 0) {
      navigateToQuestion(state.currentIndex - 1);
    }
  }

  function handleSkip() {
    showToast("Skipped question. Use the navigator to return anytime.", "⏭️");
    handleNext();
  }

  function toggleFlagCurrentQuestion() {
    const q = state.sessionQuestions[state.currentIndex];
    q.isFlagged = !q.isFlagged;

    if (q.isFlagged) {
      dom.flagBtn.classList.add("flagged");
      dom.flagIcon.textContent = "⚑";
      dom.flagText.textContent = "Flagged";
      showToast(`Question ${state.currentIndex + 1} flagged for review.`, "⚑");
    } else {
      dom.flagBtn.classList.remove("flagged");
      dom.flagIcon.textContent = "⚐";
      dom.flagText.textContent = "Flag for Review";
    }

    updateNavigatorStates();
  }

  // ==========================================================================
  // 11. Timer Logic (Whole Quiz Countdown & Per-Question Countdown)
  // ==========================================================================
  function clearAllTimers() {
    if (state.globalTimerInterval) {
      clearInterval(state.globalTimerInterval);
      state.globalTimerInterval = null;
    }
    if (state.questionTimerInterval) {
      clearInterval(state.questionTimerInterval);
      state.questionTimerInterval = null;
    }
  }

  function startGlobalQuizTimer() {
    if (state.globalTimerInterval) clearInterval(state.globalTimerInterval);

    state.globalTimerInterval = setInterval(() => {
      state.globalSecondsRemaining--;

      if (state.globalSecondsRemaining <= 60) {
        dom.timerWidget.classList.add("warning");
        if (state.globalSecondsRemaining <= 10) {
          SoundEngine.tick();
        }
      }

      dom.timerDisplay.textContent = formatTime(state.globalSecondsRemaining);

      if (state.globalSecondsRemaining <= 0) {
        clearAllTimers();
        showToast("Time is up! Submitting quiz automatically.", "⏰");
        submitQuiz(true);
      }
    }, 1000);
  }

  function startPerQuestionTimer() {
    if (state.questionTimerInterval) clearInterval(state.questionTimerInterval);

    state.questionSecondsRemaining = state.perQuestionSecondsTotal;
    dom.timerDisplay.textContent = formatTime(state.questionSecondsRemaining);
    dom.timerWidget.classList.remove("warning");

    state.questionTimerInterval = setInterval(() => {
      state.questionSecondsRemaining--;

      if (state.questionSecondsRemaining <= 5) {
        dom.timerWidget.classList.add("warning");
        SoundEngine.tick();
      }

      dom.timerDisplay.textContent = formatTime(state.questionSecondsRemaining);

      if (state.questionSecondsRemaining <= 0) {
        clearInterval(state.questionTimerInterval);
        handlePerQuestionTimeout();
      }
    }, 1000);
  }

  function restartPerQuestionTimer() {
    startPerQuestionTimer();
  }

  function handlePerQuestionTimeout() {
    const q = state.sessionQuestions[state.currentIndex];
    if (!q.isAnswered) {
      showToast(`Time ran out for Question ${state.currentIndex + 1}!`, "⌛");
      if (state.currentIndex < state.sessionQuestions.length - 1) {
        handleNext();
      } else {
        submitQuiz(true);
      }
    }
  }

  // ==========================================================================
  // 12. Quiz Submission, Results & Rewards Breakdown
  // ==========================================================================
  function confirmSubmitQuiz() {
    const total = state.sessionQuestions.length;
    const answeredCount = state.sessionQuestions.filter(q => q.isAnswered).length;
    const unansweredCount = total - answeredCount;
    const flaggedCount = state.sessionQuestions.filter(q => q.isFlagged).length;

    let warningText = "Are you ready to submit your quiz?";
    if (unansweredCount > 0 || flaggedCount > 0) {
      const parts = [];
      if (unansweredCount > 0) parts.push(`${unansweredCount} unanswered`);
      if (flaggedCount > 0) parts.push(`${flaggedCount} flagged for review`);
      warningText = `You currently have ${parts.join(" and ")}. Do you still want to finish and view your final results?`;
    }

    showConfirmModal("Submit Quiz?", warningText, () => {
      submitQuiz(false);
    });
  }

  function submitQuiz(forcedByTimer = false) {
    clearAllTimers();
    closeConfirmModal();

    const elapsedSeconds = Math.round((Date.now() - state.quizStartTime) / 1000);
    state.totalElapsedSeconds = elapsedSeconds;

    // Calculate score metrics
    const total = state.sessionQuestions.length;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let anyFlagged = false;

    state.sessionQuestions.forEach(q => {
      if (q.isFlagged) anyFlagged = true;

      if (!q.isAnswered) {
        skippedCount++;
      } else if (q.isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Award Quiz Completion XP Bonuses
    const completionBaseXP = 50;
    Gamification.addXP(completionBaseXP, "Quiz Completion Bonus");

    if (scorePct >= 80) {
      Gamification.addXP(30, "High Score Bonus (≥80%)");
    }
    if (scorePct === 100) {
      Gamification.addXP(100, "Perfect Score Bonus (100%)");
      Gamification.unlockAchievement("perfect_score");
    }

    // Check Post-Quiz Achievements
    Gamification.state.quizzesCompleted += 1;
    Gamification.unlockAchievement("first_quiz");

    if (anyFlagged) {
      Gamification.unlockAchievement("tactician");
    }

    // Polymath Check: Distinct subjects completed
    const currentSubject = state.category === "ALL" ? "Comprehensive" : state.category;
    if (!Gamification.state.subjectsPracticed.includes(currentSubject)) {
      Gamification.state.subjectsPracticed.push(currentSubject);
    }
    if (Gamification.state.subjectsPracticed.length >= 3) {
      Gamification.unlockAchievement("polymath");
    }

    // Check Level Up achievement
    if (Gamification.getLevelInfo().level >= 2) {
      Gamification.unlockAchievement("level_up");
    }

    Gamification.save();

    // Populate Results Screen Metrics
    dom.scorePercentage.textContent = `${scorePct}%`;
    dom.statTotal.textContent = total;
    dom.statCorrect.textContent = correctCount;
    dom.statWrong.textContent = wrongCount;
    dom.statSkipped.textContent = skippedCount;
    dom.statTime.textContent = `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`;

    // Dynamic Verdict Banner
    if (scorePct >= 90) {
      dom.resultsIcon.textContent = "🏆";
      dom.resultsHeading.textContent = "Mastery Achieved!";
      dom.resultsSubheading.textContent = "Exceptional performance! You have a commanding grasp of this topic.";
    } else if (scorePct >= 70) {
      dom.resultsIcon.textContent = "🎉";
      dom.resultsHeading.textContent = "Great Job!";
      dom.resultsSubheading.textContent = "Strong effort! Review the questions you missed to lock in full marks on exam day.";
    } else if (scorePct >= 50) {
      dom.resultsIcon.textContent = "📈";
      dom.resultsHeading.textContent = "Solid Practice Run";
      dom.resultsSubheading.textContent = "You're making good progress. Spend extra time reviewing the detailed explanations below.";
    } else {
      dom.resultsIcon.textContent = "📚";
      dom.resultsHeading.textContent = "Keep Practicing!";
      dom.resultsSubheading.textContent = "Review each explanation carefully and retake the quiz to boost your confidence.";
    }

    // Populate Gamification Rewards Card on Results Screen
    if (dom.resultsTotalXpGained) {
      dom.resultsTotalXpGained.textContent = `+${Gamification.sessionTotalXPGained} XP`;
    }

    if (dom.resultsRewardsBreakdown) {
      dom.resultsRewardsBreakdown.innerHTML = `
        <div class="reward-pill-item">Correct Answers: <strong>+${correctCount * 20} XP</strong></div>
        <div class="reward-pill-item">Quiz Completion: <strong>+50 XP</strong></div>
        ${scorePct >= 80 ? '<div class="reward-pill-item">Mastery Bonus: <strong>+30 XP</strong></div>' : ''}
        ${scorePct === 100 ? '<div class="reward-pill-item">Flawless 100%: <strong>+100 XP</strong></div>' : ''}
        <div class="reward-pill-item">Daily Streak: <strong>${Gamification.state.dailyStreak} Days</strong></div>
      `;
    }

    // Show any newly unlocked achievements this attempt
    if (dom.resultsNewAchievementsContainer && dom.resultsNewAchievementsList) {
      if (Gamification.newlyUnlockedThisQuiz.length > 0) {
        dom.resultsNewAchievementsContainer.style.display = "block";
        dom.resultsNewAchievementsList.innerHTML = "";
        Gamification.newlyUnlockedThisQuiz.forEach(ach => {
          const item = document.createElement("div");
          item.className = "achievement-card unlocked";
          item.style.padding = "10px 14px";
          item.innerHTML = `
            <div class="achieve-icon-box" style="width: 36px; height: 36px; min-width: 36px; font-size: 18px;">${ach.icon}</div>
            <div class="achieve-info">
              <div class="achieve-title" style="font-size: 0.88rem;">${ach.title}</div>
              <div class="achieve-desc" style="font-size: 0.75rem;">${ach.desc}</div>
            </div>
            <div class="achieve-reward-badge">+${ach.reward} XP</div>
          `;
          dom.resultsNewAchievementsList.appendChild(item);
        });
      } else {
        dom.resultsNewAchievementsContainer.style.display = "none";
      }
    }

    SoundEngine.finish();

    // Render Detailed Answer Review
    renderReviewList("all");

    switchView("results");
  }

  // ==========================================================================
  // 13. Detailed Review Section (with Filters)
  // ==========================================================================
  let currentReviewFilter = "all";

  function renderReviewList(filter = "all") {
    currentReviewFilter = filter;
    dom.reviewListContainer.innerHTML = "";

    const countAll = state.sessionQuestions.length;
    const countCorrect = state.sessionQuestions.filter(q => q.isCorrect).length;
    const countIncorrect = state.sessionQuestions.filter(q => q.isAnswered && !q.isCorrect).length;
    const countFlagged = state.sessionQuestions.filter(q => q.isFlagged).length;

    dom.countAll.textContent = countAll;
    dom.countCorrect.textContent = countCorrect;
    dom.countIncorrect.textContent = countIncorrect;
    dom.countFlagged.textContent = countFlagged;

    dom.reviewFilterChips.forEach(chip => {
      chip.classList.toggle("active", chip.dataset.filter === filter);
    });

    const filteredQuestions = state.sessionQuestions.filter((q) => {
      if (filter === "correct") return q.isCorrect;
      if (filter === "incorrect") return q.isAnswered && !q.isCorrect;
      if (filter === "flagged") return q.isFlagged;
      return true;
    });

    if (filteredQuestions.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.style.textAlign = "center";
      emptyMsg.style.color = "var(--text-muted)";
      emptyMsg.style.padding = "24px";
      emptyMsg.textContent = "No questions match this filter.";
      dom.reviewListContainer.appendChild(emptyMsg);
      return;
    }

    filteredQuestions.forEach((q) => {
      const originalIdx = state.sessionQuestions.indexOf(q);
      const itemCard = document.createElement("div");
      itemCard.className = "review-item";

      let badgeClass = "skipped";
      let badgeText = "Skipped / Unanswered";
      if (q.isAnswered) {
        if (q.isCorrect) {
          badgeClass = "correct";
          badgeText = "Correct";
        } else {
          badgeClass = "incorrect";
          badgeText = "Incorrect";
        }
      }

      let flagTag = q.isFlagged ? '<span style="color: var(--warning); margin-left: 6px;">⚑ Flagged</span>' : '';

      itemCard.innerHTML = `
        <div class="review-item-header">
          <span class="review-q-num">Question ${originalIdx + 1} • ${q.difficulty}${flagTag}</span>
          <span class="review-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="review-q-text">${q.question}</div>
        <div class="review-choices">
          <div class="review-choice ${q.isCorrect ? 'was-correct' : (q.selectedAnswer ? 'was-user-wrong' : '')}">
            <span>Your Answer:</span>
            <strong>${q.selectedAnswer || '(No answer provided)'}</strong>
          </div>
          ${!q.isCorrect ? `
          <div class="review-choice was-correct">
            <span>Correct Answer:</span>
            <strong>${q.correctAnswer}</strong>
          </div>` : ''}
        </div>
        <div class="review-explanation">
          <strong>💡 Explanation:</strong> ${q.explanation}
        </div>
      `;

      dom.reviewListContainer.appendChild(itemCard);
    });
  }

  // ==========================================================================
  // 14. Event Listeners & Binding
  // ==========================================================================
  function initEventListeners() {
    // Brand & Header Navigation
    dom.brandHomeLink.addEventListener("click", (e) => {
      e.preventDefault();
      handleGoHomeWithConfirm();
    });

    dom.headerHomeBtn.addEventListener("click", () => {
      handleGoHomeWithConfirm();
    });

    // Sound Toggle
    dom.soundToggleBtn.addEventListener("click", () => {
      SoundEngine.enabled = !SoundEngine.enabled;
      dom.soundToggleBtn.textContent = SoundEngine.enabled ? "🔊" : "🔇";
      showToast(SoundEngine.enabled ? "Sound effects enabled" : "Sound effects muted");
    });

    // Gamification Modal Triggers
    if (dom.headerXpBadge) dom.headerXpBadge.addEventListener("click", openAchievementsModal);
    if (dom.headerStreakBadge) dom.headerStreakBadge.addEventListener("click", openAchievementsModal);
    if (dom.headerAchievementsBtn) dom.headerAchievementsBtn.addEventListener("click", openAchievementsModal);
    if (dom.hubViewAchievementsBtn) dom.hubViewAchievementsBtn.addEventListener("click", openAchievementsModal);
    if (dom.achievementsModalCloseBtn) dom.achievementsModalCloseBtn.addEventListener("click", closeAchievementsModal);

    // Category Select Sync with Quick Cards
    dom.categorySelect.addEventListener("change", (e) => {
      state.category = e.target.value;
      dom.quickCategoryCards.forEach(card => {
        card.classList.toggle("selected", card.dataset.cat === state.category);
      });
    });

    dom.quickCategoryCards.forEach(card => {
      card.addEventListener("click", () => {
        const cat = card.dataset.cat;
        state.category = cat;
        dom.categorySelect.value = cat;
        dom.quickCategoryCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
      });
    });

    // Difficulty Segmented Control
    dom.difficultyBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        dom.difficultyBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.difficulty = btn.dataset.difficulty;
      });
    });

    // Timer Toggle Switch
    dom.timerToggle.addEventListener("change", (e) => {
      state.timerEnabled = e.target.checked;
      dom.timerOptionsContainer.classList.toggle("visible", state.timerEnabled);
    });

    // Timer Mode Radios
    dom.timerModeRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        state.timerMode = e.target.value;
      });
    });

    // Whole Quiz Minutes dropdown
    dom.wholeQuizMinutes.addEventListener("change", (e) => {
      state.wholeQuizSecondsTotal = parseInt(e.target.value, 10) * 60;
    });

    // Per Question Seconds dropdown
    dom.perQuestionSeconds.addEventListener("change", (e) => {
      state.perQuestionSecondsTotal = parseInt(e.target.value, 10);
    });

    // Form Start Quiz
    dom.quizConfigForm.addEventListener("submit", (e) => {
      e.preventDefault();
      startQuiz();
    });

    // Quiz Navigation Buttons
    dom.nextBtn.addEventListener("click", handleNext);
    dom.prevBtn.addEventListener("click", handlePrev);
    dom.skipBtn.addEventListener("click", handleSkip);
    dom.flagBtn.addEventListener("click", toggleFlagCurrentQuestion);
    dom.submitQuizBtn.addEventListener("click", confirmSubmitQuiz);

    dom.quitQuizBtn.addEventListener("click", () => {
      showConfirmModal("Quit Quiz?", "Your current practice progress will not be saved. Are you sure you want to return to the home screen?", () => {
        clearAllTimers();
        closeConfirmModal();
        switchView("home");
      });
    });

    // Results Actions
    dom.retakeQuizBtn.addEventListener("click", () => {
      startQuiz();
    });

    dom.changeTopicBtn.addEventListener("click", () => {
      switchView("home");
    });

    // Review Filters
    dom.reviewFilterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        renderReviewList(chip.dataset.filter);
      });
    });

    // Confirm Modal Actions
    dom.modalCancelBtn.addEventListener("click", closeConfirmModal);
    dom.modalConfirmBtn.addEventListener("click", () => {
      if (typeof state.pendingConfirmAction === "function") {
        state.pendingConfirmAction();
      }
    });

    // Close Modals on Overlay Click
    window.addEventListener("click", (e) => {
      if (e.target === dom.achievementsModal) {
        closeAchievementsModal();
      }
      if (e.target === dom.confirmModal) {
        closeConfirmModal();
      }
    });

    // Keyboard Shortcuts for Students
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAchievementsModal();
        closeConfirmModal();
        return;
      }

      if (!dom.quizView.classList.contains("active") || dom.confirmModal.classList.contains("open") || dom.achievementsModal.classList.contains("open")) {
        return;
      }

      const key = e.key.toUpperCase();
      const optionMap = { "1": 0, "A": 0, "2": 1, "B": 1, "3": 2, "C": 2, "4": 3, "D": 3 };
      if (key in optionMap) {
        const optionButtons = dom.optionsContainer.querySelectorAll(".option-btn");
        const idx = optionMap[key];
        if (optionButtons[idx] && !optionButtons[idx].disabled) {
          optionButtons[idx].click();
        }
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (key === "F") {
        toggleFlagCurrentQuestion();
      }
    });
  }

  function handleGoHomeWithConfirm() {
    if (dom.quizView.classList.contains("active")) {
      showConfirmModal("Leave Quiz?", "Are you sure you want to return to the home screen? Your current quiz session will be lost.", () => {
        clearAllTimers();
        closeConfirmModal();
        switchView("home");
      });
    } else {
      switchView("home");
    }
  }

  // ==========================================================================
  // 15. Initialize App
  // ==========================================================================
  function init() {
    initEventListeners();
    Gamification.load();
    if (window.QUESTION_BANK) {
      console.log(`Loaded ${window.QUESTION_BANK.length} practice questions.`);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
