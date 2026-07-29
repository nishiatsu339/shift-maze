let mazeSize = 51;
const maze = document.getElementById('maze');

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');

const easyButton = document.getElementById('easyButton');
const normalButton = document.getElementById('normalButton');
const hardButton = document.getElementById('hardButton');

let difficulty = 'normal';

easyButton.addEventListener('click', function(){
    difficulty = 'easy';
    mazeSize = 21;
    maze.style.gridTemplateColumns = `repeat(${mazeSize}, 1fr)`;
    maze.style.gridTemplateRows = `repeat(${mazeSize}, 1fr)`;
    initGame();
    piece.style.width = '30px';
    piece.style.height = '30px';
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    instructionScreen.style.display = 'flex';
});

normalButton.addEventListener('click', function(){
    difficulty = 'normal';
    mazeSize = 51;
    maze.style.gridTemplateColumns = `repeat(${mazeSize}, 1fr)`;
    maze.style.gridTemplateRows = `repeat(${mazeSize}, 1fr)`;
    initGame();
    piece.style.width = '15px';
    piece.style.height = '15px';
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    instructionScreen.style.display = 'flex';
});

hardButton.addEventListener('click', function(){
    difficulty = 'hard';
    mazeSize = 71;
    maze.style.gridTemplateColumns = `repeat(${mazeSize}, 1fr)`;
    maze.style.gridTemplateRows = `repeat(${mazeSize}, 1fr)`;
    initGame();
    piece.style.width = '10px';
    piece.style.height = '10px';
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    instructionScreen.style.display = 'flex';
});

const clearScreen = document.getElementById('clearScreen');
const retryButton = document.getElementById('retryButton');
const homeButton = document.getElementById('homeButton');

retryButton.addEventListener('click', function(){
    clearTimeout(alertTimeoutId);
    clearTimeout(mazeTimeoutId);
    clearTimeout(goalTimeoutId);
    maze.innerHTML = '';
    isGoalReached = false;
    timerStarted = false;
    startSignStarted = false;

    document.getElementById('timerDisplay').textContent = '00:00';

    initGame();
    setPieceSize();

    clearScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
});

homeButton.addEventListener('click', function(){
    clearTimeout(alertTimeoutId);
    clearTimeout(mazeTimeoutId);
    clearTimeout(goalTimeoutId);
    maze.innerHTML = '';
    isGoalReached = false;
    timerStarted = false;
    startSignStarted = false;

    document.getElementById('timerDisplay').textContent = '00:00';

    clearScreen.style.display = 'none';
    startScreen.style.display = 'flex';
})

// const bgm = new Audio('sound/bgm.mp3');
// bgm.loop = true;
// let bgmStarted = false;

let pillars;
let goal;
let start;
let piece;
const directions = [
    {dx: 0, dy: -1},
    {dx: 0, dy: 1},
    {dx: -1, dy: 0},
    {dx: 1, dy: 0}
];

function initGame(){
    for(let i = 0; i < mazeSize; i++){
        for(let j = 0; j < mazeSize; j++){
            const coordinate = document.createElement('div');
            coordinate.classList.add('cells');
            coordinate.dataset.x = i;
            coordinate.dataset.y = j;
            maze.appendChild(coordinate);
            if(i === 0 || i === mazeSize - 1 || j === 0 || j === mazeSize - 1){
                coordinate.classList.add('border-wall');
            }else if(i % 2 === 0 && j % 2 === 0){
                coordinate.classList.add('pillar');
            }
        }
    }

    pillars = document.querySelectorAll('.pillar');
    pillars.forEach(function(pillar){
        let direction;
        let newX;
        let newY;
        let wallElement;
        const x = Number(pillar.dataset.x);
        const y = Number(pillar.dataset.y);

        do{
            direction = directions[Math.floor(Math.random() * 4)];
            newX = x + direction.dx;
            newY = y + direction.dy;
            wallElement = document.querySelector(`[data-x="${newX}"][data-y="${newY}"]`);
        }while(wallElement.classList.contains('wall'));

        wallElement.classList.add('wall');
    });

    start = document.querySelector(`[data-x = "0"][data-y = "1"]`);
    goal = document.querySelector(`[data-x="${mazeSize - 1}"][data-y="${mazeSize - 2}"]`);
    start.classList.remove('border-wall');
    goal.classList.remove('border-wall');
    goal.classList.add('goal-marker');

    piece = document.createElement('div');
    piece.classList.add('koma');
    piece.dataset.x = start.dataset.x;
    piece.dataset.y = start.dataset.y;
    start.appendChild(piece);
}


