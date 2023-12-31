import { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import supabase from '../supabaseClient';

function UserMatches({ userinfo, matches, fetchAllMatches }) {
	const [userMatches, setUserMatches] = useState([]);
	const [currentMatch, setCurrentMatch] = useState(null);

	// parses through all matches for matches user is apart of
	useEffect(() => {
		let userMatches = [];
		for (const match of matches) {
			if (match.player1 === userinfo.username || match.player2 === userinfo.username) {
				userMatches.push(match);
			}
		}
		setUserMatches(userMatches);
	}, [matches, userinfo.username]);

	// if DB changed the current matches info, update it
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
				if (currentMatch !== null) {
					if (payload.new.id === currentMatch.id) {
						payload.new.board = JSON.stringify(payload.new.board);
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
			{/* display current match using GameBoard */}
			{currentMatch !== null ? <GameBoard userinfo={userinfo} match={currentMatch} /> : ''}
		</div>
	);
}

export default UserMatches;
