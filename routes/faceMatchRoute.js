const express = require('express')
const router = express.Router()
const searchFace = require('../public/js/AWS_faceRekognition/searchFaces')
const Group = require('../models/groupModel')
const upload = require('../utils/index')
    // const multer = require('multer')
    // const upload = multer({ dest: 'uploads/' })

router.post("/:id/searchFace", upload.single('image'), async(req, res) => {
    const group = await Group.findById(req.params.id)
        // const result = await cloudinary.uploader.upload(req.file.path, {
        //     folder: "convoLinkTest_GroupPhoto"
        // });
    const memberList = req.body.members.split(',')
    const imgUrl = req.file.path
    if (!group) {
        return res.status(404).json({ error: "Group not found" })
    }
    // const filePath = req.file.path
    const present = await searchFace(imgUrl, group.title)
    const absent = []
    memberList.forEach(el => {
        if ((present.includes(el)) == false) {
            absent.push(el)
        }
    });
    const attendance = {
        'presentStudent': present,
        'absentStudent': absent
    }
    console.log(absent, attendance, attendance.absentStudent, attendance.presentStudent)
    res.render('presentStudent.ejs', { attendance })
})

module.exports = router