import { useEffect, useState } from 'react';
import GameBoard from '../GameBoard';
import supabase from '../supabaseClient';

function UserMatches({ userinfo, matches, fetchAllMatches }) {
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
	}, [matches, userinfo.username]);

	const channel = supabase
		.channel('table_db_changes')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'matches',
			},
			(payload) => {
				console.log('fetch2');
				fetchAllMatches();
				if (currentMatch !== null) {
					if (payload.new.id === currentMatch.id) {
						const x = JSON.stringify(payload.new.board);
						payload.new.board = x;
						setCurrentMatch(payload.new);
					}
				}
			}
		)
		.subscribe();

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
			{currentMatch !== null ? <GameBoard userinfo={userinfo} match={currentMatch} /> : ''}
		</div>
	);
}

export default UserMatches;
