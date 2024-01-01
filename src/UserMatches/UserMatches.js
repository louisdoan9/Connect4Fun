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
				let updatedMatches = [];
				for (const match of userMatches) {
					// if one of user's matches was updated, update it in userMatches
					if (payload.new.id === match.id) {
						payload.new.board = JSON.stringify(payload.new.board);
						updatedMatches.push(payload.new);

						// if it is also the current match, update currentMatch
						if (payload.new.id === currentMatch?.id) {
							setCurrentMatch(payload.new);
						}
					} else {
						updatedMatches.push(match);
					}
				}
				setUserMatches(updatedMatches);
			}
		)
		.subscribe();

	async function leaveMatch(id) {
		// get data of match to join and player data
		const { data: data1 } = await supabase.from('matches').select().eq('id', id);
		const { data: data2 } = await supabase.from('users').select().eq('id', userinfo.id);
		const matchData = data1[0];
		const updatedUserMatches = JSON.parse(data2[0].matches);

		// if user is player1, set player1 to null
		if (matchData.player1 === userinfo.username) {
			if (matchData.player2 === null) {
				await supabase.from('matches').delete().eq('id', id);
			} else {
				await supabase.from('matches').update({ player1: null, winner: matchData.player2 }).eq('id', id);
			}
		}
		// if user is player2, set player2 to null
		else if (matchData.player2 === userinfo.username) {
			if (matchData.player1 === null) {
				await supabase.from('matches').delete().eq('id', id);
			} else {
				await supabase.from('matches').update({ player2: null, winner: matchData.player1 }).eq('id', id);
			}
		}

		// remove match from user's array of matches, fetch updated matches
		await supabase
			.from('users')
			.update({ matches: JSON.stringify(updatedUserMatches) })
			.eq('id', userinfo.id);
		if (currentMatch?.id === id) {
			setCurrentMatch(null);
		}
		await fetchAllMatches();
	}

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
						<button
							onClick={() => {
								leaveMatch(match.id);
							}}
						>
							Leave
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
