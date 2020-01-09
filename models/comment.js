const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const commentSchema = new Schema({
   AuthorId : {
      type : ObjectId,
      ref : "User"
   },
   AutherName : String,
   Text : String,
   TimeStamp : Date
})

module.exports = mongoose.model('Comment',commentSchema);