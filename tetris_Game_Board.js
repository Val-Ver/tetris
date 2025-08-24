//фигуры I, L, T, O, S, Z, J;

const tetrominos = {
	'I': [
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0]
	],

	'O': [
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],

	'Z': [
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]

	],

	'S': [
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]

	],

	'T': [
		[1, 1, 1],
		[0, 1, 0],
		[0, 1, 0]
	],

	'L': [
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 1]
	],

	'J': [
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]
}

const colorTetrominos = {
	'I': 'cyan',
	'O': 'yellow',
	'Z': 'purple',
	'S': 'green',
	'T': 'red',
	'L': 'blue',
	'J': 'orange'
}

function createGrid() {
	let grid = [];
	for (let i = 0; i < rows; i++) {
		grid[i] = [];
		for (let j = 0; j < cols; j++) {
			grid[i][j] = 0; 
		}
	}
	return grid;
}

function generateFigureSequence() {
	let sequence = [];
	for (let key in colorTetrominos) {
		sequence.push(key);
	}
	let figureSequence = [];
	for (let i = 0; i < sequence.length; i++) {
		figureSequence.push(sequence[getRandomInt(0, sequence.length-1)]);
	}
	return figureSequence;
}

function getCurrentFigure(figureSequence) {
	let figureCurrentName = figureSequence.shift();
	let figureCurrentMatrix = tetrominos[figureCurrentName];

	// col - столбец, row - строка
	let col = cols / 2 - Math.ceil(figureCurrentMatrix[0].length / 2);
	let row;

	if(figureCurrentName == 'S' 
	|| figureCurrentName == 'Z'
	|| figureCurrentName == 'O') { 
		row = -2;
	} else { 
		row = -1;
	}

	let figureCurrent = { 
		name: figureCurrentName,
		matrix: figureCurrentMatrix,
		row: row,
		col: col	
	}
	return figureCurrent;
}

function getNextFigure(figureSequence) {
	let nextFigureName = figureSequence[0];
	return { 
		name: nextFigureName,
		matrix: tetrominos[nextFigureName] 
	}	
}

function isFigureMove(grid, figureCurrent) {
	for (let row = 0; row < figureCurrent.matrix.length; row++) {
		for (let col = 0; col < figureCurrent.matrix[row].length; col++) {
			if(!figureCurrent.matrix[row][col]) { 
				continue; 
			}
			if (figureCurrent.row + row >= rows
			|| figureCurrent.col + col >= cols
			|| figureCurrent.col + col < 0 ) { 
				return false; 
			}
			if(figureCurrent.row + row >= 0 
			&& grid[figureCurrent.row + row][figureCurrent.col + col]) {
				return false;
			}
		}	
	}
	return true;				
}

function placeFigureInGameMap(grid, figureCurrent) {
	for (let row = 0; row < figureCurrent.matrix.length; row++) {
		for (let col = 0; col < figureCurrent.matrix[row].length; col++) {
			if(figureCurrent.matrix[row][col]) {
 				if(figureCurrent.row + row < 0) { return gameOver() }
			grid[figureCurrent.row + row][figureCurrent.col + col] = figureCurrent.name; 		
			}
		}
	}
}

function rotateFigure(figureCurrent) {
	if(!figureCurrent) { return } 
	let rotateFigureMatrix = [];
	for(let row = 0; row < figureCurrent.matrix.length; row++) {
		let rotateRow = [];
		for(let col = 0; col < figureCurrent.matrix[row].length; col++) {
			rotateRow.push(figureCurrent.matrix[figureCurrent.matrix.length-1-col][row]);
		}
		rotateFigureMatrix.push(rotateRow);
	}

	let rotateFigure = {
		name: figureCurrent.name,
		matrix: rotateFigureMatrix,
		row: figureCurrent.row,
		col: figureCurrent.col	
	}
	return rotateFigure;
}

function checkLine(grid) {
	for(let row = rows - 1; row >= 0; row--) {
		if(grid[row].every(cell => cell != 0)) {
			grid.splice(row,1);
			let newRow = [];
			for(let col = 0; col < cols; col++) {
				newRow.push(0);
			}
			grid.unshift(newRow);
			row++;
			score += 10;
			if(score > scoreAll || scoreAll == undefined ) {
 				scoreAll = score;
				localStorage.setItem('max_score_tetris', scoreAll);
			};
			level = Math.floor(score / updateLevel);
			speed =  Math.max(speedMax, 1000 - level * 100);
			if(speed <= speedMax) { text = 'MAXIMUM ' }
			updateScore();
		}
	} 
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min+1)) + min;
}




