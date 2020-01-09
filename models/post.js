const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const postSchema= new Schema({
   AuthorId: {
       type : ObjectId,
       ref : "User"
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
      type : [ObjectId],
      required : false
   },
   // Comments : {
   //    type : [Comment],
   //    required : false
   // },
   postImage:{
      type:String
   }
   //Comment : {}

})

module.exports = mongoose.model("Post",postSchema);