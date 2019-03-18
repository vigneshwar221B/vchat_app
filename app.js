/*jshint esversion: 6 */

var mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    session = require("express-session"),
    flash = require("connect-flash"),
    passport = require('passport'),
    express = require('express'),

    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

const user = require("./models/userlist");
//configuring passport

require('./config/passport')(passport);

app.use(express.static("public"));

app.use(bodyparser.urlencoded({
    extended: true
}));
//setting up socket.io

app.set('socketio', io);


//setting view engine
app.set("view engine", "ejs");


//setting up the database connection
const db = require('./config/dbkeys').mongoURI;

mongoose
    .connect(
        db, {
            useNewUrlParser: true
        }

    ).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//creating a user session

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//passport configuration

app.use(passport.initialize());
app.use(passport.session());

//connecting flash
app.use(flash());

//setting global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//All route handlers
app.use(require("./routes/index.js"));
app.use(require("./routes/handler.js"));
app.use(require("./routes/chatHandler.js"));

//404 page
app.use((req, res, next) => {

    res.status(404).render("e404page");

});



server.listen(5000);
console.log("server started at 5000");