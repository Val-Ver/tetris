window.addEventListener("load", main);

//фигуры I, L, T, O, S, Z, J;
const cell = 30;
const cols = 10;
const rows = 20;

let game = false;
let gameover = false;
let pause = false;

let score = 0;
let scoreAll = 0;
let level = 0;
let speed = 1000;
let text = '';

const updateLevel = 100;
const speedMax = 400;

function main() {
	const canvas = document.getElementById("GameBoard");
	const ctx = canvas.getContext('2d');

	updateScore();
	cleanPage(ctx);

	getPauseButtonAndPauseClick();
	getStartButtonAndStartClick(ctx);
}

function getStartButtonAndStartClick(ctx) {
	const startButton = document.getElementById("startButton");
	startButton.onclick = () => {
		beginGame(ctx, startButton);
	}
	// document.addEventListener('keydown', (event) => {
	// 	if(!game || gameover) {
	// 		if(event.key == 'ArrowDown') {
	// 			event.preventDefault();
	// 			beginGame(ctx, startButton);
	// 		}	
	// 	}
	// })
}

function beginGame(ctx, startButton) {
		if(gameover) {
			document.getElementById("grave").remove();
			document.getElementById("graveText").remove()
			gameover = false;
		}
		if(!game) {
			game = true;
			start(ctx);
			startButton.textContent = "PLAY AGAIN";	
		} else {
			startButton.textContent = "PLAY";
			document.getElementById("pauseButton").textContent = "PAUSE";
			updateGlobalData();
			updateScore();
			cleanPage(ctx);
		}
}

function updateGlobalData() {
	game = false;
	pause = false;
	score = 0;
	level = 0;
	speed = 1000; 
	text = '';
}

function updateScore() {
	scoreAll = localStorage.getItem('max_score_tetris');
	document.querySelector('.scoreAll').textContent = scoreAll;
	document.querySelector('.score').textContent = score;
	document.querySelector('.level').textContent = level;
	document.querySelector('.speed').textContent = text + speed/1000 + ' second';
}

function getPauseButtonAndPauseClick() {
	const pauseButton = document.getElementById("pauseButton");
	pauseButton.onclick = () => {
		pausegame(pauseButton);
	}
	document.addEventListener('keydown', (event) => {
		if(event.key == ' ') {
			event.preventDefault();
			pausegame(pauseButton);
		}
	})
}

function pausegame(pauseButton) {
	if(!game) { return }
	if(!pause) {
		pauseButton.textContent = "PLAY";
		pause = true;
	} else {
		pauseButton.textContent = "PAUSE";			
		pause = false;
	}
}

function start(ctx) {
	let playField = createGrid();
	let tetraminoSequence = generateFigureSequence();
	let tetraminoCurrent = getCurrentFigure(tetraminoSequence);
	let tetraminoNext = getNextFigure(tetraminoSequence);
	drawNextFigure(ctx, tetraminoCurrent);

	playGame(ctx, playField, tetraminoSequence, tetraminoCurrent, tetraminoNext);		
}

function playGame(ctx, playField, tetraminoSequence, tetraminoCurrent, tetraminoNext) {
	let lastTime = 0;
	let requestId;
	let speedDown = speed;
	
	function loopGame(timestamp) {
		if(!lastTime) { lastTime = timestamp }
		
		let delta = timestamp - lastTime;
		if(delta > speed && !gameover && !pause) {
			lastTime = timestamp;
			updateGame();
		}

		draw(ctx, playField, tetraminoCurrent, tetraminoNext);	
		
		if(game && !gameover) {
			requestId = requestAnimationFrame(loopGame);
		}
	}
	
	function updateGame() {
		tetraminoCurrent.row++;
		if(!isFigureMove(playField, tetraminoCurrent)) {
			tetraminoCurrent.row--; 
			placeFigureInGameMap(playField, tetraminoCurrent);
			checkLine(playField);
			tetraminoCurrent = getCurrentFigure(tetraminoSequence);
			if(tetraminoSequence.length == 0) {tetraminoSequence = generateFigureSequence()}
			tetraminoNext = getNextFigure(tetraminoSequence);
		//if(!isFigureMove(playField, tetraminoCurrent)) { gameOver(); }
		}
	}

	function handleKeyPress(event) {
		if(pause || gameover) { return } 
		if (event.key === 'ArrowDown') {
			handleKeyDown();
			return;
		}
		changeClickOrKeyPress(event.key);
	}
	document.addEventListener('keydown', handleKeyPress);
	requestId = requestAnimationFrame(loopGame);

	const buttonGame = document.querySelectorAll('.game-button');
	buttonGame.forEach((button) => {
		button.addEventListener('click', () => {
	  		if(pause || gameover) { return } 
			const valueButton = button.dataset.value;
			if (valueButton === 'ArrowDown') {
				while(isFigureMove(playField, tetraminoCurrent)) {
					tetraminoCurrent.row++;
				}
				tetraminoCurrent.row--
				return;
			}
			changeClickOrKeyPress(valueButton);
		})
	})

	function changeClickOrKeyPress(value) {
		switch(value) {
			case 'ArrowUp':
				let rotateTetramino = rotateFigure(tetraminoCurrent);
				if(isFigureMove(playField, rotateTetramino)) {
					tetraminoCurrent.matrix = rotateTetramino.matrix;	
				}
				break;
				
			case 'ArrowLeft':
				moveLeftOrRight(playField, tetraminoCurrent, -1);						
				break;

			case 'ArrowRight':
				moveLeftOrRight(playField, tetraminoCurrent, +1);			
				break;

			default:
				return;
		}
	}
	
	function handleKeyDown() {
		speed = speed * 0.5;
		document.addEventListener('keyup', handleKeyUp);
				
		if(!isFigureMove(playField, tetraminoCurrent)) {
			tetraminoCurrent.row--;
		}
	}
	
	function handleKeyUp() {
		speed = speedDown;
		document.removeEventListener('keyup', handleKeyUp);
	}
}

function moveLeftOrRight(grid, figureCurrent, step) {
	figureCurrent.col += step;
	if(!isFigureMove(grid, figureCurrent)) {
		figureCurrent.col -= step;
	}
}

function setupInput() {
	document.addEventListener('keydown', handleKeyPress);
}

function gameOver() {
	gameover = true;

	const grave = document.createElement("div");
	grave.id = "grave";
	grave.textContent = String.fromCodePoint(0x1F480);
	grave.style.fontSize = '440px';
	grave.style.position = 'absolute';
	grave.style.left = 40 +'px';
	grave.style.top = 40 +'px';

	const graveText = document.createElement("div");
	graveText.id = "graveText";
	graveText.textContent = 'GAME OVER'
	graveText.style.color = 'red'
	graveText.style.fontSize = '108px';
	graveText.style.position = 'absolute';
	graveText.style.left = 8 +'px';
	graveText.style.top = 275 +'px';

	document.body.appendChild(grave);
	document.body.appendChild(graveText);
}




