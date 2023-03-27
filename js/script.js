const theBoard = new Board();
const ai = new AI();
const cells = document.querySelectorAll('.cell');
const buttons = document.querySelectorAll('.button');

//Board Reset
function reset(){
	cells.forEach(cell => cell.textContent = '');
	theBoard.boardState = ['','','','','','','','',''];
	theBoard.turn = 'X';
	theBoard.turnCount = 0;
	theBoard.win = false;
	theBoard.tie = false;
	const winMessage = document.getElementById('winMessage');
	winMessage.remove();

	cells.forEach(cell => cell.addEventListener('click', pickCell));

	const bar = document.getElementById('bar');
	bar.classList.add('hidden');
	overlay.classList.add('hidden');
};

function clickButton() {
	const p1 = document.getElementById('onePlayerButton');
	const p2 = document.getElementById('twoPlayerButton');
	const easy = document.getElementById('easyButton');
	const medium = document.getElementById('mediumButton');
	const hard = document.getElementById('hardButton');
	const row = document.getElementById('difficultyRow');

	switch(this.id) {
		case 'onePlayerButton':
			if(!this.classList.contains('selected')) {
				this.classList.add('selected');

				p2.classList.remove('selected');
				row.classList.remove('hidden');

				theBoard.players = 1;
			};
		break;

		case 'twoPlayerButton':
			if(!this.classList.contains('selected')) {
				this.classList.add('selected');

				p1.classList.remove('selected');
				row.classList.add('hidden');

				theBoard.players = 2;
			};
		break;

		case 'easyButton':
			if(!this.classList.contains('selected')) {
				this.classList.add('selected');

				medium.classList.remove('selected');
				hard.classList.remove('selected');

				ai.difficulty = 'easy';
			};
		break;

		case 'mediumButton':
			if(!this.classList.contains('selected')) {
				this.classList.add('selected');

				easy.classList.remove('selected');
				hard.classList.remove('selected');

				ai.difficulty = 'medium';
			};
		break;

		case 'hardButton':
			if(!this.classList.contains('selected')) {
				this.classList.add('selected');

				easy.classList.remove('selected');
				medium.classList.remove('selected');

				ai.difficulty = 'hard';
			};
		break;

		case 'startGameButton':
			buttons.forEach(button => button.removeEventListener('click', clickButton));

			reset();			

			const board = document.getElementById('gameBoard');
			board.classList.remove('hidden');
		break;

		default:
			console.log('No Button Found!');
		break;
	}
}

function Board() {
	this.players = 1;
	this.turn = 'X';
	this.turnCount = 0;
	this.root = true;
	this.boardState = ['','','','','','','','',''];

	this.clone = function(boardState, turn, move) {
		let clonedBoard = new Board;
		clonedBoard.players = this.players;
		clonedBoard.turn = turn === 'X' ? 'O' : 'X';
		clonedBoard.turnCount = this.turnCount + 1;
		clonedBoard.root = false;
		clonedBoard.boardState = boardState.map(x => x);
		clonedBoard.boardState.splice(move,1,turn);
		return clonedBoard;
	};

	this.printBoard = function() {
		for (let i = 0; i < 9; i++) {
			cells[i].textContent = this.boardState[i];
		};
	};

	//UI adjustments for end game
	this.truthy = function(winner, i) {
		const gameArea = document.getElementById('overlay');
		const messageSpace = document.getElementById('titleSpace');
		const message = document.createElement('h1');
		message.setAttribute('id','winMessage');
		messageSpace.appendChild(message);

		if(winner != 'tie') {
			const fullLineWidth = gameArea.clientWidth;
			const fullLineHeight = gameArea.clientHeight;
			const line = document.getElementById('line');
			const bar = document.getElementById('bar');
			let xStart;
			let xEnd;
			let yStart;
			let yEnd;
	
			switch(i) {
    	       	case 0:
        	    	xStart = fullLineWidth * .046;
       	    	    xEnd = fullLineWidth * .974;
          	    	yStart = fullLineHeight * .142;
            		yEnd = fullLineHeight * .171;
	   	    	break;

				case 1:
    	            xStart = fullLineWidth * .046;
	    	        xEnd = fullLineWidth * .974;
   		    	    yStart = fullLineHeight * .462;
       		    	yEnd = fullLineHeight * .521;
	       		break;

				case 2:
					xStart = fullLineWidth * .046;
					xEnd = fullLineWidth * .974;
					yStart = fullLineHeight * .842;
					yEnd = fullLineHeight * .861;
				break;

				case 3:
					xStart = fullLineHeight * .155;
					xEnd = fullLineHeight * .171;
					yStart = fullLineWidth * .046;
					yEnd = fullLineWidth * .974;
				break;

				case 4:
					xStart = fullLineHeight * .488;
					xEnd = fullLineHeight * .521;
					yStart = fullLineWidth * .046;
					yEnd = fullLineWidth * .974;
				break;

				case 5:
					xStart = fullLineHeight * .842;
					xEnd = fullLineHeight * .861;
					yStart = fullLineWidth * .046;
					yEnd = fullLineWidth * .974;                    
				break;

				case 6:
					xStart = fullLineHeight * .095;
					xEnd = fullLineHeight * .961;
					yStart = fullLineWidth * .046;
					yEnd = fullLineWidth * .974;
				break;

				case 7:
					xStart = fullLineHeight * .955;
					xEnd = fullLineHeight * .071;
					yStart = fullLineWidth * .046;
					yEnd = fullLineWidth * .974;
				break;

				default:
					console.log('Error graphing line');
				break;
			};

			line.setAttribute('x1', xStart);
    	    line.setAttribute('x2', xEnd);
	 	    line.setAttribute('y1', yStart);
   			line.setAttribute('y2', yEnd);

			message.textContent = theBoard.turn + ' Wins!!!';

	        bar.classList.remove('hidden');
    	    overlay.classList.remove('hidden');
		} else {
			message.textContent = 'TIE GAME!!!';
		};
		buttons.forEach(button => button.addEventListener('click', clickButton));
	};

	this.checkWinCondition = function() {

    	const winConditions = [
	        [0, 1, 2],
    	    [3, 4, 5],
	        [6, 7, 8],
	        [0, 3, 6],
	        [1, 4, 7],
	        [2, 5, 8],
	        [0, 4, 8],
    	    [2, 4, 6]    
    	];

	    for (let i = 0; i < 8; i++) {
    	    const winCon = winConditions[i];
        	let a = this.boardState[winCon[0]];
        	let b = this.boardState[winCon[1]];
        	let c = this.boardState[winCon[2]];

	        if (a === b && b === c && a !=="" && b !=="" && c !=="") {
    	        this.win = true;

				if (this.root === true) {
					this.truthy(theBoard.turn, i);
				};

        	};
		};

		if (this.boardState.includes('') !== true) {
			this.tie = true;

			if(this.root === true) {
				this.truthy('tie', 0);
			};
		};
    };	
};

