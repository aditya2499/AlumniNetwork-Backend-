const Post = require("../models/post");
const mongoose = require('mongoose');
const fs = require('fs');
//const path = require('path');

// const Comments = require('../models/comment');
const _ = require('lodash');
//const fs = require('fs');
const path = require('path');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;
const {fileURLToPath }=require("url");
const {dirname} = require("path");
const ObjectId = mongoose.Types.ObjectId;
const Comment = require("../models/comment");
exports.getPostByUser= ((req,res)=>{
    
   console.log(req.body);
    Post.find({AuthorId : req.body.AuthorId}).then(userPosts=>{
       console.log(userPosts);
       console.log(__dirname);
      var temp = fs.readFileSync(path.join(__dirname ,'../uploads/1578504087845IMG_20191028_123337.jpg'));
      console.log(temp);
      temp.toString();
      res.send(temp);
      //  res.sendFile(__dirname + '/uploads/1578509051350Screenshot from 2019-12-26 23-10-51.png');
      //  res.send(userPosts);
       res.end();
    })
})

exports.getPostByCollege=((req,res) =>{
    Post.find({'College' : req.body.College}).then(collegePost =>{
       console.log(collegePost);
    
      })
})

exports.createPost=((req,res) =>{
   console.log(req.file);
   console.log(req.body);

   console.log(path.join(__dirname,'../' + req.file.path));

   // console.log(__dirname);
   // var temp = fs.readFileSync(__dirname  + '\\' + req.file.path);
   // console.log(temp);

    const AuthorId = ObjectId (req.body.Id);
    const Name= req.body.Name;
    const College = req.body.College;
    const Date = req.body.Date;
    const Content = req.body.Content;
    const NoOfLikes = 0;
    const NoOfComments = 0
    const Type= req.body.Type;
    const Likes = [];
    const Comments = [];
    const post= new Post({
       AuthorId : AuthorId,Name : Name,College : College, Date : Date, Content : Content,
       NoOfComments : NoOfComments,NoOfLikes : NoOfLikes,Type : Type,Likes : Likes, Comments :Comments,postImage:req.file.path
    });
    post.save().then(post =>{
       console.log(post);
       res.status(200).json(post);
    }).catch(err =>{
       console.log(err);
       res.status(500).send(err);
    })
})

exports.LikesPost=((req,res) =>{
   Post.findOneAndUpdate({ _id :ObjectId(req.body.Id) },{ $inc : {"NoOfLikes" : 1}, $push : {"Likes" : ObjectId(req.body.UserId) } },{new : true}).then(post =>{
      console.log(post.NoOfLikes);
      console.log(post.Likes);
      res.status(200).json(post);
   })

 })
 exports.UnlikePost = ((req,res)=>{
   Post.findOneAndUpdate({ _id : ObjectId(req.body.Id)},{$inc : {"NoOfLikes" : -1}, $pull :{"Likes" : ObjectId(req.body.UserId)}},{new : true}).then(post =>{
      console.log(post.NoOfLikes);
      console.log(post.Likes);
      res.status(200).json(post);
   })
}) 

exports.PostComment = ((req,res) =>{
   var body = _.pick(req.body,["AuthorId","AuthorName","Text","TimeStamp"]);
   const comment = new Comment(body);
   Post.findOneAndUpdate({_id : ObjectId(req.body.Id)},{$inc : {"NoOfComments" : 1}, $push : {"Comments" : comment}},{new : true}).then(post =>{
      console.log(post);
      res.status(200).json(post);
   })
 })
