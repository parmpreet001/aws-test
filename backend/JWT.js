const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
	const accessToken = sign({username: user.username}, "blah")
	return accessToken;
}

const validateToken = (req, res, next) => {
	const {accessToken} = req.body;

	if (!accessToken)
		return res.status(400).send("User not Authenticated")
	
		try {
			const validToken = verify(accessToken, "blah")
			if (validToken) {
				req.authenticated = true;
				return next()
			}
		}
		catch (err) {
			return res.status(400).send(`Invalid Token. ${err}`)
		}
}

module.exports = { createToken, validateToken }