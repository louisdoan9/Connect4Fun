import supabase from '../supabaseClient';
import GameBoard from '../UserMatches/GameBoard';

function MatchesList({ userinfo, matches, fetchAllMatches, currentMatch, setCurrentMatch }) {
	async function joinMatch(id) {
		// get data of match to join and player data
		const { data: data1 } = await supabase.from('matches').select().eq('id', id);
		const { data: data2 } = await supabase.from('users').select().eq('id', userinfo.id);
		if (data1.length === 0) {
			fetchAllMatches();
			return; // match was deleted
		}
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
		<div className="matches-list">
			{currentMatch === null ? (
				<div>
					{matches.map((match) => {
						return (
							<div className="match">
								<h2>{match.match_name}</h2>
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
			) : (
				<div>
					<button
						onClick={() => {
							setCurrentMatch(null);
						}}
					>
						Back
					</button>
					<GameBoard userinfo={userinfo} match={currentMatch} />
				</div>
			)}
		</div>
	);
}

export default MatchesList;
