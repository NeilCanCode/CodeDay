const gameArea = document.getElementById('game-area');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const feedbackElement = document.getElementById('feedback');

let playerX = 0;
let playerY = 0;
const cellSize = 40; 
const playerSize = 30; 
const flagSize = 20;
const mazeWidth = 20;
const mazeHeight = 15; 
let maze = []; 
let currentFlagIndex = 0; 
let isPaused = false;
let wrongAnswers = 0;


const questions = [
    { question: "What is the capital of France?", answer: "paris" },
    { question: "Who wrote 'Romeo and Juliet'?", answer: "shakespeare" },
    { question: "What is the chemical symbol for water?", answer: "h2o" },
    { question: "How many continents are there?", answer: "seven" },
    { question: "What planet is known as the Red Planet?", answer: "mars" },
    { question: "What is the largest mammal on Earth?", answer: "whale" },
    { question: "What is the boiling point of water?", answer: "100" },
    { question: "Who painted the Mona Lisa?", answer: "da vinci" },
    { question: "What is the fastest land animal?", answer: "cheetah" },
    { question: "What is the largest country by land area?", answer: "russia" },
    { question: "What element does 'O' represent on the periodic table?", answer: "oxygen" },
    { question: "What is the main ingredient in guacamole?", answer: "avocado" },
    { question: "Who discovered gravity?", answer: "newton" },
    { question: "What is the longest river in the world?", answer: "nile" },
    { question: "What is the largest ocean on Earth?", answer: "pacific" },
    { question: "What is the hardest natural substance on Earth?", answer: "diamond" },
    { question: "Who is the current President of the United States?", answer: "biden" },
    { question: "How many bones are there in the human body?", answer: "206" },
    { question: "What is the tallest mountain in the world?", answer: "everest" },
    { question: "What is the primary color of a ripe banana?", answer: "yellow" }
];




const flagPositions = [
    { x: 1, y: 1 },  
    { x: 5, y: 1 },  
    { x: 5, y: 5 }, 
    { x: 15, y: 13 } 
];


function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}


function generateMaze() {
    shuffleQuestions(); 

    maze = Array.from({ length: mazeHeight }, () => Array(mazeWidth).fill(1));

   
    createPath();

    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
            if (maze[y][x] === 1) {
                const wall = document.createElement('div');
                wall.className = 'wall';
                wall.style.width = cellSize + 'px';
                wall.style.height = cellSize + 'px';
                wall.style.left = x * cellSize + 'px';
                wall.style.top = y * cellSize + 'px';
                gameArea.appendChild(wall);
            }
        }
    }

    
    placeFlags();
}


function createPath() {
 
    const pathCoordinates = [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 },
        { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 },
        { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 },
        { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 },
        { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 13, y: 5 },
        { x: 14, y: 5 }, { x: 15, y: 5 }, { x: 15, y: 6 }, { x: 15, y: 7 },
        { x: 15, y: 8 }, { x: 15, y: 9 }, { x: 15, y: 10 }, { x: 15, y: 11 },
        { x: 15, y: 12 }, { x: 15, y: 13 },
    ];

    pathCoordinates.forEach(coord => {
        maze[coord.y][coord.x] = 0; 
    });
}


function placeFlags() {
    flagPositions.forEach((pos, index) => {
        const flag = document.createElement('div');
        flag.className = 'flag';
        flag.style.width = flagSize + 'px';
        flag.style.height = flagSize + 'px';
        flag.style.left = pos.x * cellSize + (cellSize - flagSize) / 2 + 'px';
        flag.style.top = pos.y * cellSize + (cellSize - flagSize) / 2 + 'px';
        flag.dataset.index = index;
        gameArea.appendChild(flag);
    });
}

function resetPlayerPosition() {
    playerX = 0;
    playerY = 0;
    updatePlayerPosition();
}

function updatePlayerPosition() {
    player.style.left = playerX * cellSize + (cellSize - playerSize) / 2 + 'px';
    player.style.top = playerY * cellSize + (cellSize - playerSize) / 2 + 'px';
}


function movePlayer(dx, dy) {
    if (isPaused) return;

    const newX = playerX + dx;
    const newY = playerY + dy;

    if (canMoveTo(newX, newY)) {
        playerX = newX;
        playerY = newY;
        updatePlayerPosition();
        checkForFlag();
    }
}

function canMoveTo(x, y) {
    return (
        x >= 0 &&
        y >= 0 &&
        x < mazeWidth &&
        y < mazeHeight &&
        maze[y][x] === 0
    );
}


function checkForFlag() {
    const currentFlagPos = flagPositions[currentFlagIndex];
    if (playerX === currentFlagPos.x && playerY === currentFlagPos.y) {
        showQuestion(questions[currentFlagIndex]);
    }
}


function showQuestion(questionObj) {
    questionElement.textContent = questionObj.question;
    questionContainer.style.display = 'block';
    answerInput.value = '';
    feedbackElement.textContent = '';
    isPaused = true;
}


document.getElementById('submit-answer').addEventListener('click', () => {
    const userAnswer = answerInput.value.trim().toLowerCase();
    if (userAnswer === questions[currentFlagIndex].answer) {
        feedbackElement.textContent = 'Correct! You may continue.';
        feedbackElement.style.color = 'green';
        removeFlag(currentFlagIndex);
        currentFlagIndex++;

      
        if (currentFlagIndex === flagPositions.length) {
            feedbackElement.textContent = "Congratulations! You've completed the maze!";
            isPaused = true;
            displayCompletionButton();  
        } else {
            isPaused = false;
            questionContainer.style.display = 'none';
        }
    } else {
        wrongAnswers++;
        feedbackElement.textContent = 'Wrong answer, try again!';
        feedbackElement.style.color = 'red';

        if (wrongAnswers >= 2) {
            feedbackElement.textContent = 'You have answered incorrectly twice! Resetting to start.';
            setTimeout(() => {
                resetPlayerPosition();
                questionContainer.style.display = 'none';
                currentFlagIndex = 0;
                isPaused = false;
                wrongAnswers = 0;
                restoreFlags();
            }, 2000);
        }
    }
});

// Function to display the button and redirect
// Function to display the button and redirect to m.html
function displayCompletionButton() {
    // Create a new button element
    const completeButton = document.createElement('button');
    completeButton.textContent = "Next level";
    completeButton.className = 'complete-btn'; // Add some styling class if necessary

    // Style the button (if needed)
    completeButton.style.display = 'block'; // Ensure it's a block element
    completeButton.style.margin = '20px auto'; // Add some margin to center it below the game area
    completeButton.style.borderRadius = '50%';
    // Append the button after the game area
    gameArea.parentElement.appendChild(completeButton);

    // Add event listener to redirect when clicked
    completeButton.addEventListener('click', () => {
        window.location.href = 'm.html';  // Redirects to m.html in the same directory
    });
}


function removeFlag(index) {
    const flags = document.getElementsByClassName('flag');
    flags[index].style.display = 'none';
}


function restoreFlags() {
    const flags = document.getElementsByClassName('flag');
    Array.from(flags).forEach(flag => {
        flag.style.display = 'block';
    });
}


const player = document.createElement('div');
player.className = 'player';
player.style.width = playerSize + 'px';
player.style.height = playerSize + 'px';
gameArea.appendChild(player);


document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
        case 's':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
        case 'a':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
            movePlayer(1, 0);
            break;
    }
});

generateMaze();
resetPlayerPosition();
