const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express();
const cors = require('cors')
const swaggerUI = require('swagger-ui-express')
const swaggerDoc = YAML.load('swagger.yml')

const PORT = 5000;

const options = {
	key: fs.readFileSync('privatekey.pem'),
	cert: fs.readFileSync('certificate.pem')
}

app.use(cors())

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.get('/test', (req, res) => {
	res.json({message: "Node server works!"});
	console.log("reached test endpoint")
});

app.get('/', (req, res) => {
	res.json({ok: true});
	console.log("reached root endpoint")
});


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