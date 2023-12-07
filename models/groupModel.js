const mongoose = require('mongoose')
const user = require('./userModel')
const { Schema } = mongoose

const groupSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    members: [{
        type: Schema.Types.String,
        ref: 'user'
    }],
    roomid: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('Group', groupSchema)