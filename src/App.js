import Register from './Authentication/Register';
import Login from './Authentication/Login';
import CreateMatch from './Matches/CreateMatch';
import MatchesList from './Matches/MatchesList';
import { useState } from 'react';

function App() {
	const [userInfo, setUserInfo] = useState(null);
	const [currentMatch, setCurrentMatch] = useState(null);

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
				<CreateMatch userinfo={userInfo} />
				<MatchesList userinfo={userInfo} />
			</div>
		);
	}
}

/*

- initial screen: register/login, stored in DB
- main screen: create matches, join matches
- matches: stores 2 users, gameboard

- create match
	DB (insert)
	- board = initial
	- currentPlayer = player1
	- player1 = person that created match
	- player2 = null

- join match
	DB (update)
	- board = same
	- currentPlayer = same
	- player1 = same
	- player2 = person that joined

- match
	DB (update)
	- board = updated after each turn
	- currentPlayer = updated after each turn
	- player1 = same
	- player2 = same

	- real-time updates
	- option to leave match, both leave = delete match

- resume match
	DB (fetch)
	- get all required info from DB, pass to GameBoard

*/

export default App;