function AI() {

	this.difficulty = 'medium';

	this.makeMove = function() {
		let difficultyThreshold;
		let move;
	
		switch (this.difficulty) {
			case 'easy':
				difficultyThreshold = .25;
			break;

			case 'medium':
				difficultyThreshold = .50;
			break;

			case 'hard':
				difficultyThreshold = 1;
			break;

			default:
				console.log('No difficulty Available!');
			break;
		}

		if(Math.random() > difficultyThreshold) {
			let available = [];
			
			for (let i = 0; i < 9; i++) {
				if(theBoard.boardState[i] === '') {
				available.push(i);
				};
			};

			move = available[Math.floor(Math.random()*available.length)];
		} else {
			move = ai.minimax(theBoard);
		}

		cells[move].removeEventListener('click', pickCell);
		theBoard.boardState[move] = theBoard.turn;
		theBoard.turnCount = theBoard.turnCount + 1;
		theBoard.printBoard();
		theBoard.checkWinCondition();
		theBoard.turn = theBoard.turn === 'X' ? 'O' : 'X';
	};

	this.minimax = function(oldBoard) {
		let availableMoves = [];
		let moveScores = [];

		for (let i = 0; i < 9; i++) {
			if(oldBoard.boardState[i] === '') {
				availableMoves.push(i);
				moveScores.push(0);
			};
		};

		for (let move in availableMoves) {
			let currentScore;

			//Maximin if 'X' turn
			if(oldBoard.turnCount < 9 && oldBoard.turn === 'X') {
				const newBoard = oldBoard.clone(oldBoard.boardState, oldBoard.turn, availableMoves[move]);
				newBoard.checkWinCondition();
				if(newBoard.win === true) {
					currentScore = 20 - newBoard.turnCount;
				} else if(newBoard.tie === true) {
					currentScore = 0;
				} else {
					currentScore = ai.minimax(newBoard);
				};
			};

			//Minimax if 'O' turn
			if(oldBoard.turnCount < 9 && oldBoard.turn === 'O') {
				const newBoard = oldBoard.clone(oldBoard.boardState, oldBoard.turn, availableMoves[move]);
				newBoard.checkWinCondition();
				if(newBoard.win === true) {
					currentScore = -20 + newBoard.turnCount;
				} else if(newBoard.tie === true) {
					currentScore = 0;
				} else {
					currentScore = ai.minimax(newBoard);
				};
			};

			//Fill array with best score
			moveScores[move] = currentScore;
		};

		//Return best score of the array, if it's the original board return best move of available moves
		if (oldBoard.root === false) {
			if (oldBoard.turn === 'X') {
				return Math.max(...moveScores);
			} else {
				return Math.min(...moveScores);
			};
		} else {
			if (oldBoard.turn === 'X') {
				let bestMove = moveScores.indexOf(Math.max(...moveScores));
				return availableMoves[bestMove];
			} else {
				let bestMove = moveScores.indexOf(Math.min(...moveScores));
				return availableMoves[bestMove];
			};			
		};
	};
};

function pickCell(){
	let cell = this.id;

	theBoard.boardState[cell] = theBoard.turn;
	theBoard.turnCount = theBoard.turnCount + 1;
	theBoard.printBoard();
	this.removeEventListener('click', pickCell);

	theBoard.checkWinCondition();

	theBoard.turn = theBoard.turn === 'X' ? 'O' : 'X';

	if(theBoard.players == 1 && theBoard.win !== true && theBoard.turnCount < 9) {
		setTimeout(() => ai.makeMove(), 150);
	};
};

cells.forEach(cell => cell.addEventListener('click', pickCell));
buttons.forEach(button => button.addEventListener('click', clickButton));