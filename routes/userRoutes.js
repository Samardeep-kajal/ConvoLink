const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/errorMiddleware");
const dotenv = require("dotenv").config();
const session = require("express-session");
const mutler = require('multer')
const upload = require("../utils/multer");
const { cloudinary } = require("../utils/cloudinary");


router.get("/one", async(req, res) => {
    console.log("hi");
    res.send("request send");
});

// , [
//     body("name", "Enter a valid Name").isLength({ min: 3 }),
//     body("password", "Password must be 5 characters long").isLength({ min: 5 }),
//     body("email", "Enter a valid Email").isEmail(),
//     body("image", "valid file format")
// ]

router.post(
    "/createuser", upload.single("image"),
    async(req, res) => {
        // let success = false;
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     console.log("ita Meeeeeeee------------e-e--e-e-e")
        //     return res.status(400).json({ success, errors: errors.array });
        // }
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "convoLinkTest"
            });
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            let user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email,
                image: result.secure_url
            });
            // console.log(user)
            const data = {
                user: {
                    id: user._id,
                },
            };
            const authToken = jwt.sign(data, process.env.JWT_SECRET);

            success = true;
            // console.log({ success, authToken });
            res.redirect('/sign-in')
        } catch (err) {
            console.log("its meeeeeeeeeeeeeee")
            res.status(500).json({
                error: err.message
            });
        }
    }
);

router.post(
    "/login", [
        body("email", "Enter a valid Email").isEmail(),
        body("password", "password cannot be blank").exists(),
    ],
    async(req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            req.session.user = user
            if (!user) {
                success = false;
                return res
                    .status(400)
                    .json({ success, error: "try to login with correct Credentials" });
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res
                    .status(400)
                    .json({ success, error: "try to login with correct Credentials" });
            }

            const data = {
                user: {
                    id: user._id,
                },
            };
            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            success = true;
            // console.log({ success, authToken });
            res.redirect('/')
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);
router.get("/getuser", fetchuser, async(req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (err) {
        res.status(500).send("Internal Server Error ");
    }
});

module.exports = router;