import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function MatchesList({ userinfo }) {
	const [matches, setMatches] = useState([]);

	async function fetchMatches() {
		const { data, error } = await supabase.from('matches').select();
		setMatches(data);
	}

	useEffect(() => {
		if (matches.length === 0) {
			fetchMatches();
		}
	}, [matches]);

	async function getPlayerData() {
		const { data, error2 } = await supabase.from('users').select().eq('id', userinfo.id);
		return data[0];
	}

	async function joinMatch(id) {
		const { data, error1 } = await supabase.from('matches').select().eq('id', id);
		const playerData = await getPlayerData();
		console.log(playerData);
		if (data[0].player1 === null) {
			const { error3 } = await supabase.from('matches').update({ player1: userinfo.username }).eq('id', id);
			const { error4 } = await supabase
				.from('users')
				.update({ matches: JSON.stringify([...JSON.parse(playerData.matches), id]) })
				.eq('id', userinfo.id);
		} else if (data[0].player2 === null) {
			const { error4 } = await supabase.from('matches').update({ player2: userinfo.username }).eq('id', id);
			const { error5 } = await supabase
				.from('users')
				.update({ matches: JSON.stringify([...JSON.parse(playerData.matches), id]) })
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
