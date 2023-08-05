const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express();
const cors = require('cors')
const YAML = require('yamljs')
const swaggerUI = require('swagger-ui-express')
const swaggerDoc = YAML.load('swagger.yml')
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt')
const cookieParser = require("cookie-parser")
const JWT = require('./JWT')

const bodyParser = require('body-parser');


const sqlFunctions = require('./sqlFunctions.js')

const db = new sqlite3.Database('database.db'); 

const PORT = 5000;

const options = {
	key: fs.readFileSync('privatekey.pem'),
	cert: fs.readFileSync('certificate.pem')
}

app.use(cors({
  origin: '*',
	allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/test', (req, res) => {
	res.json("Node server works!");
	console.log("reached test endpoint")
});

app.get('/', (req, res) => {
	res.json({ok: true});
	console.log("reached root endpoint")
});

//REGISTRATION AND LOGIN
app.post("/register", (req, res) => {
	const {username, password} = req.body;

	bcrypt.hash(password, 10)
		.then((hash) => {
	  	return sqlFunctions.insertNewUser(db, username, hash)
		})
		.then(() => {
			res.status(200).send("Successfully registered new user");
		})
		.catch(() => {
			console.log("Incorrect username or password");
			res.status(400).send();
		})
})

app.post("/login", (req, res) => {
	const {username, password} = req.body;

	sqlFunctions.userExists(db, username)
		.then(() => {
			return sqlFunctions.getHashedPassword(db, username);
		})
		.then((hashedPassword) => {
			return bcrypt.compare(password, hashedPassword)
		})
		.then((match) => {
			if (match) {
				const accessToken = JWT.createToken({username: username});
				console.log(accessToken);
				res.status(200).json({accessToken: accessToken})
			}	
			else {
				res.status(400).json("Invalid Password");
			}
		})
		.catch((err) => {
			res.status(400).json(err);
		})
})

app.post("/profile", (req, res) => {
	console.log("Reached profile endpoint");
	res.json({ message: "profile" });
})

app.listen(PORT, '0.0.0.0', () => console.log(`HTTP Server is now running on port ${PORT}`))

// const server = https.createServer(options, app);

/*
server.listen(PORT, '0.0.0.0', () => {
	console.log(`HTTP Server running on port ${PORT}`);
});
*/

/*

app.use(cors())


app.get('/test', (req, res) => {
	res.json({message: "Node server works!"});
	console.log("reached test endpoint")
});

app.get('/', (req, res) => {
	res.json({ok: true});
	console.log("reached root endpoint")
});


app.listen(PORT, '0.0.0.0', () => console.log(`Server is now running on port ${PORT}`));

*/