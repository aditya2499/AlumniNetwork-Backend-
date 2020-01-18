const mongoose = require('mongoose');
const Comment = require('./comment').Schema;
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const postSchema= new Schema({
   AuthorId: {
       type : ObjectId
   },
   Name : {
      type : String
   },
   College : {
      type: String 
   },
   Type:{
      type: String
   },
   Date : {
      type : String
   },
   Content: {
      type : String,
      default : ""
   },
   NoOfLikes : {
      type : Number,
      default : 0
   },
   NoOfComments :{
      type: Number,
      default : 0
   },
   Likes : {
      type : [ObjectId]
   },
   Comments : {
      type : [Comment]
   },
   postImage:{
      type:String
   },
   PostDate : {
      type : Date,
     default : Date.now()
   }
   //Comment : {}
});

module.exports = mongoose.model("Post",postSchema);