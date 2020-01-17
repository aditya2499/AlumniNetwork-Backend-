const User = require('../models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const Token = require("../models/token");
const crypto =require("crypto");
const io = require('../socket');
const apikey = require('../playground/apikey');
const path = require('path');
const socket = require('../socket');

const transporter =  nodemailer.createTransport(sendgridTransport({
  auth : {
    api_key : apikey.apiKey
  }
}));

exports.registerUser=((req, res) => {

  console.log(req.body.data);
  
  User.findOne({ email: req.body.Email }, function (err, user){
    if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account'});

  var body = _.pick(req.body,['Name','FatherName','MotherName','Cgpa','WorkExperience','Type','Year','College','Branch','Password','Email']);
  const newUser = new User(body);
  newUser.Status = 1;
//  console.log('user',user);
  newUser.generateAuthToken().then((token) => {
   newUser.save().then( user=>{
    //res.header('x-auth',token).send(user);
    var token = new Token({ userId: user._id, token: crypto.randomBytes(16).toString('hex') });
    token.save().then(token =>{
      var mailOptions = { from: 'adbansal99@gmail.com ', to: user.Email, subject: 'Account Verification Token', text: '<h1>Hello</h1>,\n\n' + '<p>Please</p> <h1>verify your account by clicking the</h1> link: \nhttp:\/\/' + "192.168.43.60:8080" + '\/confirmation\/' + token.token  }
      console.log('Before sending a mail');
      transporter.sendMail(mailOptions, function(err){
        console.log('err',err);
        if (err) { return res.status(500).send({ msg: err.message }); }
        console.log('Mail was sent to the email');
                res.status(200).send('A verification email has been sent to your Mail');
      });
    })
  }).catch(err =>{
  res.status(401).send('error while saving the data');
  console.log(err);
});

 }).catch((e) => {
   res.status(400).send('Unable to get a token');
   console.log(e);
 });

});

})

exports.Login = ((req,res) => {

  console.log(req.header('auth-x'));

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

        if(newUser.Type === 'college')
        {
          newUser = _.pick(newUser,['Name','Type','Email','Password']);
          console.log('Login Successfully');
          return res.send(newUser);  
        }

        if(newUser.isVerified)
        {
          console.log('check');
           io.getIO().emit('NITJ',{
             data:"Bhargav"
           });
          return res.send(newUser); 
        }else{
          console.log("Unauthorized");
          return res.status(401).send("UnAuthourized");
        }
        

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
      return res.status(400);
      
      if(userInfo.Status){
      console.log(userInfo._id)
        res.status(200).json(userInfo);
        console.log('Login was success');
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

        // io.emit('notification',{user:user});

        // socket.to(user.Email).emit('an event', { some: 'data' });

     }).catch(err =>{
       console.log("error");
     })
   })

   exports.confirmUser = ((req,res)=>{
    Token.findOne({ token: req.params.id }, function (err, token) {
      console.log(token);
      if (!token) return res.status(400).send('We were unable to find a valid token. Your token my have expired.');
     
      User.findOne({ _id: token.userId, email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (user.isVerified) return res.status(400).send('This user has already been verified.');
         
        User.findOneAndUpdate({_id : token.userId},{'isVerified' : true},{new : true},function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          // io.emit('NITJ',{user});//toCollegePort
          // res.sendFile(__dirname + '/../public' + '/confirm.html');
          console.log(path.join(__dirname,'../public/index.html'));
          res.send('Email was verified successfully');

          //socket

      })
        // Verify and save the user
        // user.isVerified = true;
        // user.save();
    });
    })
   })

   