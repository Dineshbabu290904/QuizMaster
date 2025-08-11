// Quiz questions database
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    },
    {
        question: "Which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct: 1
    },
    {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
        correct: 2
    },
    {
        question: "Which element has the atomic number 1?",
        options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
        correct: 1
    },
    {
        question: "What is the longest river in the world?",
        options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
        correct: 1
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1
    }
];

// Game state variables
let currentQuestion = 0;
let score = 0;
let selectedOption = -1;
let timer;
let timeLeft = 30;
let gameQuestions = [];

// DOM elements
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const questionCounter = document.getElementById('questionCounter');
const currentScoreElement = document.getElementById('currentScore');
const timerElement = document.getElementById('timer');

// Initialize the quiz
function startQuiz() {
    // Shuffle questions for variety
    gameQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestion = 0;
    score = 0;
    selectedOption = -1;
    
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultsScreen.classList.add('hidden');
    
    displayQuestion();
    startTimer();
}

// Display current question
function displayQuestion() {
    const question = gameQuestions[currentQuestion];
    
    questionElement.textContent = question.question;
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${gameQuestions.length}`;
    
    // Update progress bar
    const progress = ((currentQuestion) / gameQuestions.length) * 100;
    progressBar.style.width = progress + '%';
    
    // Display options
    optionsElement.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.onclick = () => selectOption(index);
        optionsElement.appendChild(optionElement);
    });
    
    nextBtn.disabled = true;
    selectedOption = -1;
    timeLeft = 30;
    startTimer();
}

// Handle option selection
function selectOption(index) {
    if (selectedOption !== -1) return; // Already selected
    
    selectedOption = index;
    const options = document.querySelectorAll('.option');
    const correctAnswer = gameQuestions[currentQuestion].correct;
    
    // Clear timer
    clearInterval(timer);
    
    // Show correct/incorrect answers
    options.forEach((option, i) => {
        if (i === correctAnswer) {
            option.classList.add('correct');
        } else if (i === selectedOption && i !== correctAnswer) {
            option.classList.add('incorrect');
        } else if (i !== correctAnswer) {
            option.style.opacity = '0.5';
        }
    });
    
    // Update score
    if (selectedOption === correctAnswer) {
        score++;
        currentScoreElement.textContent = score;
    }
    
    nextBtn.disabled = false;
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
        if (!nextBtn.disabled) {
            nextQuestion();
        }
    }, 2000);
}

// Move to next question
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < gameQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

// Timer functionality
function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Auto-select a random wrong answer if time runs out
            if (selectedOption === -1) {
                const correctAnswer = gameQuestions[currentQuestion].correct;
                let randomWrongAnswer;
                do {
                    randomWrongAnswer = Math.floor(Math.random() * 4);
                } while (randomWrongAnswer === correctAnswer);
                selectOption(randomWrongAnswer);
            }
        }
    }, 1000);
}

// Show final results
function showResults() {
    clearInterval(timer);
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    const finalScore = document.getElementById('finalScore');
    const scoreMessage = document.getElementById('scoreMessage');
    
    finalScore.textContent = `${score}/${gameQuestions.length}`;
    
    // Determine score message
    const percentage = (score / gameQuestions.length) * 100;
    if (percentage >= 90) {
        scoreMessage.textContent = "Outstanding! You're a quiz master! 🏆";
    } else if (percentage >= 70) {
        scoreMessage.textContent = "Great job! You know your stuff! 🎉";
    } else if (percentage >= 50) {
        scoreMessage.textContent = "Good effort! Keep learning! 📚";
    } else {
        scoreMessage.textContent = "Don't give up! Practice makes perfect! 💪";
    }
}

// Restart the quiz
function restartQuiz() {
    resultsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// Initialize the game when page loads
window.onload = function() {
    // Add some initial animations
    document.querySelector('.container').classList.add('fade-in');
};