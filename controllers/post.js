const Post = require("../models/post");
const mongoose = require('mongoose');
const fs = require('fs');
//const path = require('path');
//const Query = require("../models/query");
const User = require('../models/user');
// const Comments = require('../models/comment');
const _ = require('lodash');
const path = require('path');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;
const {fileURLToPath }=require("url");
const {dirname} = require("path");
const ObjectId = mongoose.Types.ObjectId;
const Comment = require("../models/comment");
const rotate = require('image-rotate');

exports.getAllPost = ((req,res) =>{
   Post.findOne().then(userPosts=>{

      const Data = _.pick(userPosts,['ImageData','Likes','NoOfLikes','NoOfComments']);
      console.log(Data); 

       res.send(Data);
    });
});

exports.getPostByUser= ((req,res)=>{
    console.log(req.body);
    Post.findOne({AuthorId : req.body.Id}).then(userPosts=>{

      const Data = _.pick(userPosts,['Likes','NoOfLikes','NoOfComments']);
      // Data.ImageData = userPosts.ImageData.toString();
      // console.log(userPosts.ImageData.toString());
      // console.log(Data);

      if(!userPosts)
      return res.status(400).send('No Posts Found');

       res.send(Data);
       res.end();
    })
})

exports.filterPost=((req,res) =>{
   let query ={} ;
   const post =[];
   if(req.body.Branch)
   query.Branch=req.body.Branch;

   if(req.body.Year)
   query.Year= req.body.Year;

   if(req.body.College)
   query.College = req.body.College;
   console.log(query);
   User.find(query).then(users =>{
      //console.log(users);
       users.forEach(user =>{
          console.log(user._id);
          Post.find({ AuthorId : ObjectId(user._id)}).then(posts =>{
            console.log(posts); 
            post.push(posts);
          })
       })
       res.status(200).json(post);
   }).catch(err =>{
      res.status(400);
   })
}) 

exports.getPostByCollege=((req,res) =>{
   console.log('body',req.body);
    Post.find({'College' : req.body.College}).then(collegePost =>{
        console.log('No of posts',collegePost.length);
        collegePost.reverse();
        res.send(collegePost);
      });
});

exports.createPost=((req,res) =>{
   console.log('In');
   console.log('file',req.file);
   console.log('body',req.body);
   // rotate(path.join(__dirname,'../' + req.file.path),path.join(__dirname,'../' + req.file.path),Math.PI/4);

   // fs.unlink(path.join(__dirname,'../' + req.file.path),(err) => {
   //    if(err){
   //       console.log(err);
   //    }
   //    console.log('Deleted');
   // });

    const AuthorId = ObjectId (req.body.Id);
    const Name= req.body.Name;
    const College = req.body.College;
    const Date = req.body.Date;
    const Content = req.body.Content;
    const NoOfLikes = 0;
    const NoOfComments = 0
    const Type= req.body.Type;
    const Likes = [];
    const Comments =[];
    const post= new Post({
       AuthorId : AuthorId,Name : Name,College : College, Date : Date, Content : Content,
       NoOfComments : NoOfComments,NoOfLikes : NoOfLikes,Type : Type,Likes : Likes,
       postImage: req.file.path
    });
    console.log('Bhargab');
    post.save().then(post1 =>{
       console.log('Post',post1);
       res.send(post1);
       console.log('Posted successfully');
    }).catch(err =>{
       console.log(err);
       res.status(500).send(err);
    })
})

exports.LikesPost=((req,res) =>{
   Post.findOneAndUpdate({ _id :ObjectId(req.body.Id) },{ $inc : {"NoOfLikes" : 1}, $push : {"Likes" : ObjectId(req.body.UserId) } },{new : true}).then(post =>{
      
      console.log('Checking likes??');

      res.status(200).json(post);
   })

 });

 exports.UnlikePost = ((req,res)=>{
   Post.findOneAndUpdate({ _id : ObjectId(req.body.Id)},{$inc : {"NoOfLikes" : -1}, $pull :{"Likes" : ObjectId(req.body.UserId)}},{new : true}).then(post =>{
      
      console.log('Why Unllike ??');
      
      res.status(200).json(post);
   });
});

exports.PostComment = ((req,res) =>{
   var body = _.pick(req.body,["AuthorId","AuthorName","Text","TimeStamp"]);
   const comment = new Comment(body);
   Post.findOneAndUpdate({_id : ObjectId(req.body.Id)},{$inc : {"NoOfComments" : 1}, $push : {"Comments" : comment}},{new : true}).then(post =>{
      console.log(post);
      res.status(200).json(post);
   });
 });