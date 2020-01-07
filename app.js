//var config = require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const _ = require('lodash');
 const path = require('path');
 const User = require('./models/user');

//const mongoConnect = require('./database.js')
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

var database, collection;
mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/Alumini")
// mongoose.connection.on('connected',()=>{
//     console.log('connected');
// })
 const app = express();
 app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','*')
    next();
})
const UserRoutes = require("./routes/UserRoutes.js");

const PostRoutes = require("./routes/postRoutes.js");
app.use(UserRoutes);

app.use("/posts",PostRoutes);

  mongoose.connect('mongodb://localhost:27017/AlumniBackend').then(result =>{
  console.log('connected');  
  app.listen(8080);
  })