import supabase from '../supabaseClient';

function CreateMatch({ userinfo }) {
	async function createMatch(match_name) {
		const { data, error } = await supabase
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
		return data[0].id;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		const match_name = event.target.elements.chatname.value;

		const matchId = await createMatch(match_name);

		const { data, error2 } = await supabase.from('users').select().eq('id', userinfo.id);
		console.log(data);

		const { error3 } = await supabase
			.from('users')
			.update({ matches: JSON.stringify([...JSON.parse(data[0].matches), matchId]) })
			.eq('id', userinfo.id);

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
