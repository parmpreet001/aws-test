function printErrorAndReject(error, reject, rejectMessage) {
	console.log(error);
	if (rejectMessage === null)
		reject();
	else
		reject(rejectMessage)
}

function printMessageAndResolve(message, resolve, resolveObject) {
	console.log(message);
	if (resolveObject === null)
		resolve();
	else
		resolve(resolveObject)
}

function insertNewUser(db, username, password) {
	return new Promise((resolve, reject) => {
		try {
			db.run('INSERT INTO Users (username, password) VALUES (?,?)', [username, password], (err) => {
				if (err)
					printErrorAndReject(`SQL: Could not insert new user into database. ${err.message}`, reject);
				else
					printMessageAndResolve(`SQL: Inserted ${username} into users table`, resolve);
			});
		}
		catch(error) {
			printErrorAndReject(`SQL: ${error}`, reject, error)
		}
	})
}

function userExists(db, username) {
	return new Promise((resolve, reject) => {
		try {
			db.get('SELECT * FROM Users WHERE username = ?', [`${username}`], (err, row) => {
				console.log(row);
				if (err)
					printErrorAndReject(`SQL: Could not find user ${username} in database. ${err.message}`, reject, "Invalid Username")
				else if (row == null)
					printErrorAndReject(`SQL: Could not find user ${username} in database`, reject, "Invalid Username")
				else
					printMessageAndResolve(`SQL: Found use ${username} in database`, resolve)
			})
		}
		catch(error) {
			printErrorAndReject(`SQL: ${error}`, reject, error)
		}
	})
}

function getHashedPassword(db, username) {
	return new Promise((resolve, reject) => {
		try {
			db.get('SELECT * FROM Users WHERE username = ?', [`${username}`], (err, row) => {
				console.log(row);
				if (err)
					printErrorAndReject(`SQL: Could not find user ${username} in database. ${err.message}`);
				else
					resolve(row.password)
			})
		}
		catch(error) {
			printErrorAndReject(`SQL: ${error}`, reject, error)
		}
	})
}

function addChannel(db, username, channelName) {
	return new Promise((resolve, reject) => {
		try {
			db.run('INSERT INTO Channels (owner, name) VALUES (?,?)', [username, channelName], (err) => {
				if (err)
					printErrorAndReject(`SQL: Could not create channel ${channelName}. ${err.message}`, reject)
				else
					printMessageAndResolve(`SQL: Added channel ${channelName} to channels created by ${username}`, resolve);
			})			
		}
		catch(error) {
			printErrorAndReject(`SQL: ${error}`, reject, error)
		}
	})
}

function getAllChannels(db) {
	return new Promise((resolve, reject) => {
		try {
			db.all('SELECT * FROM Channels', (err, rows) => {
				if (err)
					printErrorAndReject('SQL: Could not retrieve channels', reject)
				else
					printMessageAndResolve('SQL: Retrieved channels', resolve, rows)
			})			
		}
		catch(error) {
			printErrorAndReject(`SQL: ${error}`, reject, error)
		}
	})
}

module.exports = {insertNewUser, userExists, getHashedPassword, addChannel, getAllChannels}