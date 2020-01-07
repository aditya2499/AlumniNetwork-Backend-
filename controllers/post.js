const Post = require("../models/post");

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
    const AuthorId = req.body.Id;
    const Name= req.body.Name;
    const College = req.body.College;
    const Date = req.body.Date;
    const  Content = req.body.Content;
    const NoOfLikes = 0;
    const NoOfComments = 0
    const Type= req.body.Type;
    const post= new Post({
       AuthorId : AuthorId,Name : Name,College : College, Date : Date, Content : Content,NoOfComments : NoOfComments,NoOfLikes : NoOfLikes,Type : Type,
    })
    post.save().then(post =>{
       console.log(post);
       res.status(200);
    }).catch(err =>{
       console.log(err);
       res.status(500);
    })
})

// exports.LikesAndUnlikePost=((req,res) =>{
//    // Post.findOneAndUpdate({ _id :ObjectId(req.body.Id) },{ $inc : {"NoOfLikes" : 1}, $push : {"Likes" : ObjectId(req.body.UserId) } },{new : true}).then(post =>{
//    //    console.log(post.NoOfLikes);
//    //    res.status(200).json(post);
//    // })

//    Post.findOne({_id : ObjectId(req.body.Id)}).then(post =>{
//        if(post.Likes.filter(like => like.toString() === req.body.userId).length > 0){
//           res.
//        }
//    })
// })

//exports