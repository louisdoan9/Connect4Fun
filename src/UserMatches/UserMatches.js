import { useEffect, useState } from 'react';
import GameBoard from '../GameBoard';

function UserMatches({ userinfo, matches }) {
	const [userMatches, setUserMatches] = useState([]);
	const [currentMatch, setCurrentMatch] = useState(null);

	useEffect(() => {
		let array = [];
		for (const match of matches) {
			if (match.player1 === userinfo.username || match.player2 === userinfo.username) {
				array.push(match);
			}
		}

		setUserMatches(array);
		console.log(array);
	}, [matches, userinfo.username]);

	return (
		<div>
			{userMatches.map((match) => {
				return (
					<div>
						<h2>{match.match_name}</h2>
						<button
							onClick={() => {
								setCurrentMatch(match);
							}}
						>
							Play
						</button>
					</div>
				);
			})}
			{currentMatch !== null ? <GameBoard match={currentMatch} /> : ''}
		</div>
	);
}

export default UserMatches;
