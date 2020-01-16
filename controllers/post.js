const Post = require("../models/post");
const mongoose = require('mongoose');
const fs = require('fs');
//const path = require('path');
//const Query = require("../models/query");
const User = require('../models/user');
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

exports.getAllPost = ((req,res) =>{
   Post.find().then(userPosts=>{

      const Data = _.pick(userPosts,['ImageData','Likes','NoOfLikes','NoOfComments']);
      console.log(Data); 

       res.send(Data);
    })
})
exports.getPostByUser= ((req,res)=>{
   console.log('header',req.header('x-auth'));
    console.log(req.body);
    Post.find({AuthorId : req.body.Id}).then(userPosts=>{

      const Data = _.pick(userPosts,['Likes','NoOfLikes','NoOfComments']);
      Data.ImageData = userPosts.ImageData.toString();
      // console.log(userPosts.ImageData.toString());
      // console.log(Data);

      if(!userPosts)
      return res.status(400).send('No Posts Found');

       res.send(Data);
       res.end();
    })
})



exports.getPostByCollege=((req,res) =>{
   console.log('header',req.header('x-auth'));
   console.log(req.body);
    Post.find({'College' : req.body.College}).then(collegePost =>{
        console.log('photo',collegePost);

        collegePost.foreach(post =>{
           if(post.Likes.includes(ObjectId(req.body.UserId)))
             post.isLiked=true;
           else post.isLiked=false;  
        })
        res.status(200).send(collegePost);
      }).catch((err) => {
         console.log('Error',err);
      });
});

exports.createPost=((req,res) =>{
   console.log('header',req.header('x-auth'));
   console.log(req.file);
   console.log(req.body);

   var temp = "";
   var ImagePath = "";

   if(!req.file)
   {
      // return res.status(400).send();
   }else{
      ImagePath = req.file.path;
      console.log(ImagePath);
   temp =    fs.readFileSync(path.join(__dirname,'../' + ImagePath));
   }

   console.log(temp);

   // fs.unlink(path.join(__dirname,'../' + req.file.path),(err) => {
   //    if(err){
   //       console.log(err);
   //    }
   //    console.log('Deleted');
   // });

    const AuthorId = req.body._id;
    const Name= req.body.Name;
    const College = req.body.College;
    const Date = req.body.Date;
    const Content = req.body.Content;
    const NoOfLikes = 0;
    const NoOfComments = 0
    const Type= req.body.Type;
    const Likes = [];
    const Comments =[];
    var check = new Buffer.from(temp).toString('base64');
    const post= new Post({
       AuthorId : AuthorId,Name : Name,College : College, Date : Date, Content : Content,
       NoOfComments : NoOfComments,NoOfLikes : NoOfLikes,Type : Type,Likes : Likes,
       postImage: req.file.path
    });
    post.save().then(post =>{
       console.log('Posts',post);
      //  var check = new Buffer.from(post.ImageData.buffer);
       
       res.send(post);
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

 });

 exports.UnlikePost = ((req,res)=>{
   Post.findOneAndUpdate({ _id : ObjectId(req.body.Id)},{$inc : {"NoOfLikes" : -1}, $pull :{"Likes" : ObjectId(req.body.UserId)}},{new : true}).then(post =>{
      console.log(post.NoOfLikes);
      console.log(post.Likes);
      res.status(200).json(post);
   });
}) 

exports.PostComment = ((req,res) =>{
   var body = _.pick(req.body,["AuthorId","AuthorName","Text","TimeStamp"]);
   const comment = new Comment(body);
   Post.findOneAndUpdate({_id : ObjectId(req.body.Id)},{$inc : {"NoOfComments" : 1}, $push : {"Comments" : comment}},{new : true}).then(post =>{
      console.log(post);
      res.status(200).json(post);
   })
 })
