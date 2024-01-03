import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function GameBoard({ userinfo, match }) {
	const [currentPlayer, setCurrentPlayer] = useState(match.currentPlayer);
	const [board, setBoard] = useState(JSON.parse(match.board));

	// set board and current player info according to match
	useEffect(() => {
		setBoard(JSON.parse(match.board));
		setCurrentPlayer(match.currentPlayer);
	}, [match]);

	// reset match board, update DB
	async function resetBoard() {
		await supabase
			.from('matches')
			.update({
				currentPlayer: match.player1,
				board: JSON.stringify([
					[null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null],
				]),
				winner: null,
			})
			.eq('id', match.id);
	}

	// add a piece to a column, check win and update DB
	async function addToColumn(column) {
		// return if not user's turn or there is a match winner
		if (
			userinfo.username !== currentPlayer ||
			match.winner !== null ||
			match.player1 === null ||
			match.player2 === null
		) {
			return;
		}

		// place piece in first unoccupied row from the bottom
		let newBoard = [...board];
		let i = 5; // number of rows (0 indexed)
		while (newBoard[i][column] != null) {
			i--;
			if (i === -1) {
				return null; // entire column is occupied
			}
		}
		newBoard[i][column] = userinfo.username === match.player1 ? 'x' : 'o';
		setBoard(newBoard);

		// if there is a win, update the board and winner in DB
		if (checkWin()) {
			await supabase
				.from('matches')
				.update({
					board: JSON.stringify(board),
					winner: userinfo.username,
				})
				.eq('id', match.id);
		} // if there is no win, update the board and current player in DB
		else {
			await supabase
				.from('matches')
				.update({
					currentPlayer: userinfo.username === match.player1 ? match.player2 : match.player1,
					board: JSON.stringify(board),
				})
				.eq('id', match.id);
		}
	}

	// check if 4 spots are equal
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
			<div className="game-header">
				<h1>
					{match.match_name},{' '}
					{match.player1 && match.player2
						? `(${match.player1} vs ${match.player2})`
						: '(Waiting for 2nd player...)'}
				</h1>
			</div>
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
			{match.winner ? <h2>{match.winner} Won</h2> : <h2>{currentPlayer}'s turn</h2>}
			{match.winner ? <button onClick={resetBoard}>Reset</button> : ''}
		</div>
	);
}

export default GameBoard;
