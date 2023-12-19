const express = require("express");
const router = express.Router();
const Group = require("../models/groupModel");
const User = require("../models/userModel");
const fetchuser = require("../middleware/errorMiddleware");
// const { json } = require('body-parser');
const { v4: uuidv4 } = require("uuid");

const session = require("express-session");

router.get("/test", fetchuser, async (req, res) => {
  console.log("hi");
  // console.log(req.body)
  res.send("request send");
});
router.get("/group", async (req, res) => {
  try {
    res.render("groupForm.ejs");
  } catch (err) {
    res.status(500).send("Internal Server Error ");
  }
});
router.post("/group/create", async (req, res) => {
  console.log(req.body.title);
  try {
    // const newGroup = new Group(req.body)
    // newGroup.author = req.user.id
    // newGroup.roomid = uuidv4()
    // await newGroup.save()
    // res.send( 'Group created successfully')
    // res.redirect('/')

    const { title } = req.body;
    console.log("-------------->", res.locals.currentUser);

    const group = new Group({
      title: title,
      author: res.locals.currentUser.name,
      roomid: uuidv4(),
    });
    console.log(group);
    const saveGroup = await group.save();
    // res.send( 'Group created successfully')

    // res.json(saveGroup)
    res.redirect("/");
  } catch (e) {
    res.send("error");
  }
});

router.get("/group/all", async (req, res) => {
  const groups = await Group.find({});
  res.render("allGroups.ejs", { groups });
});

router.get("/group/:id", async (req, res) => {
  console.log("get by id");
  const group = await Group.findById(req.params.id);
  // const members = group.members
  var currentUser = res.locals.currentUser;
  res.render("showGroup.ejs", { group, currentUser });
  // res.send(group)
});

router.post("/group/:id", async (req, res) => {
  try {
    const name = req.body;
    const currentGroup = await Group.findById(req.params.id);
    const requiredUser = await User.findOne(name);
    if (requiredUser === null) {
      res.redirect("/group/all");
    } else {
      currentGroup.members.push(JSON.stringify(requiredUser));
      await currentGroup.save();
      res.redirect(`/group/${req.params.id}`);
    }
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;
