// Replace this quiz array and the topic-specific state while preserving the
// language, video-switching, speed, and scoring behaviors.
const state = {
  lang: "en",
  speedIndex: 1,
  answers: Array(5).fill(null),
  correct: Array(5).fill(false),
  checked: Array(5).fill(false),
};

const speeds = [0.75, 1, 1.25, 1.5, 2];

const quiz = [
  {
    en: "E begins at x = 9 and is 2 units wide. The outline ends at x = 10. What happens?",
    zh: "E 从 x = 9 开始，宽度为 2；轮廓右边界到 x = 10。结果是什么？",
    options: [
      {
        en: "Right edge is 10; containment passes.",
        zh: "右边界是 10，包含性通过。",
      },
      {
        en: "Right edge is 11; containment fails.",
        zh: "右边界是 11，包含性失败。",
      },
      {
        en: "Right edge is 11, but edge contact makes it legal.",
        zh: "右边界是 11，但边缘接触使其合法。",
      },
    ],
    answer: 1,
    explainEn:
      "9 + 2 = 11. Since the fixed outline ends at 10, E extends one unit outside.",
    explainZh: "9 + 2 = 11。固定轮廓只到 10，所以 E 向外跑出了一格。",
  },
  {
    en: "C's right edge is x = 7, and E begins at x = 7. What is the geometric relationship?",
    zh: "C 的右边界是 x = 7，E 正好从 x = 7 开始。它们的几何关系是什么？",
    options: [
      { en: "They overlap by 2 units.", zh: "它们重叠 2 格。" },
      { en: "They overlap by 1 unit.", zh: "它们重叠 1 格。" },
      { en: "They only touch; overlap area is zero.", zh: "它们只是接触，重叠面积为零。" },
    ],
    answer: 2,
    explainEn:
      "The shared boundary is contact. With no shared interior area, this can be legal.",
    explainZh: "共享边界属于接触。内部没有共享面积，因此这种关系可以合法。",
  },
  {
    en: "Which condition is illegal on its own?",
    zh: "以下哪种情况本身一定非法？",
    options: [
      { en: "A module lies exactly on the outline boundary.", zh: "模块正好位于轮廓边界上。" },
      { en: "Two modules share a positive-area interior.", zh: "两个模块共享正面积的内部区域。" },
      { en: "A module is fully inside the outline.", zh: "模块完全位于轮廓内部。" },
    ],
    answer: 1,
    explainEn:
      "Positive-area interior overlap is forbidden. Boundary contact has zero area.",
    explainZh: "正面积内部重叠被禁止；边界接触的面积为零，本身不会导致失败。",
  },
  {
    en: "ChipBot checks containment and overlap. How many checks must pass?",
    zh: "ChipBot 会检查包含性和重叠。必须通过几项检查？",
    options: [
      { en: "Only the containment check.", zh: "只需要包含性检查。" },
      { en: "Both checks must pass.", zh: "两项检查都必须通过。" },
      { en: "It depends on module order.", zh: "取决于模块的处理顺序。" },
    ],
    answer: 1,
    explainEn:
      "Both containment and no-positive-area-overlap must pass. One failure rejects the layout.",
    explainZh: "包含性和“无正面积内部重叠”都必须通过，任何一项失败都会拒绝布局。",
  },
  {
    en: "An illegal floorplan still produces density and deadspace values. What should you do?",
    zh: "非法布局仍然能算出密度和空白率。你应该怎么做？",
    options: [
      { en: "Use the values because they are numeric.", zh: "因为它们是数字，所以直接使用。" },
      { en: "Optimise density before fixing overlap.", zh: "先优化密度，再处理重叠。" },
      { en: "Check legality first; the metrics are not meaningful yet.", zh: "先检查合法性；此时指标没有意义。" },
    ],
    answer: 2,
    explainEn:
      "Legality is the gate. Area metrics only become meaningful after both checks pass.",
    explainZh: "合法性是门槛。只有两项检查通过后，面积类指标才有意义。",
  },
];

function setLanguage(lang) {
  state.lang = lang;
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-set-lang]").forEach((button) => {
    const active = button.dataset.setLang === lang;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  setVideoLanguage(lang);
  renderQuiz();
}

