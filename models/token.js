const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const tokenSchema = new Schema({
   userId : {
      type : ObjectId,
      required :true,
      ref : "User"
   },
   token :{
      type :String,
    required : true
   },
   createdAt : {
      type : Date,
      required: true,
      default : Date.now(),
      expires : 43200
   }
})

module.exports = mongoose.model('Token',tokenSchema);