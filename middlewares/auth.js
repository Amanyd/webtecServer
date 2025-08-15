const jwt = requuire('jsonwebtoken')
require('dotenv').config()
const User = require('../models/User')

exports.auth= async (req, res, next)=>{
    try{
        const token = req.cookies.token || req.body.token || req.header('Authorisation').replace('Bearer', '')
        if (!token){
            return res. status(401).json({
                success:false, message:'Token is missing'
            })
        }
        try{
            const decode=jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode)
            req.user= decode;
        }catch(err){return res.status(402).json({success:false, message:'Invalid token'})}
    }catch(err){return res.status(401).json({success:false,message:'Cannot verify token'})}
}


exports.isStudent = async (req, res, next)=> {
    try{
        if(req.user.accountType !== 'Student'){
            return res.status(401).json({success:false, message:'Protected route for students'})
        }
        next();
    }catch(err){return res.status(500).json({success:false, message:'Role cannot be verified'})}
}


exports.isInstructor = async (req, res, next)=> {
    try{
        if(req.user.accountType !== 'Instructor'){
            return res.status(401).json({success:false, message:'Protected route for instructors'})
        }
        next();
    }catch(err){return res.status(500).json({success:false, message:'Role cannot be verified'})}
}


exports.isAdmin = async (req, res, next)=> {
    try{
        if(req.user.accountType !== 'Admin'){
            return res.status(401).json({success:false, message:'Protected route for the admin'})
        }
        next();
    }catch(err){return res.status(500).json({success:false, message:'Role cannot be verified'})}
}