function setVideoLanguage(lang) {
  document.querySelectorAll("[data-video-lang]").forEach((button) => {
    const active = button.dataset.videoLang === lang;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const videos = {
    en: document.querySelector("#video-en"),
    zh: document.querySelector("#video-zh"),
  };

  Object.entries(videos).forEach(([videoLang, video]) => {
    const active = videoLang === lang;
    if (!active) video.pause();
    video.hidden = !active;
    video.classList.toggle("is-current", active);
    video.playbackRate = speeds[state.speedIndex];
  });

  updateTime();
}

function currentVideo() {
  return state.lang === "zh"
    ? document.querySelector("#video-zh")
    : document.querySelector("#video-en");
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function updateTime() {
  const video = currentVideo();
  const readout = document.querySelector("#time-readout");
  readout.textContent = `${formatTime(video.currentTime)} / ${formatTime(
    video.duration || 230.1,
  )}`;
}

function cycleSpeed() {
  state.speedIndex = (state.speedIndex + 1) % speeds.length;
  const speed = speeds[state.speedIndex];
  document.querySelectorAll("video").forEach((video) => {
    video.playbackRate = speed;
  });
  document.querySelector("#speed-value").textContent = `${speed}×`;
}

function renderQuiz() {
  const list = document.querySelector("#quiz-list");
  list.innerHTML = "";

  quiz.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "quiz-card";

    const head = document.createElement("div");
    head.className = "quiz-head";
    head.innerHTML = `
      <span class="quiz-index">${String(index + 1).padStart(2, "0")}</span>
      <h3 class="quiz-question">
        <span class="${state.lang === "en" ? "en" : "zh"}">${
          state.lang === "en" ? item.en : item.zh
        }</span>
      </h3>
    `;

    const options = document.createElement("div");
    options.className = "quiz-options";
    item.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      if (state.answers[index] === optionIndex) button.classList.add("is-selected");
      if (state.checked[index] && optionIndex === item.answer) {
        button.classList.add("is-correct");
      }
      if (
        state.checked[index] &&
        state.answers[index] === optionIndex &&
        optionIndex !== item.answer
      ) {
        button.classList.add("is-wrong");
      }
      button.innerHTML = `
        <span class="option-key">${String.fromCharCode(65 + optionIndex)}</span>
        <span>${state.lang === "en" ? option.en : option.zh}</span>
      `;
      button.addEventListener("click", () => {
        if (state.correct[index]) return;
        state.answers[index] = optionIndex;
        state.checked[index] = false;
        renderQuiz();
      });
      options.appendChild(button);
    });

    const actions = document.createElement("div");
    actions.className = "quiz-actions";
    const check = document.createElement("button");
    check.type = "button";
    check.className = "check-button";
    check.textContent = state.lang === "en" ? "Check answer" : "提交答案";
    check.disabled = state.answers[index] === null || state.correct[index];
    check.addEventListener("click", () => {
      state.checked[index] = true;
      if (state.answers[index] === item.answer) state.correct[index] = true;
      renderQuiz();
    });

    const feedback = document.createElement("div");
    const isCorrect = state.checked[index] && state.answers[index] === item.answer;
    const isWrong = state.checked[index] && state.answers[index] !== item.answer;
    feedback.className = "quiz-feedback";
    if (isCorrect) feedback.classList.add("is-visible", "is-correct");
    if (isWrong) feedback.classList.add("is-visible", "is-wrong");
    feedback.textContent = isCorrect
      ? state.lang === "en"
        ? `Correct. ${item.explainEn}`
        : `正确。${item.explainZh}`
      : state.lang === "en"
        ? `Not yet. ${item.explainEn}`
        : `还不对。${item.explainZh}`;

    actions.append(check, feedback);
    card.append(head, options, actions);
    list.appendChild(card);
  });

  updateScore();
}

function updateScore() {
  const score = state.correct.filter(Boolean).length;
  document.querySelector("#score-value").textContent = String(score);
  document.querySelector("#score-progress").style.width = `${score * 20}%`;

  const message = document.querySelector("#score-message");
  if (score === 5) {
    message.innerHTML =
      state.lang === "en"
        ? "<span class='en'>Packed! Both legality rules are clear.</span>"
        : "<span class='zh'>装箱完成！两条合法性规则都掌握了。</span>";
  } else if (score >= 3) {
    message.innerHTML =
      state.lang === "en"
        ? "<span class='en'>Strong progress. Check the remaining edge cases.</span>"
        : "<span class='zh'>进展不错，再检查剩余的边界情况。</span>";
  } else {
    message.innerHTML =
      state.lang === "en"
        ? "<span class='en'>Make a call, then check the geometry.</span>"
        : "<span class='zh'>先做选择，再检查几何关系。</span>";
  }
}

function resetQuiz() {
  state.answers.fill(null);
  state.correct.fill(false);
  state.checked.fill(false);
  renderQuiz();
}

document.querySelectorAll("[data-set-lang]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.setLang));
});

document.querySelectorAll("[data-video-lang]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.videoLang));
});

document.querySelectorAll("[data-seek]").forEach((button) => {
  button.addEventListener("click", () => {
    const video = currentVideo();
    video.currentTime = Number(button.dataset.seek);
    video.scrollIntoView({ behavior: "smooth", block: "center" });
    updateTime();
  });
});

document.querySelector("#speed-button").addEventListener("click", cycleSpeed);
document.querySelector("#reset-quiz").addEventListener("click", resetQuiz);
document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("timeupdate", () => {
    if (video === currentVideo()) updateTime();
  });
  video.addEventListener("loadedmetadata", updateTime);
});

renderQuiz();
