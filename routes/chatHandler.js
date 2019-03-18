/*jshint esversion: 6 */
var express = require('express'),
    router = express.Router();
   

const { ensureAuthenticated } = require("../config/auth");

const user = require("../models/userlist");

router.get("/users/chat", ensureAuthenticated, (req, res) =>{
    console.log(req.body);
  
    
    user.findOne({

         email: req.user.email

    },  (err, foundItems)=> {

         res.render("chat", {

             userslist: foundItems.ulist,
             current_user: req.user.email
            
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


router.post("/users/chat/user", ensureAuthenticated,(req,res)=>{

    console.log(req.user);

      var io = req.app.get('socketio');
      io.sockets.on('connection', (socket) => {

          socket.on("new msg", (data) => {
              console.log("new msg created");

              user.findOne({

                  email: req.user.email

              }, (err, foundItems) => {
                  foundItems.msglist.forEach((e) => {
                      if (e.name === data.receiver) {
                          e.msg.push(data.msg_content);
                      }
                  });
                  foundItems.asocket.emit("new msg", data);
              });

              user.findOne({

                  uname: data.receiver

              }, (err, foundItems) => {
                  foundItems.msglist.forEach((e) => {
                      if (e.name === req.user.uname) {
                          e.msg.push(data.msg_content);
                      }
                  });
                  foundItems.asocket.emit("new msg", data);
              });

          });

          socket.on('new user', (data) => {

              console.log("new user initialized");

              user.findOne({

                  email: req.user.email

              }, (err, foundItems) => {

                  if (err) throw err;

                  if (foundItems.asocket == null) {

                      foundItems.asocket = socket;

                  }

              });

          });

      });
    
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
            chatdata = [];
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
