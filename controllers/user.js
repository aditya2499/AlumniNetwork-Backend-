const User = require('../models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const io = require('../socket').getIO();

exports.defaultpage = ((req,res)=>{
   console.log("sdv");
});

exports.registerUser=((req, res) => {

  var body = _.pick(req.body,['Name','FatherName','MotherName','Cgpa','WorkExperience','Type','Year','College','Subject','Password','Email']);
  const user = new User(body);
  user.Status = 1;
//  console.log('user',user);
  user.generateAuthToken().then((token) => {
   user.save().then( user=>{
     io.emit('collegeNotf',{
       user:user
     });
     res.set('x-auth',token).send(user);
    // res.send(user);
    console.log('bhargav',user);
  }).catch(err =>{
  res.status(400).send('error while saving the data');
  console.log(err);
});

 }).catch((e) => {
   res.status(400).send('Unable to get a token');
 });

});

exports.Login = ((req,res) => {

 console.log(req.body);

 var body = _.pick(req.body,['Email','Password']);
  
  // User.findByCredentials(body.Email,body.Password).then((newUser) => {
    User.findOne({'Email':body.Email,'Password':body.Password}).then((newUser) => {   
        
        if(!newUser){
          return res.status(400).send();
        }
        console.log(newUser);
        var access = "auth";
        var token =  jwt.sign({_id:newUser._id.toHexString(),access},"bhargav").toString();
          res.set('x-auth',token).send(newUser);
        // res.send(newUser);

  }).catch((e) => {
      console.log(e);
     res.status(400).send();
  });

});

exports.getUserData = ((req,res)=>{
   //console.log("inner");
   if(req.body.Type === 'Alumni'){
     //console.log(req)
     User.findOne({ "Name" : req.body.Name, "Password" : req.body.Password}).then(userInfo =>{
      //userInfo.json()
      //console.log(userInfo.Status);
      if(!userInfo)
      res.status(400);
      else if(userInfo.Status){
      console.log(userInfo._id)
        res.status(200).json(userInfo);
      }
      else res.status(500);  
   }).catch(err =>{
           console.log(err);
        });
     }
     else res.status(400);
   });
   
 exports.validateUser = ((req,res)=>{

  //  var myquery = _.pick(req.body,['Name','Type','FatherName','MotherName','College','Year','Subject']);
  var myquery = req.body._id;
   var newvalues = { $set: { "status" : "2" } };

   User.findOneAndUpdate(myquery,newvalues,{new : true}).then((user) =>{
       
        if(!user){
            return res.status(404).send();
        } 

        io.emit('notification',{
          user:user
        });

     }).catch(err =>{
       console.log("error");
     })
   })

   