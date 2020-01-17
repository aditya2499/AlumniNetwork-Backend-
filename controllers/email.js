const express = require("express");
const User = require('../models/user');
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const api = require("../playground/apikey");

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
     api_key: api.apiKey
   }
 }))
exports.sendEmail =((req,res)=>{
  console.log(req);
   var mailOptions = { from: 'greataditya24@gmail.com', to: 'adbansal99@gmail.com', subject: 'Account Verification Token', text: req.body.Text };
   transporter.sendMail(mailOptions, function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }
      res.status(200).send('A verification email has been sent to .');
    })
})