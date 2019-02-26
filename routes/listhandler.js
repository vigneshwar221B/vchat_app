const express = require("express");
const router = express.Router();



const {ensureAuthenticated} = require('../config/auth');


router.get("/users/dashboard", ensureAuthenticated, function (req, res) {

        

});

//adding a item
router.post("/users/dashboard/add", ensureAuthenticated, function (req, res) {

});

//for deleting a item

router.post("/users/dashboard/delete", ensureAuthenticated, function (req, res) {
    
   
});


module.exports = router;