const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const commentSchema = new Schema({
   AuthorId : {
      type : ObjectId,
      ref : "User"
   },
   AuthorName : String,
   Text : String,
   TimeStamp : Date
})

module.exports = mongoose.model('Comment',commentSchema);