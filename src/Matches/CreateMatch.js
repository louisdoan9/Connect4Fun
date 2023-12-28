import supabase from '../supabaseClient';

function CreateMatch({ username }) {
	async function handleSubmit(event) {
		event.preventDefault();
		const match_name = event.target.elements.chatname.value;

		const { data, error } = await supabase.from('matches').insert([
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
				currentPlayer: username,
				player1: username,
				player2: null,
			},
		]);
		event.target.elements.chatname.value = '';
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="chatname">Name of chat</label>
			<input id="chatname" name="chatname" />
			<button type="submit">Submit</button>
		</form>
	);
}

export default CreateMatch;
