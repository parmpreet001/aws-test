import React, { useState, useEffect } from 'react';
import axios from 'axios';


function LoginRegistrationForm({accessToken, setAccessToken, setAppUsername}) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const proxy = 'http://localhost:5000'

	const onUsernameChange = (event) => {
		setUsername(event.target.value);
	}

	const onPasswordChange = (event) => {
		setPassword(event.target.value);
	}

	const TestSubComponent = () => (
		(accessToken === null ? <p>Not Logged in</p> : <p>Logged In!</p>)
	)
 
	const onLogin = (event) => {
		event.preventDefault();
		
		const onLoginAxios = () => {
			axios.post(proxy + '/login', {username: username, password: password})
			.then((response) => {
				if (response.data.accessToken) {
					setAccessToken(response.data.accessToken)
					setAppUsername(username)
				}
			}).catch((err) => {
				console.log(err);
			});
		}

		onLoginAxios();
	}

	const onRegister = (event) => {
		event.preventDefault();

		const onRegisterAxios = () => {
			axios.post(proxy + '/register', {username: username, password: password})
			.then((response) => {
				console.log(response);
			})
		}

		onRegisterAxios();
	}

	return (
		
		<div>
			<div>
				<label htmlFor='username'>Username:</label>
				<input
					type='text'
					id='username'
					value={username}
					onChange={onUsernameChange}>
				</input>
			</div>
			<div>
				<label htmlFor='password'>Password: </label>
				<input
					type="password"
					id="password"
					value={password}
					onChange={onPasswordChange}>
				</input>
			</div>
			<button type='button' onClick={onLogin}>Login</button>
			<button type='button' onClick={onRegister}>Register</button>
		</div>
	)
}

export default LoginRegistrationForm;