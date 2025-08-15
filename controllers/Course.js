const Course = require('../models/Course');
const Tag = require('../models/Tag');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

exports.createCourse= async (req,res) => {
    try{
        const {courseName, courseDescription, whatYouWillLearn, price, tags} = req.body
        const thumbnail= req.files.thumbnailImage;
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tags || !thumbnail){
            return res.status(400).json({success:false, message:'All fields are required'})
        }
        const userId = req.user._id;
        const instructorsDetails = await User.findById(userId);
        console.log('Instructor Details:', instructorsDetails);
        if(!instructorsDetails){
            return res.status(404).json({success:false, message:'Instructor not found'})
        }
        const tagDetails= await Tag.findById(tag)
        if(!tagDetails){
            return res.status(404).json({success:false, message:'Tag not found'})
        }
        const thumbnailImage= await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)
        const newCourse= await Course.create({
            courseName, 
            courseDescription, 
            instructor:instructorDetails._id, 
            whatYouWillLearn, 
            price, 
            tag:tagDetails._id, 
            thumbnail:thumbnailImage.secure_url,
        })

        await User.findByIdAndUpdate
        (
            {_id: instructorDetails._id},
            {$push:{courses: newCourse._id}},
            {new:true}
        )
        return res.status(201).json({success:true, message:'Course created successfully', data:newCourse})

    }catch(err){console.error(err); return res.status(500).json({success:false, message:'Course cannot be created at the moment.'})}
}

exports.getAllCourses= async (req, res)=>{
    try{
        const allCourses = await Course.find({},{courseName:true, price:true, thumbnail:true, instructor:true, ratingAndReviews:true, studentsEnrolled:true}).populate('instructor').exec();
        return res.status(200).json({success:true, message:'Courses fetched succesfully'})
    }catch(err){console.log(err); return res.status(500).json({success:true, message:'Cannot fetch course data'})}
}