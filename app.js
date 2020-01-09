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
//  app.use(express.static(__dirname,'./public'));
// app.use(express.static(__dirname,'public'));
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

  mongoose.connect('mongodb+srv://Ad03:KGdePorXHMW9jyNP@alumninetwork-dxjvt.mongodb.net/shop?retryWrites=true&w=majority').then(result =>{
  //console.log('connected to port 8080');  
  app.listen(8080,() =>{
    console.log("Server up on port 8080");
  })
  })
