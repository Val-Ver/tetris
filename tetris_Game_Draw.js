
function draw(ctx, playField, tetraminoCurrent, tetraminoNext) {
	drawNextFigure(ctx, tetraminoNext);
	drawCurrentFigure(ctx, playField, tetraminoCurrent); 
}

function cleanPage(ctx) {
	let playField = createGrid();
	drawGameBoard(ctx, playField);
	drawNextFigure(ctx);
}

function drawGameBoard(ctx, grid) {
	let x = 50;
	let y = 50;
	const lineWidth = 3;
	ctx.clearRect(x - lineWidth, y, cell * cols + lineWidth, cell * rows); 

	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = "black";
	ctx.strokeRect(x - lineWidth, y, cell * cols + lineWidth, cell * rows); // корды, ширина, высота

	ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
	ctx.fillRect(x - lineWidth, y, cell * cols + lineWidth, cell * rows);

	if(grid) {
		let fillStyle;
		const lineWidth = 3;
		ctx.lineWidth = lineWidth;
		const cornerRadius = 0;
		for (let row = 0; row < grid.length; row++) {
			for (let col = 0; col < grid[row].length; col++) {
				ctx.fillStyle = "rgba(255, 255, 255, 0)";
				ctx.strokeStyle = "rgba(255, 255, 255, 0)";
				if(grid[row][col] != 0) {
					fillStyle = colorTetrominos[grid[row][col]];
					ctx.fillStyle = fillStyle;
					ctx.fillRect(x + cell * col, y + cell * row, cell - 2, cell - 2);
					drawCellShadow(ctx, x, y, lineWidth, cornerRadius, col, row);
				}
			}	
		}
	}

}

function drawCurrentFigure(ctx, grid, figureCurrent) {
	if(!game) { drawGameBoard(ctx); 
	} else {
		drawGameBoard(ctx, grid);
 		let x = 50 + cell * figureCurrent.col;
		let y = 50 + cell * figureCurrent.row;
	
		drawCellFigure(ctx, x, y, figureCurrent);
		ctx.clearRect(50, 0, cell * cols, 48);
		
		//const lineWidth = 3;
		//ctx.strokeStyle = "black";
		//ctx.lineWidth = lineWidth;
		//ctx.beginPath();
		//ctx.moveTo(50, 50); 
		//ctx.lineTo(cell * cols + 50, 50); 
		//ctx.stroke();

	}
}

function drawNextFigure(ctx, figureNext) {
	ctx.clearRect(cell * cols + 90, 290, cell * 4 + 3, cell * 4 + 2);
	ctx.lineWidth = 3;
	ctx.strokeStyle = "black";
	ctx.strokeRect(cell * cols + 90, 290, cell * 4 + 3, cell * 4 + 2); // корды, ширина, высота
	ctx.fillStyle = "rgba(255, 255, 255, 0.5)";	
	ctx.fillRect(cell * cols + 90, 290, cell * 4 + 3, cell * 4 + 2);

	if(game) {
		if(figureNext) {
			let x = cell * cols + 90;
			let y = 292;

			if(figureNext.matrix.length != 4){
				x = cell * cols + 90 + cell/2;
				y = 292 + cell/2;
			}
			drawCellFigure(ctx, x, y, figureNext);
		}
	}

}

function drawCellFigure(ctx, x, y, figure) {
	let fillStyle = colorTetrominos[figure.name];
	const lineWidth = 3;
	ctx.lineWidth = lineWidth;
	const cornerRadius = 0
	for (let row = 0; row < figure.matrix.length; row++) {
		for (let col = 0; col < figure.matrix[row].length; col++) {
			ctx.fillStyle = "rgba(255, 255, 255, 0)";
			ctx.strokeStyle = "rgba(255, 255, 255, 0)";
			if(figure.matrix[row][col] != 0) {
				ctx.fillStyle = fillStyle;
				ctx.fillRect(x + cell * col, y + cell * row, cell - 2, cell - 2);
				drawCellShadow(ctx, x, y, lineWidth, cornerRadius, col, row);
			} 
		}
	}
}

function drawCellShadow(ctx, x, y, lineWidth, cornerRadius, col, row) {
	ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
	ctx.beginPath();
	ctx.moveTo((x + cell * col) + cornerRadius, (y + cell * row) + lineWidth / 2);
	ctx.lineTo((x + cell * col) + cell - 2 - cornerRadius, (y + cell * row) + lineWidth / 2);
	ctx.moveTo((x + cell * col) + lineWidth / 2, (y + cell * row) + cornerRadius);
	ctx.lineTo((x + cell * col) + lineWidth / 2, (y + cell * row) + cell - 2 - cornerRadius);
	ctx.stroke();

	ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
	ctx.beginPath();
	ctx.moveTo((x + cell * col) + cell - lineWidth, (y + cell * row) + cornerRadius);
	ctx.lineTo((x + cell * col) + cell - lineWidth, (y + cell * row) + cell - 2 - cornerRadius);
	ctx.moveTo((x + cell * col) + cornerRadius, (y + cell * row) + cell - lineWidth);
	ctx.lineTo((x + cell * col) + cell - 2 - cornerRadius, (y + cell * row) + cell - lineWidth);
	ctx.stroke();
}
