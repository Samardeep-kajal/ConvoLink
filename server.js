const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");
const ejsMate = require('ejs-mate')
var cors = require('cors')
const app = express();

connectDB();
app.engine('ejs', ejsMate)
app.set('views engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/api/auth',require('./routes/auth'))

app.get('/', (req, res) => {
    res.render('home.ejs')
})

const port = 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));