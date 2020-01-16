const express = require("express");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname);  
    }
})

const upload = multer({storage:storage,
  limits:{
      fileSize: 1024*1024*5
  }
});

const router = express.Router();

const postController = require("../controllers/post");

const emailController = require("../controllers/email");

router.post('/get_post_by_user',postController.getPostByUser);

router.post('/get_post_by_college',postController.getPostByCollege);

router.post('/create_post',upload.single('postImage'),postController.createPost);

router.post('/like_post',postController.LikesPost);

router.post('/unlike_post',postController.UnlikePost);

router.post('/post_comment',postController.PostComment);
// router.post('/login',postController.Login);
//router.post('/filter_post',postController.filterPost);

router.post("/send_email",emailController.sendEmail);
module.exports=router;
