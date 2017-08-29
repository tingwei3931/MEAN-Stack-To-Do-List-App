//import dependenciess
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser'); //parses incoming requiest bodies
const cors = require('cors'); //make a request to a api from a diff domain name
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Connect To Database
mongoose.connect(config.database);

//On Connection
mongoose.connection.on('connected', () => {
    console.log("Connected to database " + config.database);
});

//Listen for connection error
mongoose.connection.on('error', (err) => {
    console.log("Database Error: " + err);
});

const app = express();

const users = require("./routes/users");

//Port Number
const port = process.env.PORT || 8080; //for deployment 

//CORS Middleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
app.use('/users', users); //anything localhost/users will go to users file

//Index Route
app.get('/', (req, res) =>{
    res.send("Invalid Endpoint");
});

//make sure routes aside from the routes that we specified redirects to index.html ./public
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})
//Start Server
app.listen(port, () => {
    console.log("Server started on port " + port);
})