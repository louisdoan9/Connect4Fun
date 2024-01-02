import supabase from '../supabaseClient';

function UserMatches({ userinfo, currentMatch, fetchAllMatches, setCurrentMatch, userMatches }) {
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
				await supabase
					.from('matches')
					.update({ player1: null, winner: matchData.winner === null ? matchData.player2 : matchData.winner })
					.eq('id', id);
			}
		}
		// if user is player2, set player2 to null
		else if (matchData.player2 === userinfo.username) {
			if (matchData.player1 === null) {
				await supabase.from('matches').delete().eq('id', id);
			} else {
				await supabase
					.from('matches')
					.update({ player2: null, winner: matchData.winner === null ? matchData.player1 : matchData.winner })
					.eq('id', id);
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
		<div className="user-matches">
			<h2>User matches</h2>
			{userMatches.map((match) => {
				return (
					<div className="match">
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
		</div>
	);
}

export default UserMatches;
