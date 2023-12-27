import GameBoard from './GameBoard';
import supabase from './supabaseClient';
import Register from './Authentication/Register';
import Login from './Authentication/Login';

function App() {
	async function handleSubmit() {
		const { data, error } = await supabase.from('users').insert([{ username: 'user', password: 'pass' }]);
	}

	return (
		<div className="App">
			<Register />
			<Login />
			<GameBoard />
			<button onClick={handleSubmit}>test</button>
		</div>
	);
}

/*

- initial screen: register/login, stored in DB
- main screen: create matches, join matches
- matches: stores 2 users, gameboard

*/

export default App;
