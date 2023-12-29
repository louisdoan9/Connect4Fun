import supabase from '../supabaseClient';

function Login({ setUserInfo }) {
	async function loginUser(event) {
		event.preventDefault();
		const username = event.target.elements.username.value;
		const password = event.target.elements.password.value;

		const { data } = await supabase.from('users').select().eq('username', username).eq('password', password);
		if (data.length !== 0) {
			setUserInfo(data[0]);
		}

		event.target.elements.username.value = '';
		event.target.elements.password.value = '';
	}

	return (
		<form onSubmit={loginUser}>
			<label htmlFor="username">Username</label>
			<input id="username" name="username" />
			<label htmlFor="password">Username</label>
			<input id="password" name="password" />
			<button type="submit">Submit</button>
		</form>
	);
}

export default Login;
