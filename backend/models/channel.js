const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const channelSchema = new Schema({
	text: {
		type: String,
		required: true
	},
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel;