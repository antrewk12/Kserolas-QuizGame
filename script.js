let allQuestions = [];
let categories = [
    { name: "Επιστήμη", file: "science.json" },
    { name: "Ιστορία", file: "history.json" },
    { name: "Αθλητικά", file: "sports.json" },
    { name: "Γεγονότα", file: "famousevents.json"},
    { name: "Γεωγραφία", file: "questions.json"},
    { name: "Ποπ Μουσική", file: "music.json"},
    { name: "Kινηματογράφος", file: "movies.json"},
    { name: "Math Wars", file: "math.json"},
];
var currentQuestion = 0;
var score = 0;
var timeInterval;
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const bgMusic = new Audio('sounds/soundtrack.mp3');

var strButtonElement = document.getElementById('strButton');
var categoryButtonElement = document.getElementById('categoryButton');
var categoriesElement = document.getElementById('categories');
var quizElement = document.getElementById('quiz');
var answersEl = document.getElementById('answers');
var questionsElement = document.getElementById('questions');
var scoreElement = document.getElementById('score');
var timeElement = document.getElementById('timeBox');
var timeBox = document.getElementById('timeBox');
const progressCircle = document.querySelector('.time svg circle:nth-child(2)');

strButtonElement.addEventListener('click', () => startQuiz('questions.json'));
categoryButtonElement.addEventListener('click', chooseCategory);

function chooseCategory()
{
    strButtonElement.style.display = 'none';
    categoryButtonElement.style.display = 'none';
    
    categoriesElement.style.display = 'flex';
    categoriesElement.innerHTML = '';


    categories.forEach(category => {
        var button = document.createElement('button');
        button.classList.add('categoryButton');
        button.textContent = category.name;

        button.addEventListener('click', () => addCategory(category.file));

        categoriesElement.appendChild(button);
    })
}

function addCategory(file)
{
    categoriesElement.style.display = 'none';

    startQuiz(file);
}

async function startQuiz(file) {

    const fileName = file || 'questions.json';

    const response = await fetch(fileName);
    if(!response.ok) throw new Error("To arxeio json den vrethike");

    let data = await response.json();
    console.log("Ερωτήσεις που φορτώθηκαν:", allQuestions);

    data.sort(() => Math.random()-0.5);

    allQuestions = data.slice(0,20);
    
    categoryButtonElement.style.display = 'none';
    strButtonElement.style.display = 'none';
    quizElement.style.display = 'block';

    currentQuestion = 0;
    score = 0;

    bgMusic.loop = true;
    bgMusic.volume = 0.1; 
    bgMusic.play();

    showRandomQuestions();
    
}

function showRandomQuestions() {

    StartTimer();

    let q = allQuestions[currentQuestion];
    questionsElement.textContent = `${q.question}`;
    var answers = [...q.options];
    answersEl.innerHTML = ''; //katharizoume ta palia koumpia

    answers.forEach((answer, index) => {
        var button = document.createElement('button');
        button.classList.add('answer-button');
        button.textContent = answer;

        button.addEventListener('click', () => checkAnswer(button, index, q.correct));

        answersEl.appendChild(button);
    })
}

function checkAnswer(button, selectedIndex, correctIndex) {

    clearInterval(timeInterval);

    if(selectedIndex == correctIndex) {
        correctSound.play();
        button.classList.add('correct');
        score++;
    }
    else
    {
        wrongSound.play();
        button.classList.add('wrong');
    }

    scoreElement.textContent = `score ${score}/${allQuestions.length}`;

    const buttons = answersEl.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
    currentQuestion++;
    if(currentQuestion < allQuestions.length)
    {
        showRandomQuestions();
    }
    else
    {
        questionsElement.textContent = "Tο Quiz Ολοκληρώθηκε";
        answersEl.innerHTML = '';
        strButtonElement.style.display = 'block';
        strButtonElement.textContent = "Νέο Quiz";
        categoryButtonElement.style.display ='block';
        categoryButtonElement.textContent = "Κατηγορίες";
        categoriesElement.style.display = 'none';
    }
}, 2000);

}

function StartTimer()
{
    let timerCount = 10;
    const timerLine = 440;
    const totalTime = 10;

    const timeElement = document.getElementById('time');
    timeBox.textContent = timerCount;


    progressCircle.style.strokeDashoffset = 0;
    clearInterval(timeInterval);

    timeInterval = setInterval(() => {
        timerCount--;
        timeBox.textContent = timerCount;

        let offset = timerLine - (timerCount * (timerLine / totalTime));
        progressCircle.style.strokeDashoffset = offset;

        if (timerCount <= 0) {
            clearInterval(timeInterval);
            TimerEnd(); // Συνaρτηση που καλείται όταν λήξει ο χρονος
        }
    }, 1000); 

    timeElement.style.display = 'flex';
}

function TimerEnd() {
    
    progressCircle.style.strokeDashoffset = 440; // Βαλε το animation na pigainei sto 0
    alert("Tέλος Χρόνου");

    const buttons = answersEl.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
    currentQuestion++;
    if(currentQuestion < allQuestions.length)
    {
        showRandomQuestions();
    }
    else
    {
        questionsElement.textContent = "Tο Quiz Ολοκληρώθηκε";
        answersEl.innerHTML = '';
        strButtonElement.style.display = 'block';
        strButtonElement.textContent = "Nέο Quiz";
    }
}, 2000);


}


