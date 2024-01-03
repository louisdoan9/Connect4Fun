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
	}, [userInfo]);

	const [userMatches, setUserMatches] = useState([]);
	const [currentMatch, setCurrentMatch] = useState(null);

	// parses through all matches for matches user is apart of
	useEffect(() => {
		let userMatches = [];
		for (const match of matches) {
			if (match.player1 === userInfo?.username || match.player2 === userInfo?.username) {
				userMatches.push(match);
			}
		}
		setUserMatches(userMatches);
	}, [matches, userInfo?.username]);

	// if DB changed the current matches info, update it
	const channel = supabase
		.channel('table_db_changes')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'matches',
			},
			(payload) => {
				let updatedMatches = [];
				for (const match of userMatches) {
					// if one of user's matches was updated, update it in userMatches
					if (payload.new.id === match.id) {
						payload.new.board = JSON.stringify(payload.new.board);
						updatedMatches.push(payload.new);

						// if it is also the current match, update currentMatch
						if (payload.new.id === currentMatch?.id) {
							setCurrentMatch(payload.new);
						}
					} else {
						updatedMatches.push(match);
					}
				}
				setUserMatches(updatedMatches);
			}
		)
		.subscribe();

	if (!userInfo) {
		return (
			<div className="authentication">
				<Register setUserInfo={setUserInfo} />
				<Login setUserInfo={setUserInfo} />
			</div>
		);
	} else {
		return (
			<div className="main">
				<div className="header">
					<h1>Connect4Fun</h1>
					<h1>Welcome {userInfo.username}</h1>
				</div>
				<div className="matches-container">
					<div className="matches">
						{currentMatch === null ? (
							<CreateMatch userinfo={userInfo} fetchAllMatches={fetchAllMatches} />
						) : (
							''
						)}
						<MatchesList
							userinfo={userInfo}
							matches={matches}
							fetchAllMatches={fetchAllMatches}
							currentMatch={currentMatch}
							setCurrentMatch={setCurrentMatch}
						/>
					</div>
					<UserMatches
						userinfo={userInfo}
						fetchAllMatches={fetchAllMatches}
						currentMatch={currentMatch}
						setCurrentMatch={setCurrentMatch}
						userMatches={userMatches}
					/>
				</div>
			</div>
		);
	}
}

export default App;
