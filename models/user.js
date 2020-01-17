const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   Name : {
      type : String,
      //required : true 
   },
   Password : {
       type :String,
       //required : true
   },
   Type : {
      type : String,
      //reuired : true
   },
   FatherName : {
      type : String,
     // reuired : true
   },
   MotherName : {
      type : String,
      //required : true
   },
   Year :{
       type : Number,
     //  required : true
   },
   Branch : {
      type: String ,
      //required : true
   },
   Cgpa :{
      type : Number,
     // required : true
   },
   College : {
      type : String,
     // required : true
   },
   WorkExperience : {
      type : String,
     // required : false
   },
   Status : {
    type : Number ,
   // required : true
   },
   Email : {
      type : String,
   //   required : true
   },
   tokens:[{
      access:{
         type:String,
         required:true
      },
      token:{
         type:String,
         required:true
      }
   }],
   isVerified : {
      type :Boolean,
      default : false
   }

});

userSchema.methods.generateAuthToken = function() {
   var newUser = this;
   var access = "auth";
   var token = jwt.sign({_id:newUser._id.toHexString(),access},"bhargav").toString();
  // console.log('token',token);
   newUser.tokens.push({access,token});
   
   //console.log('newUser',newUser);
   return newUser.save().then(() => {
      console.log('newUser');
      return token;
   });
};
   
userSchema.methods.findByCredentials = function(Email,Password) {
   
   var newUser = this;

   return newUser.findOne({Email,Password}).then((user1) => {
      if(!user1)
      return Promise.reject('No User');

      return user1;

   });

};

module.exports = mongoose.model('User',userSchema);