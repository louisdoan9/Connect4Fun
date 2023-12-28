import GameBoard from './GameBoard';
import Register from './Authentication/Register';
import Login from './Authentication/Login';
import { useState } from 'react';

function App() {
	const [userInfo, setUserInfo] = useState(null);

	if (!userInfo) {
		return (
			<div className="App">
				<Register setUserInfo={setUserInfo} />
				<Login setUserInfo={setUserInfo} />
			</div>
		);
	} else {
		return <GameBoard />;
	}
}

/*

- initial screen: register/login, stored in DB
- main screen: create matches, join matches
- matches: stores 2 users, gameboard

*/

export default App;
