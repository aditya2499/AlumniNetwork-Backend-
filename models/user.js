const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   Name : {
      type : String,
      required : true 
   },
   Password : {
       type :String,
       required : true
   },
   Type : {
      type : String,
      reuired : true
   },
   FatherName : {
      type : String,
      reuired : true
   },
   MotherName : {
      type : String,
      required : true
   },
   Year :{
       type : Number,
       required : true
   },
   Subject : {
      type: String ,
      required : true
   },
   Cgpa :{
      type : Number,
      required : true
   },
   College : {
      type : String,
      required : true
   },
   WorkExperience : {
      type : String,
      required : false
   },
   Status : {
    type : Number ,
    required : true
   },
   Email : {
      type : Number,
      required : true
   }
})

module.exports = mongoose.model('User',userSchema);