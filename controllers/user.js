const User = require('../models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const Token = require("../models/token");
const crypto = require("crypto");
const io = require('../socket');
const bcrypt = require("bcryptjs");
var concatPass = "Aditya";
const api = require("../playground/apikey");

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: api.apiKey
  }
}))
exports.defaultpage = ((req, res) => {
  console.log("sdv");
});

exports.registerUser = ((req, res) => {
 
  console.log(req.body);  
   password = req.body.Password;
  password = password + concatPass;
  console.log(password);

  User.findOne({ email: req.body.Email }, function (err, user) {
    //if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account' });

    var body = _.pick(req.body, ['Name', 'FatherName','Branch', 'MotherName', 'Cgpa', 'WorkExperience', 'Type', 'Year', 'College', 'Email']);
 
    const newUser = new User(body);
    newUser.Status = 1;

    bcrypt.hash(password, 12).then((result) => {
       newUser.Password = result;

    newUser.generateAuthToken().then((token) => {
      console.log('token');
      newUser.save().then(user => {
        //res.header('x-auth',token).send(user);
        var token = new Token({ userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        token.save().then(token => {
          var mailOptions = { from: 'greataditya24@gmail.com', to: user.Email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token }

          transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + user.Email + '.');
          })
        })


      }).catch(err => {
        res.status(400).send('error while saving the data');
        console.log(err);
      });

    }).catch((e) => {
      res.status(400).send('Unable to get a token');
      console.log(e);
    });

  });
});

});


exports.Login = ((req, res) => {

  console.log(req.header('auth-x'));

  console.log('Login',req.body);

  var body = _.pick(req.body, ['Email']);

  password = req.body.Password;
  password += concatPass;

  // User.findByCredentials(body.Email,body.Password).then((newUser) => {
  User.findOne({ 'Email': body.Email , 'Status':2}).then((newUser) => {
    console.log('LoginData',newUser);
    if (!newUser) {
      return res.status(401).send();
    }
    console.log(newUser);
    bcrypt.compare(newUser.Password, password).then(doMatch => {
      if (!doMatch) {
        return res.status(400);
      }
    })
    var access = "auth";
    var token = jwt.sign({ _id: newUser._id.toHexString(), access }, "bhargav").toString();

    var resData = _.pick(newUser, ['_id', 'Name', 'Email', 'Cgpa', 'Year', 'Branch', 'College', 'Type', 'Experience', 'tokens']);
    res.setHeader('x-auth', token)//.send(resData);
    // res.send(newUser);
    // console.log('bargav', res.header('x-auth'));
    res.send(resData);

  }).catch((e) => {
    console.log(e);
    res.status(400).send();
  });

});

exports.getUserData = ((req, res) => {
  console.log("College will receive the data to check the user manually");
  console.log(req.body);
  User.findOne({_id:req.body._id}).then((user) => {
    console.log(user);
    res.send(user);
  }).catch((err) =>{
    console.log(err);
  })
});

exports.validateUser = ((req, res) => {

  console.log(req.body);
  //  var myquery = _.pick(req.body,['Name','Type','FatherName','MotherName','College','Year','Subject']);
  if(req.body.isauthorized)
  {
    console.log('authorized',req.body);
    var myquery = {_id:req.body._id};
    var newvalues = { $set: { Status: 2 } };
  
    User.findOneAndUpdate(myquery, newvalues, { new: true }).then((user) => {
  
      if (!user) {
        return res.status(400).send();
      }
  

      console.log('verified data ',user);
      res.send(user);
    }).catch(err => {
      console.log("error");
    })
  }else{
    console.log("Deletion");
    User.deleteOne({_id:req.body._id}).then((user) => {
      console.log("Deleted successfully");
      console.log(user);
    });
  }
 console.log("Done");  
})

exports.confirmUser = ((req, res) => {
  Token.findOne({ token: req.params.id }, function (err, token) {
    console.log(token);
    if (!token) return res.status(400).send('We were unable to find a valid token. Your token my have expired.' );

    User.findOne({ _id: token.userId, email: req.body.email }, function (err, user) {
      if (!user) return res.status(400).send('We were unable to find a user for this token.');
      if (user.isVerified) return res.status(400).send('This user has already been verified.');

      User.findOneAndUpdate({ _id: token.userId }, { 'isVerified': true }, { new: true }, function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }

        console.log('notification',user);
        io.getIO().emit(user.College, {user:user});
        res.status(200).send("The account has been verified successfully and your details were sent to the college for verification");

        //socket



      })
      // Verify and save the user
      // user.isVerified = true;
      // user.save();
    });
  })
})

exports.updateProfile = ((req, res) => {
  const userId = req._id;

  User.findOneAndUpdate({ _id: ObjectId(req.body.userId) }, { "WorkExperience": req.body.WorkExperience }, { new: true }).then(post => {
    res.status(200).send({ msg: "Information has been successfully updated" });
  }).catch(err => {
    console.log(err);
  })
})

exports.filterUsers=((req,res) =>{
  let query ={} ;
  //const post =[];
  if(req.body.Branch)
  query.Branch=req.body.Branch;

  if(req.body.Year)
  query.Year= req.body.Year;

  if(req.body.College)
  query.College = req.body.College;

  if(req.body.Name)
  query.Name = req.body.Name;
  console.log(query);
  const userData=[];
  User.find(query).then(users =>{
     
    users.forEach(userDoc =>{
      var body= _.pick(userDoc,['Name','Email','College','Year','Cgpa','WorkExperience']);
      userData.push(body);
    })
    // var body = _.pick(users,['Name','Email']);
    // const Users= new User(body);
    //console.log(Users);
    console.log('userData',userData);
      res.status(200).json(userData);
  }).catch(err =>{
     res.status(400);
  })
});

exports.getUnverifiedUsers = ((req,res) => {
 console.log('unverified request',req.body);
 User.find({isVerified:true,Status:1,College:req.body.College}).then((user) => {
   var reqData = [];
   user.forEach((result) => {
     reqData.push({user:result});
   });
   console.log("Unverified Users",reqData);
   res.send(reqData);
 });
});

