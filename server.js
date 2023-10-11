const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");
const ejsMate = require("ejs-mate");
var cors = require("cors");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

connectDB();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

//Socket IO Functionality
app.get("/join-meeting", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});

const port = 8000;
server.listen(port, () => console.log(`Server started on port ${port}`));
