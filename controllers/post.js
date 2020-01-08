const Post = require("../models/post");
const mongoose = require('mongoose');
const Comments = require('../models/comment');
const _ = require('lodash');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
exports.getPostByUser= ((req,res)=>{
    
    Post.find({AuthorId : req.body.Id}).then(userPosts=>{
       console.log(userPosts);
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
    const AuthorId = ObjectId (req.body.Id);
    const Name= req.body.Name;
    const College = req.body.College;
    const Date = req.body.Date;
    const Content = req.body.Content;
    const NoOfLikes = 0;
    const NoOfComments = 0
    const Type= req.body.Type;
    const Likes = [];
    const post= new Post({
       AuthorId : AuthorId,Name : Name,College : College, Date : Date, Content : Content,
       NoOfComments : NoOfComments,NoOfLikes : NoOfLikes,Type : Type,Likes : Likes,
       postImage:req.file.path
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
