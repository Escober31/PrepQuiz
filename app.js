/**
 * PrepQuiz - Learning Adventure Dashboard & Quiz Application
 * Matches the reference design with Curriculum Subject Tracking,
 * Multi-Lesson Mastery, Timers, Synthesized Sound Effects, and Gamification.
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. Audio Synthesis Engine (Pure Web Audio API)
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
        console.warn("Audio playback error:", err);
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

    finish() {
      this.playTone(440, "sine", 0.1, 0);
      this.playTone(554.37, "sine", 0.1, 0.09);
      this.playTone(659.25, "sine", 0.15, 0.18);
      this.playTone(880, "sine", 0.35, 0.27);
    },

    achievement() {
      this.playTone(587.33, "sine", 0.12, 0);
      this.playTone(739.99, "sine", 0.12, 0.1);
      this.playTone(880.00, "sine", 0.15, 0.2);
      this.playTone(1174.66, "sine", 0.35, 0.3);
    }
  };

  // ==========================================================================
  // 2. Achievements Catalog & Gamification Engine
  // ==========================================================================
  const ACHIEVEMENTS_CATALOG = [
    { id: "first_quiz", title: "First Step", desc: "Complete your first lesson quiz", icon: "🌟", reward: 50 },
    { id: "streak_3", title: "Hot Streak", desc: "Answer 3 questions correctly in a row", icon: "🔥", reward: 30 },
    { id: "streak_5", title: "Sharpshooter", desc: "Answer 5 questions correctly in a row", icon: "🎯", reward: 60 },
    { id: "speed_demon", title: "Speed Demon", desc: "Answer any question correctly in under 5 seconds", icon: "⚡", reward: 40 },
    { id: "perfect_score", title: "Flawless Victory", desc: "Score 100% on any practice lesson", icon: "💯", reward: 100 },
    { id: "polymath", title: "Renaissance Scholar", desc: "Complete lessons in at least 3 distinct subjects", icon: "🌐", reward: 75 },
    { id: "tactician", title: "Strategic Review", desc: "Flag a question and complete your quiz", icon: "⚑", reward: 35 },
    { id: "master_points", title: "Scholar Prodigy", desc: "Accumulate 200 total learning points", icon: "🏆", reward: 80 }
  ];

  // Subject metadata definitions matching the screenshot
  const SUBJECTS_CONFIG = {
    "Mathematics": {
      totalLessons: 2,
      colorClass: "bg-blue",
      iconChar: "📐",
      lessons: [
        { id: 1, title: "Lesson 1: Algebra & Geometry Fundamentals", desc: "Linear equations, triangles & percentage discounts" },
        { id: 2, title: "Lesson 2: Advanced Problem Solving", desc: "Quadratics, Pythagoras, probability & logarithms" }
      ]
    },
    "English": {
      totalLessons: 1,
      colorClass: "bg-emerald",
      iconChar: "📖",
      lessons: [
        { id: 1, title: "Lesson 1: Grammar, Syntax & Literary Devices", desc: "Parts of speech, agreement, passive voice & rhetorical devices" }
      ]
    },
    "Science": {
      totalLessons: 1,
      colorClass: "bg-purple",
      iconChar: "⚛️",
      lessons: [
        { id: 1, title: "Lesson 1: Earth, Climate & Ecosystems", desc: "Atmosphere, greenhouse gases, transpiration & keystone species" }
      ]
    },
    "Physics": {
      totalLessons: 1,
      colorClass: "bg-rose",
      iconChar: "🧲",
      lessons: [
        { id: 1, title: "Lesson 1: Mechanics, Energy & Waves", desc: "Newton's laws, light velocity, kinetic energy & thermodynamics" }
      ]
    },
    "Chemistry": {
      totalLessons: 1,
      colorClass: "bg-orange",
      iconChar: "🧪",
      lessons: [
        { id: 1, title: "Lesson 1: Atoms, Bonds & Reactions", desc: "Periodic elements, pH scale, covalent bonds & redox oxidation" }
      ]
    },
    "Biology": {
      totalLessons: 1,
      colorClass: "bg-teal",
      iconChar: "🔬",
      lessons: [
        { id: 1, title: "Lesson 1: Cell Biology & Genetics", desc: "Mitochondria, fluid mosaic model, meiosis & DNA base pairing" }
      ]
    },
    "Computing": {
      totalLessons: 1,
      colorClass: "bg-indigo",
      iconChar: "💻",
      lessons: [
        { id: 1, title: "Lesson 1: Data Structures & Algorithms", desc: "Boolean logic, stacks, binary search trees & event loop" }
      ]
    }
  };

  const Gamification = {
    STORAGE_KEY: "prepmaster_progress_v3",

    state: {
      totalPoints: 0,
      dailyStreak: 0,
      lastActiveDate: null,
      todayLessonsCompleted: 0,
      dailyGoal: 1,
      completedLessons: {
        "Mathematics": [],
        "English": [],
        "Science": [],
        "Physics": [],
        "Chemistry": [],
        "Biology": [],
        "Computing": []
      },
      unlockedAchievements: {}
    },

    // Session tracking
    currentInQuizStreak: 0,
    sessionPointsGained: 0,
    sessionPointsBreakdown: [],
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
      this.updateDailyDateCheck();
      this.save();
      this.updateDashboardUI();
    },

    save() {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      } catch (err) {
        console.warn("Could not save gamification state:", err);
      }
    },

    updateDailyDateCheck() {
      const today = new Date().toISOString().slice(0, 10);
      if (!this.state.lastActiveDate) {
        this.state.lastActiveDate = today;
        return;
      }

      if (this.state.lastActiveDate !== today) {
        const lastDate = new Date(this.state.lastActiveDate);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Continuous day
        } else if (diffDays > 1) {
          this.state.dailyStreak = 0;
        }
        this.state.todayLessonsCompleted = 0; // Reset daily lessons completed on a new day
        this.state.lastActiveDate = today;
      }
    },

    recordLessonCompletion(subject, lessonId) {
      this.updateDailyDateCheck();

      // Ensure streak is at least 1 when completing a lesson
      if (this.state.dailyStreak === 0) {
        this.state.dailyStreak = 1;
      }

      this.state.todayLessonsCompleted += 1;

      if (!this.state.completedLessons[subject]) {
        this.state.completedLessons[subject] = [];
      }
      if (!this.state.completedLessons[subject].includes(lessonId)) {
        this.state.completedLessons[subject].push(lessonId);
      }

      this.save();
      this.updateDashboardUI();
    },

    getTotalCompletedLessonsCount() {
      let count = 0;
      Object.keys(SUBJECTS_CONFIG).forEach(subj => {
        const done = this.state.completedLessons[subj] || [];
        count += done.length;
      });
      return count;
    },

    addPoints(amount, label = "Practice Bonus") {
      this.state.totalPoints += amount;
      this.sessionPointsGained += amount;
      this.sessionPointsBreakdown.push({ label, amount });

      if (this.state.totalPoints >= 200) {
        this.unlockAchievement("master_points");
      }

      this.save();
      this.updateDashboardUI();
    },

    unlockAchievement(id) {
      if (this.state.unlockedAchievements[id]) return;

      const item = ACHIEVEMENTS_CATALOG.find(a => a.id === id);
      if (!item) return;

      this.state.unlockedAchievements[id] = new Date().toISOString();
      this.newlyUnlockedThisQuiz.push(item);

      this.addPoints(item.reward, `Achievement: ${item.title}`);
      SoundEngine.achievement();
      showToast(`🏆 Achievement Unlocked: ${item.title} (+${item.reward} XP)!`, item.icon);

      this.save();
      this.updateDashboardUI();
    },

    updateDashboardUI() {
      // 1. Time-based dynamic greeting
      const hour = new Date().getHours();
      let greeting = "Good afternoon!";
      if (hour < 12) greeting = "Good morning!";
      else if (hour >= 18) greeting = "Good evening!";
      if (dom.greetingHeading) dom.greetingHeading.textContent = greeting;

      // 2. Top Header Badges
      if (dom.headerStreakVal) dom.headerStreakVal.textContent = this.state.dailyStreak;
      if (dom.headerXpVal) dom.headerXpVal.textContent = this.state.totalPoints;

      // 3. 4 Metrics Cards
      if (dom.metricPointsVal) dom.metricPointsVal.textContent = this.state.totalPoints;
      if (dom.metricStreakVal) dom.metricStreakVal.textContent = `${this.state.dailyStreak} day${this.state.dailyStreak === 1 ? "" : "s"}`;
      
      const totalCompleted = this.getTotalCompletedLessonsCount();
      if (dom.metricLessonsVal) dom.metricLessonsVal.textContent = `${totalCompleted}/8`;
      if (dom.metricTodayVal) dom.metricTodayVal.textContent = this.state.todayLessonsCompleted;

      // 4. Update each of the 7 Subject Cards
      Object.keys(SUBJECTS_CONFIG).forEach(subj => {
        const config = SUBJECTS_CONFIG[subj];
        const completedArr = this.state.completedLessons[subj] || [];
        const completedCount = completedArr.length;
        const total = config.totalLessons;
        const percent = Math.min(100, Math.round((completedCount / total) * 100));

        const prefix = subj.toLowerCase().slice(0, 4);
        const statusEl = document.getElementById(`${prefix}-status-text`) || 
                         (subj === "Mathematics" ? document.getElementById("math-status-text") :
                          subj === "English" ? document.getElementById("eng-status-text") :
                          subj === "Science" ? document.getElementById("sci-status-text") :
                          subj === "Physics" ? document.getElementById("phys-status-text") :
                          subj === "Chemistry" ? document.getElementById("chem-status-text") :
                          subj === "Biology" ? document.getElementById("bio-status-text") :
                          document.getElementById("comp-status-text"));

        const fillEl = document.getElementById(`${prefix}-progress-fill`) ||
                       (subj === "Mathematics" ? document.getElementById("math-progress-fill") :
                        subj === "English" ? document.getElementById("eng-progress-fill") :
                        subj === "Science" ? document.getElementById("sci-progress-fill") :
                        subj === "Physics" ? document.getElementById("phys-progress-fill") :
                        subj === "Chemistry" ? document.getElementById("chem-progress-fill") :
                        subj === "Biology" ? document.getElementById("bio-progress-fill") :
                        document.getElementById("comp-progress-fill"));

        const pctEl = document.getElementById(`${prefix}-progress-pct`) ||
                      (subj === "Mathematics" ? document.getElementById("math-progress-pct") :
                       subj === "English" ? document.getElementById("eng-progress-pct") :
                       subj === "Science" ? document.getElementById("sci-progress-pct") :
                       subj === "Physics" ? document.getElementById("phys-progress-pct") :
                       subj === "Chemistry" ? document.getElementById("chem-progress-pct") :
                       subj === "Biology" ? document.getElementById("bio-progress-pct") :
                       document.getElementById("comp-progress-pct"));

        if (statusEl) statusEl.textContent = `${completedCount} of ${total} lesson${total > 1 ? "s" : ""} completed`;
        if (fillEl) fillEl.style.width = `${percent}%`;
        if (pctEl) pctEl.textContent = `${percent}% complete`;
      });

      // 5. Daily Goal progress in modal
      if (dom.goalProgressText) {
        dom.goalProgressText.textContent = `${this.state.todayLessonsCompleted} / ${this.state.dailyGoal} Completed`;
      }
      if (dom.goalProgressFill) {
        const goalPct = Math.min(100, Math.round((this.state.todayLessonsCompleted / (this.state.dailyGoal || 1)) * 100));
        dom.goalProgressFill.style.width = `${goalPct}%`;
      }
    },

    renderAchievementsModal() {
      if (!dom.achievementsListModal) return;
      dom.achievementsListModal.innerHTML = "";
      const unlockedCount = Object.keys(this.state.unlockedAchievements).length;
      if (dom.modalAchievementsUnlockedCount) dom.modalAchievementsUnlockedCount.textContent = unlockedCount;

      ACHIEVEMENTS_CATALOG.forEach(ach => {
        const isUnlocked = Boolean(this.state.unlockedAchievements[ach.id]);
        const card = document.createElement("div");
        card.className = `achievement-card ${isUnlocked ? "unlocked" : "locked"}`;

        const statusText = isUnlocked 
          ? `✓ Unlocked • +${ach.reward} XP` 
          : `🔒 Locked • Reward: +${ach.reward} XP`;

        card.innerHTML = `
          <div class="achieve-icon-box">${ach.icon}</div>
          <div class="achieve-info">
            <div class="achieve-title">
              ${ach.title}
              ${isUnlocked ? '<span style="font-size: 0.75rem; color: #16a34a; font-weight: 800;">✓</span>' : ''}
            </div>
            <div class="achieve-desc">${ach.desc}</div>
            <div class="achieve-meta">${statusText}</div>
          </div>
          <div class="achieve-reward-badge">+${ach.reward} XP</div>
        `;
        dom.achievementsListModal.appendChild(card);
      });
    },

    renderLeaderboardModal() {
      if (!dom.leaderboardListItems) return;
      dom.leaderboardListItems.innerHTML = "";

      const users = [
        { rank: 1, name: "Elena Rostova", points: 840, avatar: "👩‍🎓", isUser: false },
        { rank: 2, name: "Marcus Chen", points: 620, avatar: "👨‍💻", isUser: false },
        { rank: 3, name: "You (Scholar)", points: this.state.totalPoints, avatar: "🤖", isUser: true },
        { rank: 4, name: "Sophia Alvarez", points: 310, avatar: "🔬", isUser: false },
        { rank: 5, name: "Liam O'Connor", points: 190, avatar: "📚", isUser: false }
      ];

      // Sort dynamic users
      users.sort((a, b) => b.points - a.points);
      users.forEach((u, idx) => {
        u.rank = idx + 1;
        const row = document.createElement("div");
        row.className = `leaderboard-row ${u.isUser ? "current-user" : ""}`;
        row.innerHTML = `
          <div class="rank-badge rank-${u.rank <= 3 ? u.rank : 'n'}">#${u.rank}</div>
          <div class="leader-avatar">${u.avatar}</div>
          <div class="leader-name">${u.name} ${u.isUser ? '<span style="font-size: 0.72rem; color: #2563eb; font-weight: 700;">(You)</span>' : ''}</div>
          <div class="leader-points">${u.points} XP</div>
        `;
        dom.leaderboardListItems.appendChild(row);
      });
    }
  };

  // ==========================================================================
  // 3. Application State
  // ==========================================================================
  const state = {
    // Current Setup
    subject: "Mathematics",
    lesson: 1,
    difficulty: "ALL",
    timerMode: "5min", // "5min" | "perQuestion" | "none"

    // Active Quiz Session
    sessionQuestions: [],
    currentIndex: 0,
    quizStartTime: null,
    totalElapsedSeconds: 0,

    // Timers
    globalTimerInterval: null,
    globalSecondsRemaining: 300,
    questionTimerInterval: null,
    questionSecondsRemaining: 30,

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
    insightsView: document.getElementById("insights-view"),

    // Global Top Navigation & Insights View Switchers
    navBtnPractice: document.getElementById("nav-btn-practice"),
    navBtnInsights: document.getElementById("nav-btn-insights"),
    btnQuickInsights: document.getElementById("btn-quick-insights"),
    railBtnPractice: document.getElementById("rail-btn-practice"),
    railIconBtns: document.querySelectorAll(".insights-nav-rail .rail-icon-btn"),
    insightsTabBtns: document.querySelectorAll(".insights-tab-btn"),
    insightsDateDisplay: document.getElementById("insights-date-display"),
    insightsSearchBtn: document.querySelector(".insights-search-btn"),
    insightsTargetPct: document.getElementById("insights-target-pct"),
    insightsMasteryHours: document.getElementById("insights-mastery-hours"),

    // Dashboard Header
    greetingHeading: document.getElementById("greeting-heading"),
    headerStreakBadge: document.getElementById("header-streak-badge"),
    headerStreakVal: document.getElementById("header-streak-val"),
    headerXpBadge: document.getElementById("header-xp-badge"),
    headerXpVal: document.getElementById("header-xp-val"),
    soundToggleBtn: document.getElementById("sound-toggle-btn"),

    // Top Metric Cards
    metricPointsVal: document.getElementById("metric-points-val"),
    metricStreakVal: document.getElementById("metric-streak-val"),
    metricLessonsVal: document.getElementById("metric-lessons-val"),
    metricTodayVal: document.getElementById("metric-today-val"),

    // Subject Cards
    subjectCards: document.querySelectorAll(".subject-card"),

    // Quick Actions
    btnQuickAchievements: document.getElementById("btn-quick-achievements"),
    btnQuickGoal: document.getElementById("btn-quick-goal"),
    btnQuickPractice: document.getElementById("btn-quick-practice"),
    btnQuickLeaderboard: document.getElementById("btn-quick-leaderboard"),

    // Subject Launcher Modal
    subjectModal: document.getElementById("subject-modal"),
    subjectModalCloseBtn: document.getElementById("subject-modal-close-btn"),
    modalSubjectTitle: document.getElementById("modal-subject-title"),
    modalSubjectDesc: document.getElementById("modal-subject-desc"),
    modalSubjectIconBox: document.getElementById("modal-subject-icon-box"),
    modalLessonPicker: document.getElementById("modal-lesson-picker"),
    difficultyBtns: document.querySelectorAll("#difficulty-control .segment-btn"),
    modalTimerModeRadios: document.querySelectorAll(".timer-card-opt"),
    modalCancelLaunchBtn: document.getElementById("modal-cancel-launch-btn"),
    modalStartQuizBtn: document.getElementById("modal-start-quiz-btn"),

    // Achievements Modal
    achievementsModal: document.getElementById("achievements-modal"),
    achievementsModalCloseBtn: document.getElementById("achievements-modal-close-btn"),
    modalAchievementsUnlockedCount: document.getElementById("modal-achievements-unlocked-count"),
    achievementsListModal: document.getElementById("achievements-list-modal"),

    // Goal Modal
    goalModal: document.getElementById("goal-modal"),
    goalModalCloseBtn: document.getElementById("goal-modal-close-btn"),
    goalOptionsContainer: document.getElementById("goal-options-container"),
    goalProgressText: document.getElementById("goal-progress-text"),
    goalProgressFill: document.getElementById("goal-progress-fill"),
    goalSaveBtn: document.getElementById("goal-save-btn"),

    // Leaderboard Modal
    leaderboardModal: document.getElementById("leaderboard-modal"),
    leaderboardModalCloseBtn: document.getElementById("leaderboard-modal-close-btn"),
    leaderboardListItems: document.getElementById("leaderboard-list-items"),

    // Confirm Quit Modal
    confirmModal: document.getElementById("confirm-modal"),
    modalCloseX: document.getElementById("modal-close-x"),
    modalTitle: document.getElementById("modal-title"),
    modalBody: document.getElementById("modal-body"),
    modalCancelBtn: document.getElementById("modal-cancel-btn"),
    modalConfirmBtn: document.getElementById("modal-confirm-btn"),

    // Toast
    toast: document.getElementById("toast"),
    toastIcon: document.getElementById("toast-icon"),
    toastText: document.getElementById("toast-text"),

    // Active Quiz View Elements
    quizSubjectIconBox: document.getElementById("quiz-subject-icon-box"),
    quizCategoryBadge: document.getElementById("quiz-category-badge"),
    quizLessonSubtitle: document.getElementById("quiz-lesson-subtitle"),
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

    // Results Elements
    resultsIcon: document.getElementById("results-icon"),
    resultsHeading: document.getElementById("results-heading"),
    resultsSubheading: document.getElementById("results-subheading"),
    scorePercentage: document.getElementById("score-percentage"),
    statTotal: document.getElementById("stat-total"),
    statCorrect: document.getElementById("stat-correct"),
    statWrong: document.getElementById("stat-wrong"),
    statSkipped: document.getElementById("stat-skipped"),
    statTime: document.getElementById("stat-time"),
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
    countFlagged: document.getElementById("count-flagged")
  };

  // ==========================================================================
  // 5. Utility Functions (Shuffle, Format, Toasts)
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
    }, 1200);
  }

  function switchView(viewName) {
    dom.homeView.classList.remove("active");
    dom.quizView.classList.remove("active");
    dom.resultsView.classList.remove("active");
    if (dom.insightsView) dom.insightsView.classList.remove("active");

    if (dom.navBtnPractice) dom.navBtnPractice.classList.remove("active");
    if (dom.navBtnInsights) dom.navBtnInsights.classList.remove("active");

    if (viewName === "home") {
      dom.homeView.classList.add("active");
      if (dom.navBtnPractice) dom.navBtnPractice.classList.add("active");
      Gamification.updateDashboardUI();
    } else if (viewName === "insights") {
      if (dom.insightsView) dom.insightsView.classList.add("active");
      if (dom.navBtnInsights) dom.navBtnInsights.classList.add("active");
      updateInsightsUI();
    } else if (viewName === "quiz") {
      dom.quizView.classList.add("active");
    } else if (viewName === "results") {
      dom.resultsView.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateInsightsUI() {
    if (dom.insightsDateDisplay) {
      const now = new Date();
      const options = { weekday: "short", day: "numeric", month: "short" };
      dom.insightsDateDisplay.textContent = now.toLocaleDateString("en-US", options);
    }
    if (Gamification.state.totalPoints > 0 && dom.insightsMasteryHours) {
      const hours = (24.50 + (Gamification.state.totalPoints * 0.05)).toFixed(2);
      dom.insightsMasteryHours.textContent = hours;
    }
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

  // ==========================================================================
  // 6. Subject Launcher Modal Setup & Customization
  // ==========================================================================
  function openSubjectLauncherModal(subjectName) {
    state.subject = subjectName;
    const config = SUBJECTS_CONFIG[subjectName];
    if (!config) return;

    dom.modalSubjectTitle.textContent = subjectName;
    dom.modalSubjectIconBox.textContent = config.iconChar;
    dom.modalSubjectIconBox.className = `subject-modal-badge ${config.colorClass}`;
    dom.modalSubjectDesc.textContent = `Choose lesson module (${config.totalLessons} available)`;

    // Render Lesson Module Options
    dom.modalLessonPicker.innerHTML = "";
    config.lessons.forEach((l, idx) => {
      const card = document.createElement("div");
      card.className = `lesson-opt-card ${idx === 0 ? "selected" : ""}`;
      card.dataset.lessonId = l.id;
      card.innerHTML = `
        <div style="font-size: 1.1rem;">📝</div>
        <div>
          <div class="lesson-opt-title">${l.title}</div>
          <div class="lesson-opt-desc">${l.desc}</div>
        </div>
      `;

      card.addEventListener("click", () => {
        dom.modalLessonPicker.querySelectorAll(".lesson-opt-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        state.lesson = l.id;
      });

      dom.modalLessonPicker.appendChild(card);
    });

    state.lesson = config.lessons[0].id;
    dom.subjectModal.classList.add("open");
  }

  function closeSubjectLauncherModal() {
    dom.subjectModal.classList.remove("open");
  }

  // ==========================================================================
  // 7. Quiz Initiation & Session Setup
  // ==========================================================================
  function startQuiz() {
    closeSubjectLauncherModal();

    // 1. Filter Questions from Question Bank
    let pool = window.QUESTION_BANK || [];

    // Filter by subject
    pool = pool.filter(q => q.subject === state.subject || q.category === state.subject);

    // Filter by lesson
    if (state.lesson) {
      const lessonPool = pool.filter(q => q.lesson === state.lesson);
      if (lessonPool.length > 0) {
        pool = lessonPool;
      }
    }

    // Filter by difficulty if specific level requested
    if (state.difficulty !== "ALL") {
      const diffPool = pool.filter(q => q.difficulty === state.difficulty);
      if (diffPool.length > 0) {
        pool = diffPool;
      }
    }

    if (pool.length === 0) {
      showToast("No questions found for this configuration. Loading all available questions for this subject.", "⚠️");
      pool = (window.QUESTION_BANK || []).filter(q => q.subject === state.subject);
    }

    // 2. Randomize Question Order
    const shuffledQuestionPool = shuffleArray(pool);

    // 3. For each question, randomize options A to D
    state.sessionQuestions = shuffledQuestionPool.map(q => {
      const shuffledOptions = shuffleArray(q.options);
      return {
        originalId: q.id,
        subject: q.subject || state.subject,
        category: q.category || state.subject,
        lesson: q.lesson || state.lesson,
        difficulty: q.difficulty,
        question: q.question,
        shuffledOptions: shuffledOptions,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        selectedAnswer: null,
        isAnswered: false,
        isCorrect: false,
        isFlagged: false
      };
    });

    state.currentIndex = 0;
    state.quizStartTime = Date.now();
    state.totalElapsedSeconds = 0;

    // Reset In-Quiz Gamification
    Gamification.currentInQuizStreak = 0;
    Gamification.sessionPointsGained = 0;
    Gamification.sessionPointsBreakdown = [];
    Gamification.newlyUnlockedThisQuiz = [];
    dom.quizStreakWidget.style.display = "none";
    dom.quizStreakCount.textContent = "0";

    // 4. Update Quiz Header Meta
    const config = SUBJECTS_CONFIG[state.subject] || { iconChar: "📚", colorClass: "bg-blue" };
    dom.quizSubjectIconBox.textContent = config.iconChar;
    dom.quizSubjectIconBox.className = `quiz-subject-mini-icon ${config.colorClass}`;
    dom.quizCategoryBadge.textContent = state.subject;
    dom.quizLessonSubtitle.textContent = `Lesson ${state.lesson}: Practice Mode`;
    dom.quizDifficultyBadge.textContent = state.difficulty === "ALL" ? "All Levels" : state.difficulty;
    dom.quizDifficultyBadge.className = `difficulty-tag ${state.difficulty.toLowerCase()}`;

    // 5. Setup Timers
    clearAllTimers();

    if (state.timerMode === "none") {
      dom.timerWidget.style.display = "none";
    } else {
      dom.timerWidget.style.display = "inline-flex";
      dom.timerWidget.classList.remove("warning");

      if (state.timerMode === "5min") {
        dom.timerTypeLabel.textContent = "(5m Quiz)";
        state.globalSecondsRemaining = 300;
        dom.timerDisplay.textContent = formatTime(state.globalSecondsRemaining);
        startGlobalQuizTimer();
      } else {
        dom.timerTypeLabel.textContent = "(30s / Q)";
        state.questionSecondsRemaining = 30;
        dom.timerDisplay.textContent = formatTime(state.questionSecondsRemaining);
        startPerQuestionTimer();
      }
    }

    // 6. Build Navigation Grid and Render Question
    buildNavigatorGrid();
    renderCurrentQuestion();
    switchView("quiz");
  }

  // ==========================================================================
  // 8. Timers Logic
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
    state.globalTimerInterval = setInterval(() => {
      state.globalSecondsRemaining -= 1;
      dom.timerDisplay.textContent = formatTime(state.globalSecondsRemaining);

      if (state.globalSecondsRemaining <= 30) {
        dom.timerWidget.classList.add("warning");
      }

      if (state.globalSecondsRemaining <= 0) {
        clearAllTimers();
        showToast("⏰ Time is up! Submitting your practice quiz...", "⏱️");
        finishAndSubmitQuiz();
      }
    }, 1000);
  }

  function startPerQuestionTimer() {
    state.questionSecondsRemaining = 30;
    dom.timerDisplay.textContent = formatTime(state.questionSecondsRemaining);
    dom.timerWidget.classList.remove("warning");

    if (state.questionTimerInterval) clearInterval(state.questionTimerInterval);

    state.questionTimerInterval = setInterval(() => {
      state.questionSecondsRemaining -= 1;
      dom.timerDisplay.textContent = formatTime(state.questionSecondsRemaining);

      if (state.questionSecondsRemaining <= 5) {
        dom.timerWidget.classList.add("warning");
      }

      if (state.questionSecondsRemaining <= 0) {
        clearInterval(state.questionTimerInterval);
        showToast("Question time expired! Moving to the next question.", "⏱️");
        goToNextQuestion();
      }
    }, 1000);
  }

  // ==========================================================================
  // 9. Question Rendering & Navigator
  // ==========================================================================
  function buildNavigatorGrid() {
    dom.questionNavGrid.innerHTML = "";
    state.sessionQuestions.forEach((q, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-num-btn";
      btn.textContent = index + 1;
      btn.title = `Go to Question ${index + 1}`;
      btn.addEventListener("click", () => {
        saveCurrentQuestionTimerState();
        state.currentIndex = index;
        renderCurrentQuestion();
      });
      dom.questionNavGrid.appendChild(btn);
    });
    updateNavigatorUI();
  }

  function updateNavigatorUI() {
    const buttons = dom.questionNavGrid.querySelectorAll(".nav-num-btn");
    let answeredCount = 0;

    buttons.forEach((btn, index) => {
      const q = state.sessionQuestions[index];
      btn.classList.remove("current", "answered", "flagged");

      if (index === state.currentIndex) {
        btn.classList.add("current");
      }
      if (q.isAnswered) {
        btn.classList.add("answered");
        answeredCount += 1;
      }
      if (q.isFlagged) {
        btn.classList.add("flagged");
      }
    });

    const total = state.sessionQuestions.length;
    dom.questionIndicator.textContent = `Question ${state.currentIndex + 1} of ${total}`;
    dom.answeredStatsBadge.textContent = `${answeredCount} of ${total} Answered`;

    const progressPct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
    dom.progressBarFill.style.width = `${progressPct}%`;
  }

  function renderCurrentQuestion() {
    const total = state.sessionQuestions.length;
    if (state.currentIndex < 0 || state.currentIndex >= total) return;

    const currentQ = state.sessionQuestions[state.currentIndex];
    Gamification.questionStartTime = Date.now();

    dom.questionNumTag.textContent = `Question ${state.currentIndex + 1} of ${total} • ${currentQ.difficulty}`;
    dom.questionText.textContent = currentQ.question;

    // Flag button state
    if (currentQ.isFlagged) {
      dom.flagBtn.classList.add("flagged");
      dom.flagIcon.textContent = "⚑";
      dom.flagText.textContent = "Flagged";
    } else {
      dom.flagBtn.classList.remove("flagged");
      dom.flagIcon.textContent = "⚐";
      dom.flagText.textContent = "Flag for Review";
    }

    // Render Options A, B, C, D
    dom.optionsContainer.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    currentQ.shuffledOptions.forEach((optText, optIndex) => {
      const optBtn = document.createElement("button");
      optBtn.type = "button";
      optBtn.className = "option-btn";
      optBtn.setAttribute("data-option", optText);

      const letterBadge = document.createElement("span");
      letterBadge.className = "option-letter";
      letterBadge.textContent = letters[optIndex] || String.fromCharCode(65 + optIndex);

      const textSpan = document.createElement("span");
      textSpan.textContent = optText;

      optBtn.appendChild(letterBadge);
      optBtn.appendChild(textSpan);

      // If already answered, reveal state
      if (currentQ.isAnswered) {
        optBtn.disabled = true;
        if (optText === currentQ.correctAnswer) {
          optBtn.classList.add("selected-correct");
        } else if (optText === currentQ.selectedAnswer) {
          optBtn.classList.add("selected-wrong");
        }
      } else {
        optBtn.addEventListener("click", () => handleOptionSelection(optText, optBtn));
      }

      dom.optionsContainer.appendChild(optBtn);
    });

    // Explanation card
    if (currentQ.isAnswered) {
      dom.explanationText.textContent = currentQ.explanation;
      dom.explanationCard.classList.add("show");
    } else {
      dom.explanationCard.classList.remove("show");
    }

    // Update Next/Previous buttons
    dom.prevBtn.disabled = state.currentIndex === 0;
    dom.nextBtn.style.display = state.currentIndex === total - 1 ? "none" : "inline-flex";

    updateNavigatorUI();

    if (state.timerMode === "perQuestion" && !currentQ.isAnswered) {
      startPerQuestionTimer();
    }
  }

  function handleOptionSelection(selectedAnswer, chosenBtn) {
    const currentQ = state.sessionQuestions[state.currentIndex];
    if (currentQ.isAnswered) return;

    currentQ.selectedAnswer = selectedAnswer;
    currentQ.isAnswered = true;
    currentQ.isCorrect = selectedAnswer === currentQ.correctAnswer;

    const answerTimeSeconds = (Date.now() - Gamification.questionStartTime) / 1000;

    // Disable all options
    const allBtns = dom.optionsContainer.querySelectorAll(".option-btn");
    allBtns.forEach(btn => {
      btn.disabled = true;
      const val = btn.getAttribute("data-option");
      if (val === currentQ.correctAnswer) {
        btn.classList.add("selected-correct");
      }
    });

    if (currentQ.isCorrect) {
      chosenBtn.classList.add("selected-correct");
      SoundEngine.correct();

      // Points and Streak
      Gamification.currentInQuizStreak += 1;
      let pointsAwarded = 10;
      Gamification.addPoints(pointsAwarded, `Question ${state.currentIndex + 1} Correct`);
      showFloatingXP(`+${pointsAwarded} XP`);

      // In-quiz streak bonuses
      if (Gamification.currentInQuizStreak >= 3) {
        dom.quizStreakWidget.style.display = "inline-flex";
        dom.quizStreakCount.textContent = Gamification.currentInQuizStreak;
        Gamification.unlockAchievement("streak_3");
      }
      if (Gamification.currentInQuizStreak >= 5) {
        Gamification.unlockAchievement("streak_5");
      }
      if (answerTimeSeconds < 5) {
        Gamification.unlockAchievement("speed_demon");
      }
    } else {
      chosenBtn.classList.add("selected-wrong");
      SoundEngine.wrong();
      Gamification.currentInQuizStreak = 0;
      dom.quizStreakWidget.style.display = "none";
    }

    // Show Explanation
    dom.explanationText.textContent = currentQ.explanation;
    dom.explanationCard.classList.add("show");

    updateNavigatorUI();
  }

  function saveCurrentQuestionTimerState() {
    if (state.timerMode === "perQuestion" && state.questionTimerInterval) {
      clearInterval(state.questionTimerInterval);
    }
  }

  function goToNextQuestion() {
    saveCurrentQuestionTimerState();
    if (state.currentIndex < state.sessionQuestions.length - 1) {
      state.currentIndex += 1;
      renderCurrentQuestion();
    } else {
      finishAndSubmitQuiz();
    }
  }

  function goToPreviousQuestion() {
    saveCurrentQuestionTimerState();
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderCurrentQuestion();
    }
  }

  function toggleFlagCurrentQuestion() {
    const currentQ = state.sessionQuestions[state.currentIndex];
    currentQ.isFlagged = !currentQ.isFlagged;

    if (currentQ.isFlagged) {
      dom.flagBtn.classList.add("flagged");
      dom.flagIcon.textContent = "⚑";
      dom.flagText.textContent = "Flagged";
      showToast("Question flagged for review.", "⚑");
    } else {
      dom.flagBtn.classList.remove("flagged");
      dom.flagIcon.textContent = "⚐";
      dom.flagText.textContent = "Flag for Review";
    }
    updateNavigatorUI();
  }

  // ==========================================================================
  // 10. Finish & Review Screen
  // ==========================================================================
  function finishAndSubmitQuiz() {
    clearAllTimers();
    SoundEngine.finish();

    const total = state.sessionQuestions.length;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let flaggedCount = 0;

    state.sessionQuestions.forEach(q => {
      if (!q.isAnswered) skippedCount += 1;
      else if (q.isCorrect) correctCount += 1;
      else wrongCount += 1;
      if (q.isFlagged) flaggedCount += 1;
    });

    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    state.totalElapsedSeconds = Math.round((Date.now() - state.quizStartTime) / 1000);

    // Gamification Updates
    Gamification.recordLessonCompletion(state.subject, state.lesson);
    Gamification.unlockAchievement("first_quiz");

    if (percentage === 100) {
      Gamification.unlockAchievement("perfect_score");
    }
    if (flaggedCount > 0) {
      Gamification.unlockAchievement("tactician");
    }

    // Check Polymath (lessons in 3 distinct subjects)
    let distinctSubjectCount = 0;
    Object.keys(Gamification.state.completedLessons).forEach(subj => {
      if (Gamification.state.completedLessons[subj].length > 0) {
        distinctSubjectCount += 1;
      }
    });
    if (distinctSubjectCount >= 3) {
      Gamification.unlockAchievement("polymath");
    }

    // Completion bonus points
    const completionBonus = correctCount * 5;
    if (completionBonus > 0) {
      Gamification.addPoints(completionBonus, "Lesson Completion Bonus");
    }

    // Update Results Display
    dom.statTotal.textContent = total;
    dom.statCorrect.textContent = correctCount;
    dom.statWrong.textContent = wrongCount;
    dom.statSkipped.textContent = skippedCount;
    dom.statTime.textContent = formatTime(state.totalElapsedSeconds);
    dom.scorePercentage.textContent = `${percentage}%`;

    if (percentage >= 80) {
      dom.resultsIcon.textContent = "🎉";
      dom.resultsHeading.textContent = "Outstanding Performance!";
      dom.resultsSubheading.textContent = `You mastered ${state.subject} (Lesson ${state.lesson}) with flying colors!`;
    } else if (percentage >= 50) {
      dom.resultsIcon.textContent = "👍";
      dom.resultsHeading.textContent = "Good Effort!";
      dom.resultsSubheading.textContent = "Solid attempt! Review the explanations below to master the remaining questions.";
    } else {
      dom.resultsIcon.textContent = "💡";
      dom.resultsHeading.textContent = "Keep Practicing!";
      dom.resultsSubheading.textContent = "Every mistake is a learning opportunity. Review the correct explanations and try again!";
    }

    // Rewards Breakdown
    dom.resultsTotalXpGained.textContent = Gamification.sessionPointsGained;
    dom.resultsRewardsBreakdown.innerHTML = "";
    Gamification.sessionPointsBreakdown.forEach(item => {
      const chip = document.createElement("span");
      chip.className = "reward-chip";
      chip.textContent = `${item.label} (+${item.amount} XP)`;
      dom.resultsRewardsBreakdown.appendChild(chip);
    });

    // New Achievements Unlocked
    if (Gamification.newlyUnlockedThisQuiz.length > 0) {
      dom.resultsNewAchievementsContainer.style.display = "block";
      dom.resultsNewAchievementsList.innerHTML = "";
      Gamification.newlyUnlockedThisQuiz.forEach(ach => {
        const item = document.createElement("div");
        item.style.fontSize = "0.88rem";
        item.style.fontWeight = "600";
        item.innerHTML = `${ach.icon} <strong>${ach.title}</strong> (+${ach.reward} XP)`;
        dom.resultsNewAchievementsList.appendChild(item);
      });
    } else {
      dom.resultsNewAchievementsContainer.style.display = "none";
    }

    // Render Review List
    dom.countAll.textContent = total;
    dom.countCorrect.textContent = correctCount;
    dom.countIncorrect.textContent = wrongCount + skippedCount;
    dom.countFlagged.textContent = flaggedCount;

    renderReviewList("all");
    switchView("results");
  }

  function renderReviewList(filter = "all") {
    dom.reviewListContainer.innerHTML = "";

    state.sessionQuestions.forEach((q, index) => {
      if (filter === "correct" && !q.isCorrect) return;
      if (filter === "incorrect" && q.isCorrect) return;
      if (filter === "flagged" && !q.isFlagged) return;

      const card = document.createElement("div");
      card.className = "review-item";

      const statusBadge = q.isCorrect 
        ? '<span style="color: #16a34a; font-weight: 700;">✓ Correct</span>' 
        : (q.isAnswered ? '<span style="color: #ef4444; font-weight: 700;">✕ Incorrect</span>' : '<span style="color: #f59e0b; font-weight: 700;">⊘ Skipped</span>');

      const flaggedBadge = q.isFlagged ? '<span style="color: #f59e0b; margin-left: 8px;">⚑ Flagged</span>' : '';

      let optionsHTML = "";
      q.shuffledOptions.forEach(opt => {
        let optClass = "review-opt";
        if (opt === q.correctAnswer) {
          optClass += " correct";
        } else if (opt === q.selectedAnswer && !q.isCorrect) {
          optClass += " user-wrong";
        }
        optionsHTML += `<div class="${optClass}">${opt} ${opt === q.selectedAnswer ? '<strong>(Your Answer)</strong>' : ''}</div>`;
      });

      card.innerHTML = `
        <div class="review-item-header">
          <span>Question ${index + 1} • ${q.difficulty}</span>
          <div>${statusBadge}${flaggedBadge}</div>
        </div>
        <p class="review-prompt">${q.question}</p>
        <div class="review-options">${optionsHTML}</div>
        <div class="review-explanation">
          <strong>💡 Explanation:</strong> ${q.explanation}
        </div>
      `;

      dom.reviewListContainer.appendChild(card);
    });
  }

  // ==========================================================================
  // 11. Event Listeners Initialization
  // ==========================================================================
  function initEventListeners() {
    // Subject Cards click -> Opens Subject Launcher Modal
    dom.subjectCards.forEach(card => {
      card.addEventListener("click", () => {
        const subjectName = card.getAttribute("data-subject");
        openSubjectLauncherModal(subjectName);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const subjectName = card.getAttribute("data-subject");
          openSubjectLauncherModal(subjectName);
        }
      });
    });

    // Subject Launcher Modal buttons
    dom.subjectModalCloseBtn.addEventListener("click", closeSubjectLauncherModal);
    dom.modalCancelLaunchBtn.addEventListener("click", closeSubjectLauncherModal);
    dom.modalStartQuizBtn.addEventListener("click", startQuiz);

    // Difficulty buttons in modal
    dom.difficultyBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        dom.difficultyBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.difficulty = btn.dataset.difficulty || "ALL";
      });
    });

    // Timer Radios in modal
    dom.modalTimerModeRadios.forEach(label => {
      label.addEventListener("click", () => {
        dom.modalTimerModeRadios.forEach(l => l.classList.remove("selected"));
        label.classList.add("selected");
        const radio = label.querySelector("input[name='modalTimerMode']");
        if (radio) {
          radio.checked = true;
          state.timerMode = radio.value;
        }
      });
    });

    // Global Navigation & Learning Insights Switchers
    if (dom.navBtnPractice) {
      dom.navBtnPractice.addEventListener("click", () => switchView("home"));
    }
    if (dom.navBtnInsights) {
      dom.navBtnInsights.addEventListener("click", () => switchView("insights"));
    }
    if (dom.btnQuickInsights) {
      dom.btnQuickInsights.addEventListener("click", () => switchView("insights"));
    }
    if (dom.railBtnPractice) {
      dom.railBtnPractice.addEventListener("click", () => switchView("home"));
    }
    if (dom.railIconBtns) {
      dom.railIconBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          if (btn.id === "rail-btn-practice") return;
          dom.railIconBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          showToast(`Dock Filter: ${btn.getAttribute("title") || "Selected"}`, "📌");
        });
      });
    }

    // Insights Tabs
    if (dom.insightsTabBtns) {
      dom.insightsTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          dom.insightsTabBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          showToast(`Viewing Insights: ${btn.textContent}`, "📊");
        });
      });
    }

    if (dom.insightsSearchBtn) {
      dom.insightsSearchBtn.addEventListener("click", () => {
        showToast("Search Insights: Filter active metrics and quests", "🔍");
      });
    }

    // Interactive Bubble Nodes
    document.querySelectorAll(".bubble-node").forEach(bubble => {
      bubble.addEventListener("click", () => {
        const title = bubble.getAttribute("title") || "Course activity node";
        showToast(`Engagement: ${title}`, "🟣");
      });
    });

    // Quick Action Buttons
    dom.btnQuickAchievements.addEventListener("click", () => {
      Gamification.renderAchievementsModal();
      dom.achievementsModal.classList.add("open");
    });
    dom.achievementsModalCloseBtn.addEventListener("click", () => {
      dom.achievementsModal.classList.remove("open");
    });

    dom.btnQuickGoal.addEventListener("click", () => {
      dom.goalModal.classList.add("open");
    });
    dom.goalModalCloseBtn.addEventListener("click", () => {
      dom.goalModal.classList.remove("open");
    });

    // Goal options selection
    dom.goalOptionsContainer.querySelectorAll(".goal-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        dom.goalOptionsContainer.querySelectorAll(".goal-chip-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        Gamification.state.dailyGoal = parseInt(btn.dataset.goal, 10) || 1;
        Gamification.save();
        Gamification.updateDashboardUI();
      });
    });
    dom.goalSaveBtn.addEventListener("click", () => {
      dom.goalModal.classList.remove("open");
      showToast(`Daily goal updated to ${Gamification.state.dailyGoal} lessons/day!`, "🎯");
    });

    dom.btnQuickPractice.addEventListener("click", () => {
      openSubjectLauncherModal("Mathematics");
    });

    dom.btnQuickLeaderboard.addEventListener("click", () => {
      Gamification.renderLeaderboardModal();
      dom.leaderboardModal.classList.add("open");
    });
    dom.leaderboardModalCloseBtn.addEventListener("click", () => {
      dom.leaderboardModal.classList.remove("open");
    });

    // Sound toggle
    dom.soundToggleBtn.addEventListener("click", () => {
      SoundEngine.enabled = !SoundEngine.enabled;
      dom.soundToggleBtn.textContent = SoundEngine.enabled ? "🔊" : "🔇";
      showToast(SoundEngine.enabled ? "Sound effects enabled" : "Sound effects muted", SoundEngine.enabled ? "🔊" : "🔇");
    });

    // Header badges clicks
    dom.headerStreakBadge.addEventListener("click", () => {
      showToast(`Current Daily Study Streak: ${Gamification.state.dailyStreak} day(s). Keep it going!`, "🔥");
    });
    dom.headerXpBadge.addEventListener("click", () => {
      Gamification.renderAchievementsModal();
      dom.achievementsModal.classList.add("open");
    });

    // Active Quiz Navigation buttons
    dom.nextBtn.addEventListener("click", goToNextQuestion);
    dom.prevBtn.addEventListener("click", goToPreviousQuestion);
    dom.skipBtn.addEventListener("click", goToNextQuestion);
    dom.flagBtn.addEventListener("click", toggleFlagCurrentQuestion);

    dom.submitQuizBtn.addEventListener("click", () => {
      const unanswered = state.sessionQuestions.filter(q => !q.isAnswered).length;
      if (unanswered > 0) {
        showConfirmModal(
          "Submit Practice Quiz?",
          `You have ${unanswered} unanswered question(s). Are you sure you want to finish now?`,
          () => finishAndSubmitQuiz()
        );
      } else {
        finishAndSubmitQuiz();
      }
    });

    dom.quitQuizBtn.addEventListener("click", () => {
      showConfirmModal(
        "Exit Quiz?",
        "Are you sure you want to quit this practice quiz? Current answers will be lost.",
        () => {
          clearAllTimers();
          switchView("home");
        }
      );
    });

    // Modal Confirmation Handlers
    dom.modalConfirmBtn.addEventListener("click", () => {
      if (typeof state.pendingConfirmAction === "function") {
        state.pendingConfirmAction();
      }
      closeConfirmModal();
    });
    dom.modalCancelBtn.addEventListener("click", closeConfirmModal);
    dom.modalCloseX.addEventListener("click", closeConfirmModal);

    // Results screen actions
    dom.retakeQuizBtn.addEventListener("click", startQuiz);
    dom.changeTopicBtn.addEventListener("click", () => switchView("home"));

    // Review Filters
    dom.reviewFilterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        dom.reviewFilterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        renderReviewList(chip.dataset.filter);
      });
    });

    // Backdrop click to close modals
    [dom.subjectModal, dom.achievementsModal, dom.goalModal, dom.leaderboardModal, dom.confirmModal].forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
        }
      });
    });
  }

  // ==========================================================================
  // 12. App Bootstrapping
  // ==========================================================================
  function init() {
    Gamification.load();
    initEventListeners();
    console.log("PrepQuiz Dashboard Initialized successfully.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
