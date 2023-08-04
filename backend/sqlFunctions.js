const sqlite3 = require('sqlite3').verbose();

function printErrorAndReject(error, reject) {
	console.log(error);
	reject();
}

function printMessageAndResolve(message, resolve) {
	console.log(message);
	resolve();
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
			printErrorAndReject(`SQL: ${error}`, reject)
		}
	})
}

function userExists(db, username) {
	return new Promise((resolve, reject) => {
		try {
			db.get('SELECT * FROM Users WHERE username = ?', [`${username}`], (err, row) => {
				console.log(row);
				if (err)
					printErrorAndReject(`SQL: Could not find user ${username} in database. ${err.message}`, reject)
				else if (row == null)
					printErrorAndReject(`SQL: Could not find user ${username} in database`, reject)
				else
					printMessageAndResolve(`SQL: Found use ${username} in database`, resolve)
			})
		}
		catch(error) {
			printErrorAndReject(`SQL: ${error}`, reject)
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
			printErrorAndReject(`SQL: ${error}`, reject)
		}
	})
} 

module.exports = {insertNewUser, userExists, getHashedPassword}