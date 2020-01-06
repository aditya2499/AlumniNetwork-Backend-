const Post = require("../models/post");

exports.getPostByUser= ((req,res)=>{
  
    Post.find({'Name' : req.body.Name}).then(userPosts=>{
       console.log(userPosts);
    })
})

exports.getPostByCollege=((req,res) =>{
    Post.find({'College' : req.body.College}).then(collegePost =>{
       console.log(collegePost);
    })
})

exports.createPost=((req,res) =>{
    const Name= req.body.Name;
    const College = req.body.College;
    const Date = req.body.Date;
    const  Content = req.body.Content;
    const NoOfLikes = 0;
    const NoOfComments = 0
    const Type= req.body.Type;
    const post= new Post({
       Name : Name,College : College, Date : Date, Content : Content,NoOfComments : NoOfComments,NoOfLikes : NoOfLikes,Type : Type,
    })
    post.save().then(post =>{
       console.log(post);
    }).catch(err =>{
       console.log(err);
    })
})

