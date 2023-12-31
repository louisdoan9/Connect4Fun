import supabase from './supabaseClient';
import Register from './Authentication/Register';
import Login from './Authentication/Login';
import CreateMatch from './Matches/CreateMatch';
import MatchesList from './Matches/MatchesList';
import UserMatches from './UserMatches/UserMatches';
import { useState, useEffect } from 'react';

function App() {
	const [userInfo, setUserInfo] = useState(null);
	const [matches, setMatches] = useState([]);

	async function fetchAllMatches() {
		const { data } = await supabase.from('matches').select();
		setMatches(data);
	}

	// fetch matches listing on load
	useEffect(() => {
		fetchAllMatches();
	}, []);

	if (!userInfo) {
		return (
			<div className="App">
				<Register setUserInfo={setUserInfo} />
				<Login setUserInfo={setUserInfo} />
			</div>
		);
	} else {
		return (
			<div>
				<button onClick={fetchAllMatches}>Reload Matches</button>
				<CreateMatch userinfo={userInfo} fetchAllMatches={fetchAllMatches} />
				<MatchesList userinfo={userInfo} matches={matches} fetchAllMatches={fetchAllMatches} />
				<UserMatches userinfo={userInfo} matches={matches} fetchAllMatches={fetchAllMatches} />
			</div>
		);
	}
}

export default App;
