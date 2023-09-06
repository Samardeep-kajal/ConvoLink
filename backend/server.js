const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
