const User = require('../models/user');
const _ = require('lodash');

exports.defaultpage = ((req,res)=>{
   console.log("sdv");
});

exports.registerUser=((req, res) => {
   //console.log(request)
  // req.body.Status= 1;
  // const Name = req.body.Name;
  // const FatherName = req.body.FatherName;
  // const MotherName = req.body.MotherName;
  // const Cgpa = req.body.Cgpa;
  // const Status = req.body.Status;
  // const WorkExperience = req.body.WorkExperience;
  // const Type = req.body.type;
  // const Year = req.body.Year;
  // const College = req.body.College;
  // const Subject = req.body.Subject;
  // const Password = req.body.Password;

  var body = _.pick(req.body,['Name','FatherName','MotherName','Cgpa','WorkExperience','Type','Year','College','Subject','Password','Email']);
 const user = new User(body);
 user.Status = 1;
 console.log('user',user);
 user.generateAuthToken().then((token) => {
  user.save().then( user=>{
    res.header('x-auth',token).send(user);
    console.log(user);
}).catch(err =>{
  res.status(400).send('error while saving the data');
  console.log(err);
});

 }).catch((e) => {
   res.status(400).send('Unable to get a token');
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
        })
     }
     else res.status(400);
   })
   
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