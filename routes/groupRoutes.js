const express = require('express')
const router = express.Router()
const Group = require('../models/groupModel')
// const User = require('../models/userModel')
const  fetchuser  = require('../middleware/errorMiddleware');
// const { json } = require('body-parser');
// const { v4: uuidv4 } = require('uuid')



router.get("/test", async (req, res) => {
    console.log("hi");
    res.send("request send");
  });
  router.get("/group",fetchuser,async(req,res)=>{
    try{

        res.render('./groupForm.ejs')
    }
        catch (err) {
        res.status(500).send("Internal Server Error ");
      }
  })
router.post("/group/create",fetchuser, async(req, res) => {
        try {
            const newGroup = new Group(req.body)
            newGroup.author = req.user.name
            newGroup.roomid = uuidv4()
            await newGroup.save()
            req.flash('success', 'Group created successfully')
            res.redirect('/')
        } catch (e) {
            req.flash('error', e.message)
            res.redirect('/')
        }

    })

router.get('/group/all',async(req, res) => {
        // const groups = await Group.find({})
        // res.render('allGroups.ejs', { groups })
    })

// router.route('/group/:id')
//     .get(fetchuser, async(req, res) => {
//         const group = await Group.findById(req.params.id)
//         const members = group.members
//         res.render('group/showGroup.ejs', { group })
//     })
//     .post(fetchuser, async(req, res) => {
//         try {
//             const username = req.body
//             const currentGroup = await Group.findById(req.params.id)
//             const requiredUser = await User.findOne(username)
//             if (requiredUser === null) {
//                 req.flash('error', 'Not valid Username')
//                 res.redirect('/group/all')
//             } else {
//                 currentGroup.members.push(JSON.stringify(requiredUser))
//                 await currentGroup.save()
//                 req.flash('success', "user added")
//                 res.redirect(`/group/${req.params.id}`)

//             }
//         } catch (e) { req.flash('error', e.message) }

//     })

module.exports = router