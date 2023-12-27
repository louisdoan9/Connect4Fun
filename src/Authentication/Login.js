import supabase from '../supabaseClient';

function Login() {
	async function handleSubmit(event) {
		event.preventDefault();
		const username = event.target.elements.username.value;
		const password = event.target.elements.password.value;

		const { data, error } = await supabase
			.from('users')
			.select()
			.eq('username', username)
			.eq('password', password);
		console.log(data);
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

export default Login;
