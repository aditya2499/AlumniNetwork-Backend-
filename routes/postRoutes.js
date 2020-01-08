const express = require("express");

const router = express.Router();

const postController = require("../controllers/post");

router.post('/get_post_by_user',postController.getPostByUser);

router.post('/get_post_by_college',postController.getPostByCollege);

router.post('/create_post',postController.createPost);

router.post('/like_post',postController.LikesPost);

module.exports=router;
