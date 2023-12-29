import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function UserMatches({ userinfo, matches }) {
	const [userMatches, setUserMatches] = useState([]);

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
						<button>Play</button>
					</div>
				);
			})}
		</div>
	);
}

export default UserMatches;
