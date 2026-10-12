/**
 * PrepQuiz - Interactive Student Exam Practice Portal
 * Core Client-Side Application Logic
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
    }
  };

  // ==========================================================================
  // 2. Application State
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
  // 3. DOM Element References
  // ==========================================================================
  const dom = {
    // Views
    homeView: document.getElementById("home-view"),
    quizView: document.getElementById("quiz-view"),
    resultsView: document.getElementById("results-view"),

    // Header & Global
    soundToggleBtn: document.getElementById("sound-toggle-btn"),
    headerHomeBtn: document.getElementById("header-home-btn"),
    brandHomeLink: document.getElementById("brand-home-link"),
    toast: document.getElementById("toast"),
    toastText: document.getElementById("toast-text"),
    toastIcon: document.getElementById("toast-icon"),

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
    timerWidget: document.getElementById("timer-widget"),
    timerDisplay: document.getElementById("timer-display"),
    timerTypeLabel: document.getElementById("timer-type-label"),
    quitQuizBtn: document.getElementById("quit-quiz-btn"),

    questionIndicator: document.getElementById("question-indicator"),
    answeredStatsBadge: document.getElementById("answered-stats-badge"),
    progressBarFill: document.getElementById("progress-bar-fill"),
    questionNavGrid: document.getElementById("question-nav-grid"),

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

    // Results
    resultsIcon: document.getElementById("results-icon"),
    resultsHeading: document.getElementById("results-heading"),
    resultsSubheading: document.getElementById("results-subheading"),
    scorePercentage: document.getElementById("score-percentage"),
    statTotal: document.getElementById("stat-total"),
    statCorrect: document.getElementById("stat-correct"),
    statWrong: document.getElementById("stat-wrong"),
    statSkipped: document.getElementById("stat-skipped"),
    statTime: document.getElementById("stat-time"),
    retakeQuizBtn: document.getElementById("retake-quiz-btn"),
    changeTopicBtn: document.getElementById("change-topic-btn"),
    reviewListContainer: document.getElementById("review-list-container"),
    reviewFilterChips: document.querySelectorAll(".review-filters .filter-chip"),
    countAll: document.getElementById("count-all"),
    countCorrect: document.getElementById("count-correct"),
    countIncorrect: document.getElementById("count-incorrect"),
    countFlagged: document.getElementById("count-flagged"),

    // Modal
    confirmModal: document.getElementById("confirm-modal"),
    modalTitle: document.getElementById("modal-title"),
    modalBody: document.getElementById("modal-body"),
    modalCancelBtn: document.getElementById("modal-cancel-btn"),
    modalConfirmBtn: document.getElementById("modal-confirm-btn")
  };

  // ==========================================================================
  // 4. Utility Functions (Fisher-Yates Shuffle & Formatting)
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
    }, 3200);
  }

  function switchView(viewName) {
    dom.homeView.classList.remove("active");
    dom.quizView.classList.remove("active");
    dom.resultsView.classList.remove("active");

    if (viewName === "home") dom.homeView.classList.add("active");
    else if (viewName === "quiz") dom.quizView.classList.add("active");
    else if (viewName === "results") dom.resultsView.classList.add("active");

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

  // ==========================================================================
  // 5. Quiz Initialization & Randomization
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
    state.sessionQuestions = shuffledQuestionPool.map((q, idx) => {
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
        selectedAnswer: null, // string or null
        isAnswered: false,
        isCorrect: false,
        isFlagged: false
      };
    });

    state.currentIndex = 0;
    state.quizStartTime = Date.now();
    state.totalElapsedSeconds = 0;

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
  // 6. Question Navigator
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

      // Remove dynamic status classes
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

    // Update Progress Info
    const total = state.sessionQuestions.length;
    dom.questionIndicator.textContent = `Question ${state.currentIndex + 1} of ${total}`;
    dom.answeredStatsBadge.textContent = `${answeredCount} of ${total} Answered`;

    const progressPercent = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
    dom.progressBarFill.style.width = `${progressPercent}%`;
  }

  // ==========================================================================
  // 7. Render Current Question & Options
  // ==========================================================================
  function renderCurrentQuestion() {
    const q = state.sessionQuestions[state.currentIndex];
    const total = state.sessionQuestions.length;

    // Update Question labels
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

      // If already answered in this session, show locked feedback states
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
        // Listening for selection
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
  // 8. Answer Selection & Feedback Highlighting
  // ==========================================================================
  function handleSelectAnswer(selectedText, clickedButton) {
    const q = state.sessionQuestions[state.currentIndex];
    if (q.isAnswered) return; // Prevent double submit

    const isCorrect = selectedText === q.correctAnswer;
    q.selectedAnswer = selectedText;
    q.isAnswered = true;
    q.isCorrect = isCorrect;

    // Play synthesized audio
    if (isCorrect) {
      SoundEngine.correct();
    } else {
      SoundEngine.wrong();
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
  // 9. Navigation Actions (Next, Prev, Skip, Jump, Flag)
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
  // 10. Timer Logic (Whole Quiz Countdown & Per-Question Countdown)
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

      // Visual warning under 60 seconds
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
        submitQuiz(true); // Forced auto-submission
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
      // Auto move to next or submit if last
      if (state.currentIndex < state.sessionQuestions.length - 1) {
        handleNext();
      } else {
        submitQuiz(true);
      }
    }
  }

  // ==========================================================================
  // 11. Quiz Submission & Results Calculation
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

    state.sessionQuestions.forEach(q => {
      if (!q.isAnswered) {
        skippedCount++;
      } else if (q.isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Populate Results Screen
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

    SoundEngine.finish();

    // Render Detailed Answer Review
    renderReviewList("all");

    switchView("results");
  }

  // ==========================================================================
  // 12. Detailed Review Section (with Filters)
  // ==========================================================================
  let currentReviewFilter = "all";

  function renderReviewList(filter = "all") {
    currentReviewFilter = filter;
    dom.reviewListContainer.innerHTML = "";

    // Calculate Counts for Filter Chips
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

    // Filter questions
    const filteredQuestions = state.sessionQuestions.filter((q, idx) => {
      if (filter === "correct") return q.isCorrect;
      if (filter === "incorrect") return q.isAnswered && !q.isCorrect;
      if (filter === "flagged") return q.isFlagged;
      return true; // "all"
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
      // Find actual original index in session
      const originalIdx = state.sessionQuestions.indexOf(q);

      const itemCard = document.createElement("div");
      itemCard.className = "review-item";

      // Badge status
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
  // 13. Event Listeners & Binding
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
      startQuiz(); // Starts brand-new randomized attempt
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

    // Modal Actions
    dom.modalCancelBtn.addEventListener("click", closeConfirmModal);
    dom.modalConfirmBtn.addEventListener("click", () => {
      if (typeof state.pendingConfirmAction === "function") {
        state.pendingConfirmAction();
      }
    });

    // Keyboard Shortcuts for Students
    document.addEventListener("keydown", (e) => {
      // Only process when quiz view is active and modal is not open
      if (!dom.quizView.classList.contains("active") || dom.confirmModal.classList.contains("open")) {
        return;
      }

      // 1-4 or A-D to select options
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
  // 14. Initialize App
  // ==========================================================================
  function init() {
    initEventListeners();
    // Pre-populate category select from Question Bank if dynamic
    if (window.QUESTION_BANK) {
      console.log(`Loaded ${window.QUESTION_BANK.length} practice questions.`);
    }
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
