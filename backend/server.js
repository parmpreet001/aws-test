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
}));

app.use(bodyParser.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

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
			console.log("returning with code 200");
			res.status(200).send();
		})
		.catch(() => {
			console.log("returning with code 500");
			res.status(500).send();
		})
})

app.post("/login", (req, res) => {
	res.json("login");
})




const server = https.createServer(options, app);

server.listen(PORT, '0.0.0.0', () => {
	console.log(`HTTP Server running on port ${PORT}`);
});

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