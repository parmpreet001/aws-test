const express = require('express')

const PORT = 5000;

const app = express();

app.get('/test', (req, res) => {
	res.json({ok: true});
	console.log("reached test endpoint")
});

app.get('/', (req, res) => {
	res.json({ok: true});
	console.log("reached root endpoint")
});


app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));