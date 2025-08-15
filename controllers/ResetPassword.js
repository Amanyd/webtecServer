const User = require('../models/User')
const mailSender = require= require('../utils/mailSender')
const bcrypt = require('bcrypt')


exports.resetPasswordToken = async (req, res) => {
    try{
        const email = req.body.email;
        const user= await User.findOne({email:email})
        if (!user){
            return res.status(404).json({success:false, message:"Email is not registered with us"})
        }
        const token = crypto.randomUUID();
        const updatedDetails= await User.findOneAndUpdate({email:email}, {token:token, resetExpires: Date.now()+ 5*60*1000}, {new:true})
        const url = `http://localhost:3000/update-password/${token}`

        await mailSender(email, "Password reset link", `Passwor reset link:${url}` )

        return res.status(200).json({success:true, message:'Email sent succesfully, please check email and reset your password'})
    }catch(err){console.log(err); return res.status(400).json({success:false, message:"Cannot reset password"})}
}

exports.resetPassword =async (req, res) => {
    try{
        const {password, confirmPassword, token} = req.body;
        if(password !== confirmPassword){
            return res.status(401).json({success:false, message:'Passwords do not match'})
        }
        const userDetails = await  User.findOne({token:token})
        if (!userDetails){
            return res.status(400).json({
                success:false,
                message:'Token cannot be verified'
            })
        }
        if(userDetails.resetExpires<Date.now){
            return res.status(400).json({
                success:false, message:'Token is expired, please try again'
            })
        }
        const hashedPassword= await bcrypt.hash(password, 10)
        await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true})
        return res.status(200).json({success:true, message:'Password reset successfully, please login now'})

    }catch(err){
        console.log(err);
        return res.status(500).json({success:false, message:'Password cannot be reset, please try again later'})
    }
}