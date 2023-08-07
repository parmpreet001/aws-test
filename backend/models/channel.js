const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const channelSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	owner: {
		type: String,
		required: true
	}
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel;