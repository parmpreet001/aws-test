const Channel = require('./channel')

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	ownerID: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	users: [{type: ObjectId, ref: 'User'}],
	channels: [Channel.schema]
})

workspaceSchema.index({owner: 1});

const Workspace = mongoose.model('Workspace', workspaceSchema)

module.exports = Workspace;