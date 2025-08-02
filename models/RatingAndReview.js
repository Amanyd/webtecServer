const mongoose=require('mongoose')
const { type } = require('os')

const ratingAndReviewSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        
    },
    
    rating:{
        type:Number,
        required:true,
        
    },
    review:{
        type:String,
        
    },
    videoUrl:{
        type:String,
        required:true,
        trim:true
    },
    
})

module.exports=mongoose.model('RatingAndReview',ratingAndReviewSchema);