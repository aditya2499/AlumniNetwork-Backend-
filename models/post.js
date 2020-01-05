const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema= new Schema({
   Name : {
      type : String,
      required : true
   },
   College : {
      type: String,
      required : true  
   },
   Date : {
      type : String,
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
   }

})

module.exports = mongoose.model("Post",postSchema);