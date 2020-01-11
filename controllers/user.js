const User = require('../models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const Token = require("../models/token");
const crypto =require("crypto");

const transporter =  nodemailer.createTransport(sendgridTransport({
  auth : {
    api_key: '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'
  }
}))
exports.defaultpage = ((req,res)=>{
   console.log("sdv");
});

exports.registerUser=((req, res) => {
  
  User.findOne({ email: req.body.Email }, function (err, user){
    if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account'});
  var body = _.pick(req.body,['Name','FatherName','MotherName','Cgpa','WorkExperience','Type','Year','College','Subject','Password','Email']);
  const newUser = new User(body);
  newUser.Status = 1;
//  console.log('user',user);
  newUser.generateAuthToken().then((token) => {
   newUser.save().then( user=>{
    //res.header('x-auth',token).send(user);
    var token = new Token({ userId: user._id, token: crypto.randomBytes(16).toString('hex') });
    token.save().then(token =>{
      var mailOptions = { from: 'adbansal99@gmail.com', to: user.Email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' }

      transporter.sendMail(mailOptions, function(err){
        if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.Email + '.');
      })
    })
     //res.send(user);
    console.log('bhargav',user);
  }).catch(err =>{
  res.status(400).send('error while saving the data');
  console.log(err);
});

 }).catch((e) => {
   res.status(400).send('Unable to get a token');
 });

});
})

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
          res.header('x-auth',token).send(newUser);
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
   var myquery = { "Name" : req.body.Name,
                   "Type" : req.body.Type,
                   "FatherName" : req.body.FatherName,
                   "MotherName" : req.body.MotherName,
                   "College" : req.body.College,
                   "Year" : req.body.Year,
                   "Subject" : req.body.Subject  
                 };
   var newvalues = { $set: { "status" : "2" } };
   User.findOneAndUpdate(myquery,newvalues,{new : true}).then((user) =>{
       console.log(user);
     }).catch(err =>{
       console.log("error");
     })
   })

   exports.confirmUser = ((req,res)=>{
    Token.findOne({ token: req.params.id }, function (err, token) {
      console.log(token);
      if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
     
      User.findOne({ _id: token.userId, email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
         
        User.findOneAndUpdate({_id : token.userId},{'isVerified' : true},{new : true},function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }
          res.status(200).send("The account has been verified. Please log in.");
      })
        // Verify and save the user
        // user.isVerified = true;
        // user.save();
    });
    })
   })

   