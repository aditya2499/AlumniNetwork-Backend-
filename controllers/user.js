const User = require('../models/user');

exports.defaultpage = ((req,res)=>{
   console.log("sdv");
})
exports.registerUser=((req, res) => {
   //console.log(request)
  req.body.Status= 1;
  const Name = req.body.Name;
  const FatherName = req.body.FatherName;
  const MotherName = req.body.MotherName;
  const Cgpa = req.body.Cgpa;
  const Status = req.body.Status;
  const WorkExperience = req.body.WorkExperience;
  const Type = req.body.type;
  const Year = req.body.Year;
  const College = req.body.College;
  const Subject = req.body.Subject;
 const user = new User({
   Name :Name ,FatherName : FatherName, MotherName : MotherName , Cgpa : Cgpa , Status : Status,WorkExperience :WorkExperience ,Type :Type,Year : Year,College : College,Subject : Subject
 })
 user.save().then( user=>{
     console.log(user);
 }).catch(err =>{
   console.log(err);
 })

})

exports.getUserData = ((req,res)=>{
   //console.log("inner");
   if(req.body.Type === 'Alumni'){
     //console.log(req)
     User.findOne({ "Name" : req.body.Name}).then(userInfo =>{
      //userInfo.json()
      //console.log(userInfo.Status);
      if(userInfo.Status){
      console.log(userInfo._id)
        res.status(200).json(userInfo);
      }
      else res.status(500);  
   }).catch(err =>{
           console.log(err);
        })
     }
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