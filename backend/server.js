//SERVER AND FILE SYSTEM
const express = require('express')
const https = require('https')
const app = express();
const cors = require('cors')
const fs = require('fs')

//YAML AND SWAGGER
const YAML = require('yamljs')
const swaggerUI = require('swagger-ui-express')
const swaggerDoc = YAML.load('swagger.yml')
const bodyParser = require('body-parser');

//PASSWORD AND ENCYPTION
const bcrypt = require('bcrypt')
const JWT = require('./JWT')
require('dotenv').config();

//MONGO AND MONGOOSE
const mongoose = require('mongoose')
const User = require('./models/user')
const Workspace = require('./models/workspace')

const uri = "mongodb+srv://master_user:master_user@slack-clone.xt61ykb.mongodb.net/slack-clone-db?retryWrites=true&w=majority";
const PORT = 5000;
const options = {
	key: fs.readFileSync('privatekey.pem'),
	cert: fs.readFileSync('certificate.pem')
}

//MONGOOSE SETUP
mongoose.connect(uri)
	.then(() => {
		console.log("Connected to mongo db")
	})
	.catch((err) => {
		console.log(err);
	})

//CORS SETUP
app.use(cors({
  origin: '*',
	allowedHeaders: ['Content-Type']
}));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


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
			const user = new User({username: username, password: hash});
			return user.save()
		})
		.then(() => {
			res.status(200).json("Succesfully added new user")
		})
		.catch((err) => {
			if (err.code == 11000)
				res.status(400).json({message: "Username already exists"})
			else
				status400Default();
		})
})

app.post("/login", (req, res) => {
	const {username, password} = req.body;

	User.find({username: username})
		.then((result) => {
			// If user does not exist, throw error
			if (result === undefined || result.length === 0)
				throw("Invalid Username")
			
			// Otherwise, return hashed password
			const user = result[0];
			return user.password;
		})
		.then((hashedPassword) => {
			return bcrypt.compare(password, hashedPassword);
		})
		.then((match) => {
			//If given password matches hashed password, return accessToken
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

// WORKSPACES
app.post("/addWorkspace", JWT.validateToken, (req, res) => {
	const { username, workspaceName } = req.body;

	Workspace.exists({name: workspaceName, owner: username})
		.then((result) => {
			if (result) {
				reject("Workspace exists");
			}
			else {
				const workspace = new Workspace({name: workspaceName, owner: username})
				return workspace.save();
			}
	 })
	 .then(() => {
			res.status(200).json("Added Workspace");
	 })
	 .catch((err) => {
			res.status(400).json(err);
	})
})

app.post('/addUserToWorkspace', JWT.validateToken, (req, res) => {
	const {username, workspaceName, workspaceOwner} = req.body;
	let m_user;
	let m_workspace;

	User.findOne({username: username})
	.then((user) => {
		m_user = user;
	})
	.then(() => {
		return Workspace.findOne({name: workspaceName, owner: workspaceOwner})
	})
	.then((workspace) => {
		m_workspace = workspace;
	})
	.then(() => {
		m_workspace.users.push(m_user._id);
		m_workspace.save((err) => {
			if (err)
				throw err;
		})
		res.status(200).json(`Added ${username} to ${workspaceName}`);
	})
	.catch((err) => {
		console.log(err);
		res.status(400).json("Username of workspace name invalid");
	})
})

app.post("/getWorkspaces", JWT.validateToken, (req, res) => {
	Workspace.find()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(400).json(err);
		})
})

//SERVER START
if (process.env.SERVER_TYPE === 'development')
	app.listen(PORT, '0.0.0.0', () => console.log(`HTTP Server is now running on port ${PORT}`))
else {
	const server = https.createServer(options, app);

	server.listen(PORT, '0.0.0.0', () => {
		console.log(`HTTPS Server running on port ${PORT}`);
	});
}

function status400Default() {
	return res.status(400).json({message: "Unexpected error"});
}