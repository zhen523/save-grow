let vocabulary = [], grammarNotes = [], quizData = [];
let activeCategory = "全部";
let currentQuestion = 0;
let score = 0;
let answered = false;

async function loadData() {
  const [v, g, q] = await Promise.all([
  fetch("./vocabulary.json").then(r => r.json()),
  fetch("./grammar.json").then(r => r.json()),
  fetch("./quiz.json").then(r => r.json())
]);
  vocabulary = v; grammarNotes = g; quizData = q;
  document.getElementById("word-count").textContent = String(v.length).padStart(2, "0");
  document.getElementById("grammar-count").textContent = String(g.length).padStart(2, "0");
  renderWords(); renderGrammar(); renderQuestion();
}

function renderWords() {
  const keyword = document.getElementById("search").value.trim().toLowerCase();
  const items = vocabulary.filter(item => {
    const matchesCategory = activeCategory === "全部" || item.category === activeCategory;
    const haystack = [item.word, item.meaning, item.roman, item.example].join(" ").toLowerCase();
    return matchesCategory && haystack.includes(keyword);
  });
  const grid = document.getElementById("word-grid");
  grid.innerHTML = items.map(item => `
    <article class="word-card">
      <div class="word-top"><span class="word-category">${item.category}</span><span class="level">${item.level}</span></div>
      <div class="word">${item.word}</div><div class="roman">${item.roman}</div>
      <div class="meaning">${item.meaning}</div>
      <div class="word-example">${item.example}</div><div class="word-translation">${item.translation}</div>
    </article>`).join("");
  document.getElementById("empty").classList.toggle("hidden", items.length !== 0);
}

function renderGrammar() {
  document.getElementById("grammar-list").innerHTML = grammarNotes.map(item => `
    <article class="grammar-card">
      <div class="grammar-title">${item.title}</div><div class="grammar-meaning">${item.meaning}</div>
      <div class="grammar-usage">${item.usage}</div>
      <div class="grammar-example">${item.example}</div><div class="grammar-translation">${item.translation}</div>
      <p class="grammar-note">${item.note}</p>
    </article>`).join("");
}

function renderQuestion() {
  const item = quizData[currentQuestion];
  answered = false;
  document.getElementById("quiz-progress").textContent = `QUESTION ${String(currentQuestion + 1).padStart(2,"0")} / ${String(quizData.length).padStart(2,"0")}`;
  document.getElementById("quiz-question").textContent = item.q;
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("next-question").disabled = true;
  document.getElementById("next-question").textContent = currentQuestion === quizData.length - 1 ? "查看結果 →" : "下一題 →";
  document.getElementById("quiz-choices").innerHTML = item.choices.map((choice, index) =>
    `<button class="choice" data-index="${index}">${String.fromCharCode(65 + index)}. ${choice}</button>`).join("");
  document.querySelectorAll(".choice").forEach(button => button.addEventListener("click", () => chooseAnswer(Number(button.dataset.index))));
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  const item = quizData[currentQuestion];
  const buttons = [...document.querySelectorAll(".choice")];
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.answer) button.classList.add("correct");
    if (i === index && i !== item.answer) button.classList.add("wrong");
  });
  if (index === item.answer) {
    score++;
    document.getElementById("quiz-feedback").textContent = "答對了！ " + item.why;
  } else {
    document.getElementById("quiz-feedback").textContent = "再記一下：" + item.why;
  }
  document.getElementById("next-question").disabled = false;
}

document.getElementById("search").addEventListener("input", renderWords);
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
  renderWords();
});
document.getElementById("next-question").addEventListener("click", () => {
  if (!answered) return;
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    document.getElementById("quiz-card").innerHTML = `
      <div class="quiz-meta"><span>YOUR RESULT</span><span>FINISHED ✳</span></div>
      <h3>完成今天的練習！</h3>
      <p style="font-size:14px;color:#71866b">你答對了 ${score} / ${quizData.length} 題。</p>
      <p style="font-size:11px;color:#999">천천히, 하지만 꾸준히. 慢慢來，但持續前進。</p>
      <button class="next-btn" id="retry-quiz">再練習一次 ↻</button>`;
    document.getElementById("retry-quiz").addEventListener("click", () => {
      currentQuestion = 0; score = 0;
      document.getElementById("quiz-card").innerHTML = `
        <div class="quiz-meta"><span id="quiz-progress"></span><span class="quiz-dot">● ● ● ● ●</span></div>
        <h3 id="quiz-question"></h3><div class="choices" id="quiz-choices"></div>
        <div class="quiz-feedback" id="quiz-feedback" aria-live="polite"></div>
        <button class="next-btn" id="next-question" disabled>下一題 →</button>`;
      document.getElementById("next-question").addEventListener("click", nextQuestion);
      renderQuestion();
    });
  }
});
function nextQuestion() {
  if (!answered) return;
  if (currentQuestion < quizData.length - 1) { currentQuestion++; renderQuestion(); }
}
loadData().catch(error => {
  console.error(error);
  document.getElementById("word-grid").innerHTML = '<p class="empty">資料載入失敗，請使用本機伺服器或 GitHub Pages 開啟網站。</p>';
});
