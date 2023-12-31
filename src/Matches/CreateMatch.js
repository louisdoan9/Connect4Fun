import supabase from '../supabaseClient';

function CreateMatch({ userinfo, fetchAllMatches }) {
	async function createMatch(match_name) {
		// insert new match into DB
		const { data } = await supabase
			.from('matches')
			.upsert([
				{
					match_name: match_name,
					board: JSON.stringify([
						[null, null, null, null, null, null, null],
						[null, null, null, null, null, null, null],
						[null, null, null, null, null, null, null],
						[null, null, null, null, null, null, null],
						[null, null, null, null, null, null, null],
						[null, null, null, null, null, null, null],
					]),
					currentPlayer: userinfo.username,
					player1: userinfo.username,
					player2: null,
				},
			])
			.select();
		return data[0].id; // returns id
	}

	// creates match, adds it to user's matches array, fetch updated list of matches
	async function handleSubmit(event) {
		event.preventDefault();
		const match_name = event.target.elements.chatname.value;

		// create match
		const createdMatchId = await createMatch(match_name);

		// add newly created match to user's matches array
		const { data } = await supabase.from('users').select().eq('id', userinfo.id);
		const updatedUserMatches = JSON.parse(data[0].matches);
		await supabase
			.from('users')
			.update({ matches: JSON.stringify([...updatedUserMatches, createdMatchId]) })
			.eq('id', userinfo.id);

		// fetch updated list of matches
		await fetchAllMatches();

		event.target.elements.chatname.value = '';
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="chatname">Name of match</label>
			<input id="chatname" name="chatname" />
			<button type="submit">Submit</button>
		</form>
	);
}

export default CreateMatch;
