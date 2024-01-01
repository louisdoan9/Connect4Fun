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
		<div>
			<p>Register</p>
			<form onSubmit={registerUser}>
				<div>
					<label htmlFor="username">Username</label>
					<input id="username" name="username" />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input id="password" name="password" />
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default Register;
