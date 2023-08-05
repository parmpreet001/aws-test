import React, { useState, useEffect } from 'react';
import axios from 'axios';


function LoginForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const proxy = 'http://localhost:5000'

	const onUsernameChange = (event) => {
		setUsername(event.target.value);
	}

	const onPasswordChange = (event) => {
		setPassword(event.target.value);
	}

	const onLogin = (event) => {
		event.preventDefault();
		console.log(username, password);
		
		const onLoginAxios = () => {
			axios.post(proxy + '/login', {username: username, password: password})
			.then((response) => {
				console.log(response.data)
			}).catch((err) => {
				console.log(err);
			});
		}

		onLoginAxios();
	}

	return (
		<div>
			<p>Login</p>
			<form onSubmit={onLogin}>
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
				<button type='submit'>Login</button>
			</form>
		</div>
	)
}

export default LoginForm;