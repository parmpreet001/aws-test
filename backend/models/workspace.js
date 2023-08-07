const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	owner: {
		type: String,
		required: true
	}
})

const Workspace = mongoose.model('Workspace', workspaceSchema)

module.exports = Workspace;