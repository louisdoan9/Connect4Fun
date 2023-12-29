import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function MatchesList({ userinfo }) {
	const [matches, setMatches] = useState([]);

	useEffect(() => {
		if (matches.length === 0) {
			fetchAllMatches();
		}
	}, [matches]);

	async function fetchAllMatches() {
		const { data } = await supabase.from('matches').select();
		setMatches(data);
	}

	async function getUsersData() {
		const { data } = await supabase.from('users').select().eq('id', userinfo.id);
		return data[0];
	}

	async function joinMatch(id) {
		// get data of match to join and player data
		const { data } = await supabase.from('matches').select().eq('id', id);
		const matchData = data[0];
		const userData = await getUsersData();

		// if "player1" spot is empty, user joins as player1
		if (matchData.player1 === null) {
			await supabase.from('matches').update({ player1: userinfo.username }).eq('id', id);
		}
		// if "player2" spot is empty, user joins as player12
		else if (matchData.player2 === null) {
			await supabase.from('matches').update({ player2: userinfo.username }).eq('id', id);
		}
		if (matchData.player1 === null || matchData.player2 === null) {
			// if user is added to the match, add match to user's array of matches
			await supabase
				.from('users')
				.update({ matches: JSON.stringify([...JSON.parse(userData.matches), id]) })
				.eq('id', userinfo.id);
		}
	}

	return (
		<div>
			{matches.map((match) => {
				return (
					<div>
						<h3>{match.match_name}</h3>
						<button
							onClick={() => {
								joinMatch(match.id);
							}}
						>
							Join match
						</button>
					</div>
				);
			})}
		</div>
	);
}

export default MatchesList;
