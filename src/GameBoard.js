import { useState } from 'react';

function GameBoard() {
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
		if (newBoard[i][column] != null) {
			console.log('y');
		}
		while (newBoard[i][column] != null) {
			i--;
			if (i === -1) {
				return null;
			}
		}
		newBoard[i][column] = 'x';
		setBoard(newBoard);
	}

	return (
		<div className="board">
			{board.map((row) => {
				return (
					<div className="row">
						{row.map((space, index) => {
							return (
								<div
									className={space === 'x' ? 'column x' : space === 'y' ? 'column y' : 'column'}
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
	);
}

export default GameBoard;
