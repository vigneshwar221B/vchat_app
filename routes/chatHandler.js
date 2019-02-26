const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

router.get("/users/chat", ensureAuthenticated, function(req, res) {
    res.render("chat");
});

//adding a item

router.post("/users/chat/add", ensureAuthenticated, function(req, res) {
    
});

//for deleting a item

router.post("/users/chat/delete", ensureAuthenticated, function(req, res) {});

module.exports = router;
