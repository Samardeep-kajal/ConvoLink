const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");
const ejsMate = require("ejs-mate");
var cors = require("cors");
const app = express();
const path = require('path')

connectDB();
app.engine("ejs", ejsMate);
app.set("views engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());

app.use("/api/auth", require("./routes/userRoutes"));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/sign-in", (req, res) => {
    res.render("login.ejs");
});

app.get("/sign-up", (req, res) => {
    res.render("signup.ejs");
});

app.get("/videoRoom", (req, res) => {
    res.render("video.ejs", { roomId: "#########" })
})

const port = 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));