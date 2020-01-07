const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const postSchema= new Schema({
   // author : {
   //    id : ObjectId(),
   //    name : String,
   //    required : true
   // },
   AuthorId: {
       type : ObjectId,
       ref : "User"
   },
   Name : {
      type : String
   },
   College : {
      type: String,
      required : true  
   },
   Type:{
      type: String,
      required : true
   },
   Date : {
      type : Date,
      required : true,
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
   //Comment : {}

})

module.exports = mongoose.model("Post",postSchema);