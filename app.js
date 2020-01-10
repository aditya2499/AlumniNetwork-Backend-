const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
const http = require('http');
const app = express();
const socket = require('./socket.js');
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
var server = http.createServer(app);

var database, collection;
mongoose.Promise = global.Promise;

// mongoose.connect("mongodb://localhost:27017/Alumini")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','*');
    res.setHeader('Access-Control-Allow-Credentials','true');
    next();
});

const UserRoutes = require("./routes/UserRoutes.js");
const PostRoutes = require("./routes/postRoutes.js");

app.use(UserRoutes);
app.use("/posts",PostRoutes);


mongoose.connect('mongodb://localhost:27017/AlumniBackend').then(result =>{

   var server = app.listen(8080,(res) =>{
    console.log('Server up on port 8080');
    
    var io = socket.init(server);

     io.on('connection',(socket) => {
       console.log('New Connection');
     });
     
  });

});
