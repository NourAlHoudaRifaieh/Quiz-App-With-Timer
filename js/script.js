const startBtn = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const exitBtn = infoBox.querySelector(".buttons .quit");
const continueBtn = infoBox.querySelector(".buttons .restart");

const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");

const optionList = document.querySelector(".option_list");
const timeLine = document.querySelector(".time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

const restartQuiz = resultBox.querySelector(".buttons .restart");
const quitQuiz = resultBox.querySelector(".buttons .quit");
const nextBtn = document.querySelector("footer .next_btn");
const bottomQuestionCounter = document.querySelector("footer .total_que");

const popupOverlay = document.querySelector(".popup-overlay");
const closeInfoBtn = document.querySelector(".close_info");
const closeQuizBtn = document.querySelector(".close_quiz");
const darkModeToggle = document.getElementById("darkModeToggle");

let timeValue = 15;
let questionCount = 0;
let questionNumber = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function showOverlay() {
    if (popupOverlay) {
        popupOverlay.classList.add("active");
    }
}

function hideOverlay() {
    if (popupOverlay) {
        popupOverlay.classList.remove("active");
    }
}

function resetQuizData() {
    timeValue = 15;
    questionCount = 0;
    questionNumber = 1;
    userScore = 0;
    widthValue = 0;

    clearInterval(counter);
    clearInterval(counterLine);

    nextBtn.classList.remove("show");
    timeText.textContent = "Time Left";
    timeCount.textContent = "15";
    timeLine.style.width = "0px";
}

startBtn.onclick = () => {
    infoBox.classList.add("activeInfo");
    showOverlay();
};

exitBtn.onclick = () => {
    infoBox.classList.remove("activeInfo");
    hideOverlay();
};

continueBtn.onclick = () => {
    infoBox.classList.remove("activeInfo");
    quizBox.classList.add("activeQuiz");
    showOverlay();

    resetQuizData();
    showQuestions(questionCount);
    questionCounter(questionNumber);
    startTimer(timeValue);
    startTimerLine(widthValue);
};

if (closeInfoBtn) {
    closeInfoBtn.onclick = () => {
        infoBox.classList.remove("activeInfo");
        hideOverlay();
    };
}

if (closeQuizBtn) {
    closeQuizBtn.onclick = () => {
        quizBox.classList.remove("activeQuiz");
        hideOverlay();
        resetQuizData();
    };
}

restartQuiz.onclick = () => {
    resultBox.classList.remove("activeResult");
    quizBox.classList.add("activeQuiz");
    showOverlay();

    resetQuizData();
    showQuestions(questionCount);
    questionCounter(questionNumber);
    startTimer(timeValue);
    startTimerLine(widthValue);
};

quitQuiz.onclick = () => {
    resultBox.classList.remove("activeResult");
    hideOverlay();
    resetQuizData();
};

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        questionNumber++;

        showQuestions(questionCount);
        questionCounter(questionNumber);

        clearInterval(counter);
        clearInterval(counterLine);

        startTimer(timeValue);
        startTimerLine(widthValue);

        timeText.textContent = "Time Left";
        nextBtn.classList.remove("show");
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        showResult();
    }
};

function showQuestions(index) {
    const questionText = document.querySelector(".que_text");

    let questionTag = "<span>" + questions[index].numb + ". " + questions[index].question + "</span>";

    let optionTag =
        '<div class="option"><span>' + questions[index].options[0] + "</span></div>" +
        '<div class="option"><span>' + questions[index].options[1] + "</span></div>" +
        '<div class="option"><span>' + questions[index].options[2] + "</span></div>" +
        '<div class="option"><span>' + questions[index].options[3] + "</span></div>";

    questionText.innerHTML = questionTag;
    optionList.innerHTML = optionTag;

    const option = optionList.querySelectorAll(".option");

    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

function optionSelected(answer) {
    clearInterval(counter);
    clearInterval(counterLine);

    let userAnswer = answer.textContent.trim();
    let correctAnswer = questions[questionCount].answer;
    let allOptions = optionList.children.length;

    if (userAnswer === correctAnswer) {
        userScore++;
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", tickIcon);
    } else {
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIcon);

        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent.trim() === correctAnswer) {
                optionList.children[i].setAttribute("class", "option correct");
                optionList.children[i].insertAdjacentHTML("beforeend", tickIcon);
            }
        }
    }

    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add("disabled");
    }

    nextBtn.classList.add("show");
}

function showResult() {
    infoBox.classList.remove("activeInfo");
    quizBox.classList.remove("activeQuiz");
    resultBox.classList.add("activeResult");
    showOverlay();

    const scoreText = resultBox.querySelector(".score_text");
    let percentage = Math.round((userScore / questions.length) * 100);
    let message = "";

    if (percentage >= 80) {
        message = "Excellent work!";
    } else if (percentage >= 50) {
        message = "Good job, keep practicing.";
    } else {
        message = "You need more practice.";
    }

    let scoreTag =
        "<span>You got <p>" +
        userScore +
        "</p> out of <p>" +
        questions.length +
        "</p></span>" +
        "<span>Your percentage is <p>" +
        percentage +
        "%</p></span>" +
        "<span>" +
        message +
        "</span>";

    scoreText.innerHTML = scoreTag;
}

function startTimer(time) {
    clearInterval(counter);

    timeCount.textContent = time;

    counter = setInterval(function () {
        time--;

        if (time < 10 && time >= 0) {
            timeCount.textContent = "0" + time;
        } else {
            timeCount.textContent = time;
        }

        if (time <= 5 && time >= 0) {
            timeCount.style.background = "#ff4d6d";
            timeCount.style.color = "#ffffff";
        } else {
            timeCount.style.background = "#ffffff";
            timeCount.style.color = "#241f5d";
        }

        if (time <= 0) {
            clearInterval(counter);
            clearInterval(counterLine);

            timeText.textContent = "Time Off";
            timeCount.textContent = "00";

            let correctAnswer = questions[questionCount].answer;
            let allOptions = optionList.children.length;

            for (let i = 0; i < allOptions; i++) {
                if (optionList.children[i].textContent.trim() === correctAnswer) {
                    optionList.children[i].setAttribute("class", "option correct");
                    optionList.children[i].insertAdjacentHTML("beforeend", tickIcon);
                }
            }

            for (let i = 0; i < allOptions; i++) {
                optionList.children[i].classList.add("disabled");
            }

            nextBtn.classList.add("show");
        }
    }, 1000);
}

function startTimerLine(time) {
    clearInterval(counterLine);

    timeLine.style.width = "0px";
    time = 0;

    counterLine = setInterval(function () {
        time += 1;

        let quizWidth = quizBox.offsetWidth;
        let lineWidth = (time / 515) * quizWidth;

        timeLine.style.width = lineWidth + "px";

        if (time >= 515) {
            clearInterval(counterLine);
        }
    }, 29);
}

function questionCounter(index) {
    let totalQuestionCountTag =
        "<span><p>" +
        index +
        "</p> of <p>" +
        questions.length +
        "</p> Questions</span>";

    bottomQuestionCounter.innerHTML = totalQuestionCountTag;
}

if (darkModeToggle) {
    darkModeToggle.onclick = () => {
        document.documentElement.classList.toggle("dark-mode");

        if (document.documentElement.classList.contains("dark-mode")) {
            darkModeToggle.textContent = "☀️";
        } else {
            darkModeToggle.textContent = "🌙";
        }
    };
}