let timerStarted = false;
const startSign = new Audio('start.mp3');
let startSignStarted = false;
document.addEventListener('keydown', function(event){
    if(!timerStarted){
        instructionScreen.style.display = 'none';
        scheduleNextGoalChange();
        scheduleNextMazeChange();
        startTimer();
        timerStarted = true;
    }
    // if(!bgmStarted){
    //     bgm.play();
    //     bgmStarted = true;
    // }

    if(!startSignStarted){
        startSign.play();
        startSignStarted = true;
    }

    let dx = 0;
    let dy = 0;
    const x = Number(piece.dataset.x);
    const y = Number(piece.dataset.y);

    if(event.key === 'a'){
        dy = -1;
    }else if(event.key === 'd'){
        dy = 1;
    }else if(event.key === 'w'){
        dx = -1;
    }else if(event.key === 's'){
        dx = 1;
    }

    const midX = x + dx  ;
    const midY = y + dy  ;

    midElement = document.querySelector(`[data-x="${midX}"][data-y="${midY}"]`);
    if(!midElement.classList.contains('wall') && !midElement.classList.contains('pillar') && !midElement.classList.contains('border-wall')){
        const newX = x + dx;
        const newY = y + dy;
        const newCell = document.querySelector(`[data-x="${newX}"][data-y="${newY}"]`)
        newCell.appendChild(piece);
        piece.dataset.x = newX;
        piece.dataset.y = newY;


        if(newX === Number(goal.dataset.x) && newY === Number(goal.dataset.y)){
            isGoalReached = true;
            clearTimeout(goalTimeoutId);
            clearInterval(timerDisplayIntervalId);

            const clearsound = new Audio('clear.mp3');
            clearsound.play();

            const clearTimeDisplay = document.getElementById('clearTimeDisplay');
            clearTimeDisplay.textContent = document.getElementById('timerDisplay').textContent;

            clearScreen.style.display = 'flex';
        }
    }
});

function setPieceSize(){
    if(difficulty === 'easy'){
        piece.style.width = '30px';
        piece.style.height = '30px';
    }else if(difficulty === 'normal'){
        piece.style.width = '15px';
        piece.style.height = '15px';
    }else if(difficulty === 'hard'){
        piece.style.width = '10px';
        piece.style.height = '10px';
    }
}

function regenerateMaze(){
    const walls = document.querySelectorAll('.wall');
    walls.forEach(function(wall){
        wall.classList.remove('wall');
    });

    pillars.forEach(function(pillar){
        let direction;
        let newX;
        let newY;
        let wallElement;

        const x = Number(pillar.dataset.x);
        const y = Number(pillar.dataset.y);

        do{
            direction = directions[Math.floor(Math.random() * 4)];
            newX = x + direction.dx;
            newY = y + direction.dy;
            wallElement = document.querySelector(`[data-x="${newX}"][data-y="${newY}"]`);
        }while(wallElement.classList.contains('wall') || wallElement.querySelector('.koma'));

        wallElement.classList.add('wall');
    });
}


let checkElement;
let goalCandidataElement;

function regenerateGoal(){
    do{
        const sides = ['top', 'bottom', 'left', 'right'];
        const side = sides[Math.floor(Math.random() * 4)];

        let candidataX;
        let candidataY;
        const randomEven = Math.floor(Math.random() * ((mazeSize + 1) / 2)) * 2 - 1;

        if(side === 'top'){
            candidataX = 0;
            candidataY = randomEven;
        }else if(side === 'bottom'){
            candidataX = mazeSize - 1;
            candidataY = randomEven;
        }else if(side === 'left'){
            candidataX = randomEven;
            candidataY = 0;
        }else if(side === 'right'){
            candidataX = randomEven;
            candidataY = mazeSize - 1;
        }

        let checkX;
        let checkY;

        if(side === 'top'){
            checkX = 1;
            checkY = randomEven;
        }else if(side === 'bottom'){
            checkX = mazeSize - 2;
            checkY = randomEven;
        }else if(side === 'left'){
            checkX = randomEven;
            checkY = 1;
        }else if(side === 'right'){
            checkX = randomEven;
            checkY =mazeSize - 2;
        }

        checkElement = document.querySelector(`[data-x="${checkX}"][data-y="${checkY}"]`);
        goalCandidataElement = document.querySelector(`[data-x="${candidataX}"][data-y="${candidataY}"]`);

    }while(checkElement.classList.contains('wall') || goalCandidataElement === start);

    goal.classList.add('border-wall');
    goal.classList.remove('goal-marker');
    goalCandidataElement.classList.remove('border-wall');
    goalCandidataElement.classList.add('goal-marker');
    goal = goalCandidataElement;
}


let isGoalReached = false;

let alertTimeoutId;
let mazeTimeoutId;

function scheduleNextMazeChange(){
    if(isGoalReached) return;

    const randomInterval = Math.floor(Math.random() * 4000) + 4000;
    const alertDelay = randomInterval - 500

    alertTimeoutId = setTimeout(function(){
        if(isGoalReached) return;
        const alertSound = new Audio('alert.mp3');
        alertSound.play();

        maze.classList.add('warning-pulse');

        setTimeout(function(){
            maze.classList.remove('warning-pulse');
        }, 500);
    }, alertDelay);

    mazeTimeoutId = setTimeout(function(){
        if(isGoalReached) return;
        regenerateMaze();
        scheduleNextMazeChange();
    }, randomInterval);
}

let startTime;
let timerDisplayIntervalId;

function startTimer(){
    startTime = Date.now();
    timerDisplayIntervalId = setInterval(updataTimerDisplay, 100);
}

function updataTimerDisplay(){
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;

    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = String(minutes).padStart(2, '0') + ':' + String(displaySeconds).padStart(2, '0');
}

let goalTimeoutId;

function scheduleNextGoalChange(){
    if(isGoalReached) return;

    const randomGoalInterval = Math.floor(Math.random() * 11000) + 12000;

    goalTimeoutId = setTimeout(function(){
        if(isGoalReached) return;
        regenerateGoal();
        scheduleNextGoalChange();
    }, randomGoalInterval);
}
