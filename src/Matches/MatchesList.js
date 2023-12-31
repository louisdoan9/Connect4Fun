import supabase from '../supabaseClient';

function MatchesList({ userinfo, matches, fetchAllMatches }) {
	async function joinMatch(id) {
		// get data of match to join and player data
		const { data: data1 } = await supabase.from('matches').select().eq('id', id);
		const { data: data2 } = await supabase.from('users').select().eq('id', userinfo.id);
		const matchData = data1[0];
		const updatedUserMatches = JSON.parse(data2[0].matches);

		let f = false;
		// if "player1" spot is empty, user joins as player1
		if (matchData.player1 === null && matchData.player2 !== userinfo.username) {
			await supabase.from('matches').update({ player1: userinfo.username }).eq('id', id);
			f = true;
		}
		// if "player2" spot is empty, user joins as player2
		else if (matchData.player2 === null && matchData.player1 !== userinfo.username) {
			await supabase.from('matches').update({ player2: userinfo.username }).eq('id', id);
			f = true;
		}

		// if user is added to the match, add match to user's array of matches, fetch updated matches
		if (f) {
			await supabase
				.from('users')
				.update({ matches: JSON.stringify([...updatedUserMatches, id]) })
				.eq('id', userinfo.id);
			await fetchAllMatches();
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
