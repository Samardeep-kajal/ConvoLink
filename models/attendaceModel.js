const mongoose = require('mongoose');
const { Schema } = mongoose

const attendanceEntrySchema = new Schema({
    date: { type: Date, required: true },
    attendes: [{
        member: { type: Schema.Types.String, ref: 'user', required: true },
        status: { type: String, required: true, enum: ['present', 'absent'] }
    }]
}, { _id: false })

const groupAttendanceSchema = new Schema({
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true, unique: true },
    attendance: [attendanceEntrySchema]
});

const GroupAttendance = mongoose.model('GroupAttendance', groupAttendanceSchema);

module.exports = GroupAttendance;