const Tag = require('../models/Tag')

exports.createTag = async (req, res) => {
    try{
        const {name, description}= req.body
        if(!name || !description){
            return res.status(400).json({success:false, message:'All fields are required'})
        }
        const tagDetails = await Tag.create({name:name, description:description})
        console.log(tagDetails);
        return res.status(201).json({success:true, message:'Tag created successfully', tag:tagDetails})
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false, message:'Tag cannot be created, please try again later'})
    }
}

exports.getAllTags = async (req, res) => {
    try{
        const allTags= await Tag.find({},{name:true, description:true});
        res.status(200).json({success:true, message:'Tags fetched successfully', allTags})
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false, message:'Tags cannot be fetched, please try again later'})
    }
}