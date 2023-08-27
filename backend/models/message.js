const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	senderID: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	workspaceID: {
		type:ObjectId,
		ref: 'Workspace',
		required: true
	},
	channelID: {
		type: ObjectId,
		ref: 'Channel',
		required: true
	}
})

messageSchema.index({workspace: 1});
messageSchema.index({channel: 1})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message;