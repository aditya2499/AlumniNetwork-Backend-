const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.js");


router.post("/register",userController.registerUser );

router.post('/validate_user',userController.validateUser);

router.post('/get_user_data',userController.getUserData);

router.get("/",userController.defaultpage );

module.exports=router;