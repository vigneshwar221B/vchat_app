const mongoose = require("mongoose");


const msgSchema = new mongoose.Schema({
    name: String,
    msg:[]
});



module.exports = msgSchema;