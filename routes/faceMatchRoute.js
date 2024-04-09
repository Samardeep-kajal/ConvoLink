const express = require('express')
const router = express.Router()
const searchFace = require('../public/js/AWS_faceRekognition/searchFaces')
const Group = require('../models/groupModel')
const GroupAttendance = require('../models/attendaceModel')
const upload = require('../utils/index')



router
    .post("/:id/searchFace", upload.single('image'), async(req, res) => {
        const group = await Group.findById(req.params.id)

        if (!group) {
            return res.status(404).json({ error: "Group not found" })
        }

        const memberList = req.body.members.split(',')

        const filePath = req.file.path
        const present = await searchFace(filePath, group.title)

        const attendanceRecords = []

        memberList.forEach(el => {
            if ((present.includes(el)) == false) {
                attendanceRecords.push({
                    member: el,
                    status: 'absent'
                })
            } else {
                attendanceRecords.push({
                    member: el,
                    status: 'present'
                })
            }

        });
        const newAttendance = {
            date: new Date(),
            attendes: attendanceRecords
        }

        const updatedAttendance = await GroupAttendance.findOneAndUpdate({ groupId: group.id }, { $push: { attendance: newAttendance } }, { new: true, upsert: true })

        const newFormat = updatedAttendance.attendance
        res.render('presentStudent.ejs', { newFormat })
    })
    .get('/:id/attendance', async(req, res) => {
        const group = await Group.findById(req.params.id)
        const Attendance = await GroupAttendance.findById(group.attendance)
        const newFormat = Attendance.attendance
        res.render('presentStudent.ejs', { newFormat })
    })

module.exports = router