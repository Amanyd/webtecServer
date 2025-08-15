const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator= require = require(otp-generator)
const bcrypt= require ('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()



exports.sendOTP= async (res,req) =>{
    const {email}= req.body;
    const checkUserPresent = await User.findOne({email});

    try{
        if(checkUserPresent){
            return res.status(401).json({
                success:false, message: 'User already registered'
            })
        }

        var otp= otpGenerator.generate(6,{
            upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false
        })
        console.log('OTP generated', otp)
        let result= await OTP.findOne({otp:otp})

        while(result){
            otp= otpGenerator.generate(6,{
                upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false
            })
            result= await OTP.findOne({otp:otp})
        }
        const otpPayload= {email,otp}
        const otpBody= await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        })
    }catch(err){console.log(err); return res.status(500).json({success:false, message:err.message, })}

}


exports.signUp = async (res, req) =>{
    try{
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp}= req.body;
        if (!firstName || !lastName || !email || !password || ! confirmPassword || !otp){
        return res.status(403).json({success:false, message: "All fields are necessary"}) 
        }
        if(password!=confirmPassword){
            return res.status(400).json({
                success:false, message:'Passwords do not match'
            })
        }
        const existingUser= await User.findOne({email});
        if (existingUser){
            return res.status(400).json({success:false, message:'User is already registered'})
        }
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp)

        if(recentOtp.length==0){
            return res.status(400).json({success:false, message:"Cant generate otp"})
        }else if(otp!== recentOtp.otp){return res.status(400).json({success:false, message:'Invalid otp'})}

        const hashedPassword= await bcrypt.hash(password, 10);
        const profileDetails= await Profiler.create({gender:null, dateOfBirth:null, about:null, contactNumber:null })
        const user = await User.create({firstName, lastName, email, contactNumber, password:hashedPassword, accountType, additionalDetails:profileDetails._id, image:`https://api.dicebear.com/9.x/thumbs/svg?seed=${firstName}`})

        return res.status(200).json({
            success:true, message:'User registered succesfully', user,
        })
    }catch(err){console.log('err'); return res.status(500).json({
        success:false, message:'User cannot be registered, please try again later'
    })}

}


exports.login= async (res, req) => {
        try{
            const {email, password}=req.body;
            if (!email || !password){
                return res.status(400).json({success:false, message:'All fields are required, please try again later'})
            }
            const user = await User.findOne({email}).populate('additionalDetails')
            if(!user){return res.status(401).json({success:false, message:'User not registered, please singnup first'})}
            if(await bcrypt.compare(password, user.password)){
                const payload={email: user.email, id:user._id, accountType:user.accountType}
                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'2h'})
                user.token= token;
                user.password= undefined
                options ={
                    expires: new Date(Date.now()+3*24*60*60*1000)
                }
                res.cookie('Token', token, options).status(200).json({
                    success:true, token, user, message:'Logged in succesfully'
                })

            }
            else{
                return res.status(401).json({success:false, message:'Invalid credentials, please try again'})
            }
        }catch(err){console.log(err); return res.status(500).json({success:false, message:'Internal server error, please try again later'})}
}


exports.changePassword= async (res, req) => {
    try{
        const {oldPassword, newPassword, confirmNewPassword}= req.body;
        if (!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({success:false, message:'All fields are required'})
        }
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({success:false, message:'Passwords do not match'})
        }
        
    }catch(err){}
}