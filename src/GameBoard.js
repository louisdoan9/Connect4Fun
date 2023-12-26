import { useState } from 'react';

function GameBoard() {
	const [currentPlayer, setCurrentPlayer] = useState(true);
	const [board, setBoard] = useState([
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null],
	]);

	function addToColumn(column) {
		let newBoard = [...board];
		let i = 5;
		while (newBoard[i][column] != null) {
			i--;
			if (i === -1) {
				return null;
			}
		}
		newBoard[i][column] = currentPlayer ? 'x' : 'o';
		setCurrentPlayer(!currentPlayer);
		setBoard(newBoard);
	}

	return (
		<div className="game">
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
		</div>
	);
}

export default GameBoard;
