const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

const user = require("../models/userlist");

router.get("/users/chat", ensureAuthenticated, (req, res) =>{
    
    user.findOne({

         email: req.user.email

    },  (err, foundItems)=> {
            

         res.render("chat", {

             userslist: foundItems.ulist,
            

         });
    });

   
});

//adding a item

router.post("/users/chat/add", ensureAuthenticated, (req, res)=> {

    user.findOne({email: req.body.add_field},(err, foundItems)=>{
                    
        if(!foundItems){
            res.redirect("/users/chat");
        }else{

            user.findOne({

                email: req.user.email

            }, (err, foundItems2) => {
                

                foundItems2.ulist.push(foundItems.uname);
                foundItems2.save(function (err) {
                    if (err) {
                        console.error('ERROR!');
                    }
                });
                
            });


            res.redirect("/users/chat");
        }
 
    });


});


router.post("/users/chat/user",ensureAuthenticated,(req,res)=>{
    
    user.findOne({

        uname: req.body.user_name

    }, (err, foundItems) => {

        if(foundItems){

        var chatdata;

        
        foundItems.msglist.forEach(element => {

            if(element.name === req.user.uname){
                chatdata = element.msg;
            }
            
        });
        

        if (chatdata === undefined) {
            chatdata = []
        }
        res.render("msglist", {
            user: foundItems.uname,
            values: chatdata
        });

    }else{
     res.redirect("/users/chat");

}
});


});


module.exports = router;
