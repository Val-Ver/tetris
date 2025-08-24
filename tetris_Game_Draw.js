
function draw(ctx, playField, tetraminoCurrent, tetraminoNext) {
	drawNextFigure(ctx, tetraminoNext);
	ctx.clearRect(50, 50, cell * cols, cell * rows);
	drawCurrentFigure(ctx, playField, tetraminoCurrent); 
}

function cleanPage(ctx) {
	let playField = createGrid();
	drawGameBoard(ctx, playField);
	drawNextFigure(ctx);
}

function drawGameBoard(ctx, grid) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = "black";
	ctx.strokeRect(50, 50, cell * cols, cell * rows); // корды, ширина, высота

	ctx.fillStyle = "rgba(255, 255, 255, 1)";
	ctx.fillRect(50, 50, cell * cols, cell * rows);
	if(grid) {
		let fillStyle;

		for (let row = 0; row < grid.length; row++) {
			for (let col = 0; col < grid[row].length; col++) {
				ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
				if(grid[row][col] != 0) {
					fillStyle = colorTetrominos[grid[row][col]];
					ctx.fillStyle = fillStyle;
				}
				ctx.fillRect(50 + cell * col, 50 + cell * row, cell - 2, cell - 2);
			}	
		}
	}
}

function drawCurrentFigure(ctx, grid, figureCurrent) {
	if(!game) { drawGameBoard(ctx) } 
	else {
		drawGameBoard(ctx, grid);
		let x = 50 + cell * figureCurrent.col;
		let y = 50 + cell * figureCurrent.row;
	
		drawCellFigure(ctx, x, y, figureCurrent);
		ctx.clearRect(50, 0, cell * cols, 50 - 2 ); 
	}
}

function drawNextFigure(ctx, figureNext) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = "black";
	ctx.strokeRect(cell * cols + 90, 280, cell * 4 + 3, cell * 4 + 2); // корды, ширина, высота
	ctx.fillStyle = "rgba(255, 255, 255, 1)";	
	ctx.fillRect(cell * cols + 90, 280, cell * 4 + 3, cell * 4 + 2);

	if(game) {
		if(figureNext) {
			let x = cell * cols + 90;
			let y = 282;

			if(figureNext.matrix.length != 4){
				x = cell * cols + 90 + cell/2;
				y = 282 + cell/2;
			}
			drawCellFigure(ctx, x, y, figureNext);
		}
	}
}

function drawCellFigure(ctx, x, y, figure) {
	let fillStyle = colorTetrominos[figure.name];
	for (let row = 0; row < figure.matrix.length; row++) {
		for (let col = 0; col < figure.matrix[row].length; col++) {
			ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
			if(figure.matrix[row][col] != 0) {
				ctx.fillStyle = fillStyle;
			}
			ctx.fillRect(x + cell * col, y + cell * row, cell - 2, cell - 2);
		}
	}
}


