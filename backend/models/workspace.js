const { ObjectId } = require('mongodb');
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
	},
	users: [{type: ObjectId, ref: 'User'}]
})

const Workspace = mongoose.model('Workspace', workspaceSchema)

module.exports = Workspace;