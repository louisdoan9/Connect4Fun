import supabase from '../supabaseClient';
import './authentication.css';

function Login({ setUserInfo }) {
	async function loginUser(event) {
		event.preventDefault();
		const username = event.target.elements.username.value;
		const password = event.target.elements.password.value;

		// get user data corresponding to inputted username, password
		const { data } = await supabase.from('users').select().eq('username', username).eq('password', password);
		if (data.length !== 0) {
			setUserInfo(data[0]);
		}

		event.target.elements.username.value = '';
		event.target.elements.password.value = '';
	}

	return (
		<div>
			<p>Login</p>
			<form onSubmit={loginUser}>
				<div>
					<label htmlFor="username">Username</label>
					<input id="username" name="username" />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input id="password" name="password" type="password" />
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default Login;
