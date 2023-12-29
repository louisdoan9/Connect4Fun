import { useEffect, useState } from 'react';

function GameBoard({ match }) {
	const [currentPlayer, setCurrentPlayer] = useState(true);
	const [gameStatus, setGameStatus] = useState(true);
	const [board, setBoard] = useState(JSON.parse(match.board));

	useEffect(() => {
		setBoard(JSON.parse(match.board));
	}, [match]);

	function resetBoard() {
		setBoard([
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
		]);
		setCurrentPlayer(true);
		setGameStatus(true);
	}

	function addToColumn(column) {
		if (!gameStatus) {
			return;
		}
		let newBoard = [...board];
		let i = 5;
		while (newBoard[i][column] != null) {
			i--;
			if (i === -1) {
				return null;
			}
		}
		newBoard[i][column] = currentPlayer ? 'x' : 'o';
		setBoard(newBoard);
		if (checkWin()) {
			setGameStatus(false);
		} else {
			setCurrentPlayer(!currentPlayer);
		}
	}

	function checkEqual(a, b, c, d) {
		if (a === b && b === c && c === d && a !== null) {
			return true;
		} else {
			return false;
		}
	}

	function checkWin() {
		// check diagonal
		let col = 0;
		let row = 0;
		while (row <= 5 && col <= 3) {
			if (checkEqual(board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3])) {
				console.log('win');
				return true;
			} else {
				col++;
				if (col === 4) {
					col = 0;
					row++;
				}
			}
		}
		// check horizontal
		col = 0;
		row = 0;
		while (row <= 2 && col <= 6) {
			if (checkEqual(board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col])) {
				console.log('win 2');
				return true;
			} else {
				col++;
				if (col === 7) {
					col = 0;
					row++;
				}
			}
		}
		// check down right
		col = 0;
		row = 0;
		while (row <= 2 && col <= 3) {
			if (
				checkEqual(board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3])
			) {
				console.log('win 3');
				return true;
			} else {
				col++;
				if (col === 4) {
					col = 0;
					row++;
				}
			}
		}
		// check down left
		col = 3;
		row = 0;
		while (row <= 2 && col <= 6) {
			if (
				checkEqual(board[row][col], board[row + 1][col - 1], board[row + 2][col - 2], board[row + 3][col - 3])
			) {
				console.log('win 4');
				return true;
			} else {
				col++;
				if (col === 7) {
					col = 3;
					row++;
				}
			}
		}
	}

	return (
		<div className="game">
			<h1>{match.match_name}</h1>
			<h2>
				{match.player1} vs {match.player2}
			</h2>
			<div className="board">
				{board.map((row) => {
					return (
						<div className="row">
							{row.map((space, index) => {
								return (
									<div
										className={space === 'x' ? 'column x' : space === 'o' ? 'column o' : 'column'}
										onClick={() => {
											addToColumn(index);
										}}
									></div>
								);
							})}
						</div>
					);
				})}
			</div>
			<h1>Player {currentPlayer ? '1' : '2'}'s turn</h1>
			{!gameStatus ? <h2>{currentPlayer ? 'Player 1' : 'Player 2'} Won</h2> : ''}
			<h3 onClick={resetBoard}>Reset</h3>
		</div>
	);
}

export default GameBoard;
