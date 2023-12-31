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
        type: Schema.Types.String,
        ref: 'user'
    },
    members: [{
        type: Schema.Types.String,
        ref: 'user'
    }],
    roomid: {
        type: Schema.Types.String,
        unique: true
    }
})

module.exports = mongoose.model('Group', groupSchema)