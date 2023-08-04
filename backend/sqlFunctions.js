const sqlite3 = require('sqlite3').verbose();

function insertNewUser(db, username, password) {
	return new Promise((resolve, reject) => {
		try {
			db.run('INSERT INTO Users (username, password) VALUES (?,?)', [username, password], (err) => {
				if (err) {
					console.log("SQL: Could not insert new users into database", err.message)
					reject();
				}
				else {
					console.log(`SQL: Inserted ${username} into users table`);
					resolve()					
				}
			});
		}
		catch(error) {
			console.log(`SQL: ${error}`);
			reject();
		}
	})
}

module.exports = {insertNewUser}