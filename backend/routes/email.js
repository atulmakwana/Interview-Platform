const express = require('express');
const Interviewer=require('../models/Interviwer')
const Email=require("../models/Email")
var fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const sendEmail=require("../services/sendMailByClient")
router.post("/send",fetchuser,async(req,res)=>{
    try {

        const User=await Interviewer.findOne({email:req.body.to});
        console.log("USER:: ",User);
        console.log(req.body);
        if (!User) {
            const err = new Error("Invalid email: User Not Exist");
            err.statusCode = 404; // custom status
            throw err;
        }

        const newEmail=new Email({
            user:User._id,
            sender:req.body.from,
            recipient:req.body.to,
            body:req.body.message,
            subject:req.body.subject,
            displayName:req.body.displayName,
            createdAt:Date.now()
        })
        console.log("\n\n============\n",req.body.message,"\n=============")
         const result=await  newEmail.save()  
         await sendEmail({from:req.body.from,to:req.body.to,displayName:req.body.displayName,Subject:req.body.subject,Message:req.body.message})
        res.status(201).json({"success":"succefully send"});
    } catch (error) {
        console.log(error);
        res.status(400).json({"error":"Error in sending Email"})
    }
      
})


module.exports=router