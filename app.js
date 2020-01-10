//var config = require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const _ = require('lodash');
 const path = require('path');
 const User = require('./models/user');
 const http = require('http');
 const socketIO = require('socket.io');

//const mongoConnect = require('./database.js')
const app = express();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
// var server = http.createServer(app);
var server = http.createServer(app);

var database, collection;
mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/Alumini")
// mongoose.connection.on('connected',()=>{
//     console.log('connected');
// })
//  app.use(express.static(__dirname,'./public'));
// app.use(express.static(__dirname,'public'));
 app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','*')
    next();
});
// const UserRoutes = require("./routes/UserRoutes.js");

// const PostRoutes = require("./routes/postRoutes.js");
// app.use(UserRoutes);

// app.use("/posts",PostRoutes);

app.post('/test',(req,res) => {

  console.log(req.body);
  
  var io = socketIO(server);
  io.origins('*:*');
  
  io.on('connection',(socket) => {
      console.log('new Connection');
  
      io.emit('notification',{
        data:"I am Bhargav"
      });
  
  });

  res.send(req.body);

});

  mongoose.connect('mongodb://localhost:27017/AlumniBackend').then(result =>{
  //console.log('connected to port 8080');  
  app.listen(8080,(res) =>{
    console.log('Server up on port 8080');
    // const io = require('./socket').init(server);
  //   io.on('connection',(socket) => {
  //     console.log('New Connection');
  //   });
  });
  });
