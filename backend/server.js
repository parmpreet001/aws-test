const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express();
const cors = require('cors')
const YAML = require('yamljs')
const swaggerUI = require('swagger-ui-express')
const swaggerDoc = YAML.load('swagger.yml')

const bcrypt = require('bcrypt')
const cookieParser = require("cookie-parser")
const JWT = require('./JWT')
require('dotenv').config();

const mongoose = require('mongoose')
const User = require('./models/user')
const Channel = require('./models/channel')

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://master_user:master_user@slack-clone.xt61ykb.mongodb.net/slack-clone-db?retryWrites=true&w=majority";

mongoose.connect(uri)
	.then((result) => {
		console.log("Connected to db")
	})
	.catch((err) => {
		console.log(err);
	})

const bodyParser = require('body-parser');

const { reject } = require('bcrypt/promises');



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
			const user = new User({username: username, password: hash});
			return user.save()
		})
		.then(() => {
			res.status(200).json("Succesfully added new user")
		})
		.catch((err) => {
			res.status(400).json(err);
		})
})

app.post("/login", (req, res) => {
	const {username, password} = req.body;

	User.find({username: username})
		.then((result) => {
			if (result === undefined || result.length === 0)
				throw("Invalid Username")

			const user = result[0];
			return user.password;
		})
		.then((hashedPassword) => {
			return bcrypt.compare(password, hashedPassword);
		})
		.then((match) => {
			if (match) {
				const accessToken = JWT.createToken({username: username})
				res.status(200).json({accessToken: accessToken})
			}
			else
				res.status(400).json("Invalid Password")
		})
		.catch((err) => {
			res.status(400).json(err)
		})
})

app.post("/profile", JWT.validateToken, (req, res) => {
	console.log("Reached profile endpoint");
	if (req.authenticated)
		res.status(200).json("Token Validated!")
	else
		res.status(400).json("Error")
})

app.post("/addChannel", JWT.validateToken, (req, res) => {
	const { username, channelName } = req.body;

	const channel = new Channel({channelName: channelName, owner: username})

	channel.save()
		.then(() => {
			res.status(200).json("Added Channel");
		})
		.catch((err) => {
			res.status(400).json(err);
		})
})

app.post("/getChannels", JWT.validateToken, (req, res) => {
	Channel.find()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(400).json(err);
		})
})


if (process.env.SERVER_TYPE === 'development')
	app.listen(PORT, '0.0.0.0', () => console.log(`HTTP Server is now running on port ${PORT}`))
else {
	const server = https.createServer(options, app);

	server.listen(PORT, '0.0.0.0', () => {
		console.log(`HTTPS Server running on port ${PORT}`);
	});
}


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