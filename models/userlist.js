const mongoose = require("mongoose");
const msgSchema = require("./MessagingSchema");


const userSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true,

    },

    lname: {
        type: String,
        required: true,

    },

    uname: {
        type: String,
        required: true,
        unique: true

    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

   msglist:[msgSchema],
   
   ulist: []

});



const User = mongoose.model("Item", userSchema);


module.exports = User;

