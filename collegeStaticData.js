var mongoose = require('mongoose');
var mongodb = require('mongodb');
const User = require('./models/user');

const mongoClient = mongodb.MongoClient;

mongoose.connect('mongodb://localhost:27017/AluminiBackend').then(() => {
     var userData = {};
     userData.Name = "NITJ";
     userData.Password = "nitj";
     userData.Type = "college";
     userData.Email = "nitj@gmail.com";

     var user = new User(userData);

     user.save().then((res) => {
      console.log(res);
     })
});