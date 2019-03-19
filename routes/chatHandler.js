/*jshint esversion: 6 */
var express = require('express'),
    router = express.Router();

const {
    ensureAuthenticated
} = require("../config/auth");

const user = require("../models/userlist");

router.get("/users/chat", ensureAuthenticated, (req, res) => {
    var allSockets = req.app.get("all_sockets");
    var io = req.app.get('socketio');

    io.sockets.on('connection', (socket) => {

        socket.on('new user', (data) => {
            socket.name = data;
            allSockets[socket.name] = socket;
        });

    });

    user.findOne({

        email: req.user.email

    }, (err, foundItems) => {

        res.render("chat", {

            userslist: foundItems.ulist,
            current_user: req.user.email

        });
    });

});

//adding a item

router.post("/users/chat/add", ensureAuthenticated, (req, res) => {

    user.findOne({
        email: req.body.add_field
    }, (err, foundItems2) => {

        if (!foundItems2) {
            res.redirect("/users/chat");
        } else {

            user.findOne({

                email: req.user.email

            }, (err, foundItems1) => {

                foundItems1.ulist.push(foundItems2.uname);

                foundItems1.save().then(saved => {
                    console.log("saved");
                }).catch((err) => {
                    console.log(err);
                });

                foundItems2.ulist.push(foundItems1.uname);

            });

            foundItems2.save().then(saved => {
                console.log("saved");
            }).catch((err) => {
                console.log(err);
            });

            

        }

    });
    res.redirect("/users/chat");

});


router.post("/users/chat/user", ensureAuthenticated, (req, res) => {
    var allSockets = req.app.get("all_sockets");
    var io = req.app.get('socketio');

    io.sockets.on('connection', (socket) => {

        socket.on("new msg", (data) => {

            user.findOne({

                email: req.user.email

            }, (err, foundItems) => {
                foundItems.msglist.forEach((e) => {
                    if (e.name === data.receiver) {
                        e.msg.push(data.msg_content);
                    }
                });
                foundItems.save().then(saved => {
                    console.log("saved");
                }).catch((err) => {
                    console.log(err);
                });

                allSockets[req.user.email].emit("new msg", data);
            });

            user.findOne({

                uname: data.receiver

            }, (err, foundItems) => {
                foundItems.msglist.forEach((e) => {
                    if (e.name === req.user.uname) {
                        e.msg.push(data.msg_content);
                    }
                });
                foundItems.save().then(saved => {
                    console.log("saved");
                }).catch((err) => {
                    console.log(err);
                });

                allSockets[foundItems.email].emit("new msg", data);
            });

        });

    });

    user.findOne({

        uname: req.body.user_name

    }, (err, foundItems) => {

        if (foundItems) {

            var chatdata;


            foundItems.msglist.forEach(element => {

                if (element.name === req.user.uname) {
                    chatdata = element.msg;
                }

            });


            if (chatdata === undefined) {
                chatdata = [];
            }

            res.render("msglist", {
                user: foundItems.uname,
                values: chatdata
            });

        } else {
            res.redirect("/users/chat");

        }

    });

});


module.exports = router;