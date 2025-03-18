let allQuestions = {};
let currentTopic = "";
let currentQuestions = [];
let currentQuestion = 0;
let score = 0;

const topicSelect = document.getElementById('topic-select');
const startBtn = document.getElementById('start-btn');
const quizArea = document.getElementById('quiz-area');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const counterEl = document.getElementById('question-counter');
const progressEl = document.querySelector('.progress');

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  const q = currentQuestions[currentQuestion];
  questionEl.textContent = q.question;

  // Filtrar alternativas
  const correctOptions = q.options.filter(o => o.correct);
  const incorrectOptions = q.options.filter(o => !o.correct);

  const selectedOptions = [
    correctOptions[Math.floor(Math.random() * correctOptions.length)],
    ...shuffle(incorrectOptions).slice(0, 2)
  ];

  const finalOptions = shuffle(selectedOptions);

  optionsEl.innerHTML = '';

  finalOptions.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option.text;
    btn.className = 'option-btn';
    btn.onclick = () => checkAnswer(option.correct, btn, correctOptions);
    optionsEl.appendChild(btn);
  });

  counterEl.textContent = `Pergunta ${currentQuestion + 1}/${currentQuestions.length}`;
  progressEl.style.width = `${((currentQuestion) / currentQuestions.length) * 100}%`;

  // Feedback
  const feedback = document.createElement('div');
  feedback.id = 'feedback';
  optionsEl.appendChild(feedback);
}

function checkAnswer(isCorrect, clickedBtn, correctOptions) {
  const allButtons = document.querySelectorAll('.option-btn');
  allButtons.forEach(btn => btn.disabled = true); // Desativa todos

  const feedbackEl = document.getElementById('feedback');

  if (isCorrect) {
    clickedBtn.classList.add('correct');
    feedbackEl.textContent = "✅ Resposta correta!";
  } else {
    clickedBtn.classList.add('incorrect');
    feedbackEl.textContent = "❌ Resposta incorreta!";
    // Mostra correta
    allButtons.forEach(btn => {
      if (correctOptions.some(opt => opt.text === btn.textContent)) {
        btn.classList.add('correct');
      }
    });
  }

  if (isCorrect) score++;

  // Próxima pergunta após 1.5s
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < currentQuestions.length) {
      loadQuestion();
    } else {
      progressEl.style.width = `100%`;
      questionEl.textContent = `Fim do Quiz! Pontuação: ${score}/${currentQuestions.length}`;
      optionsEl.innerHTML = '';
    }
  }, 1500);
}

// Carrega JSON
fetch('question.json')
  .then(response => response.json())
  .then(data => {
    allQuestions = data;
    // Preenche dropdown com tópicos
    Object.keys(data).forEach(topic => {
      const opt = document.createElement('option');
      opt.value = topic;
      opt.textContent = topic;
      topicSelect.appendChild(opt);
    });
  });

  startBtn.addEventListener('click', () => {
    currentTopic = topicSelect.value;
    if (currentTopic === "") {
      alert("Por favor, selecione um tópico!");
      return;
    }
  
    let amount = parseInt(document.getElementById('question-amount').value);
    if (isNaN(amount) || amount <= 0) amount = 5;
  
    const allTopicQuestions = allQuestions[currentTopic];
  
    // Sorteia quantidade desejada
    currentQuestions = shuffle(allTopicQuestions).slice(0, amount);
  
    currentQuestion = 0;
    score = 0;
    document.getElementById('topic-selection').style.display = 'none';
    quizArea.style.display = 'block';
    loadQuestion();
  });
  const backBtn = document.getElementById('back-btn');
  backBtn.addEventListener('click', () => {
    window.location.reload(); // Reseta a página
  });
    