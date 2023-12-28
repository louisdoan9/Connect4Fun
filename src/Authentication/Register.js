import supabase from '../supabaseClient';

function Register() {
	async function handleSubmit(event) {
		event.preventDefault();
		const username = event.target.elements.username.value;
		const password = event.target.elements.password.value;

		const { data, error } = await supabase
			.from('users')
			.insert([{ username: username, password: password, matches: JSON.stringify([]) }]);
		event.target.elements.username.value = '';
		event.target.elements.password.value = '';
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="username">Username</label>
			<input id="username" name="username" />
			<label htmlFor="password">Username</label>
			<input id="password" name="password" />
			<button type="submit">Submit</button>
		</form>
	);
}

export default Register;
