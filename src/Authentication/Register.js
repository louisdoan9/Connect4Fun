import supabase from '../supabaseClient';

function Register() {
	async function registerUser(event) {
		event.preventDefault();
		const username = event.target.elements.username.value;
		const password = event.target.elements.password.value;

		// insert inputted username, password into DB
		await supabase
			.from('users')
			.insert([{ username: username, password: password, matches: JSON.stringify([]) }]);

		event.target.elements.username.value = '';
		event.target.elements.password.value = '';
	}

	return (
		<form onSubmit={registerUser}>
			<label htmlFor="username">Username</label>
			<input id="username" name="username" />
			<label htmlFor="password">Username</label>
			<input id="password" name="password" />
			<button type="submit">Submit</button>
		</form>
	);
}

export default Register;
