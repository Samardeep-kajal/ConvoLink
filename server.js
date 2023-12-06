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

//Image preview and cloudinary upload
const upload = require("./utils/multer");
const { cloudinary } = require("./utils/cloudinary");
const path = require("path");

connectDB();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
// app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api", require("./routes/groupRoutes"));
// app.use((req, res, next) => {
//   res.locals.currentUser = req.user;
//   // res.locals.success = req.flash("success");
//   // res.locals.error = req.flash("error");
//   console.log(currentUser);
//   next();
// });

app.get("/", (req, res) => {
  // console.log(currentUser);
  res.render("home.ejs");
});

app.get("/sign-in", (req, res) => {
  res.render("login.ejs");
});

app.get("/sign-up", (req, res) => {
  res.render("signup.ejs");
});

app.get("/videoRoom", (req, res) => {
  res.render("video.ejs", { roomId: "#########" });
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
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});

//Image preview and Cloudinary upload

app.post("/api/upload", upload.single("img"), async (req, res) => {
  console.log("File details: ", req.file);

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const post_details = {
      title: req.body.title,
      image: result.public_id,
    };
    // console.log(result);
    // res.status(200).json({ post_details });
    // res.render("success");
  } catch (error) {
    console.log(error);
  }
});

const port = 8000;
server.listen(port, () => console.log(`Server started on port ${port}`));
