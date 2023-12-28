import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function MatchesList({ username }) {
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

	async function joinMatch(id) {
		const { data, error1 } = await supabase.from('matches').select().eq('id', id);
		if (data[0].player1 === null) {
			const { error2 } = await supabase.from('matches').update({ player1: username }).eq('id', id);
		} else if (data[0].player2 === null) {
			const { error3 } = await supabase.from('matches').update({ player2: username }).eq('id', id);
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
