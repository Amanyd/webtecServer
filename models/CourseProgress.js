const mongoose=require('mongoose')
const { type } = require('os')

const courseProgressSchema=new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        
    },
    completedVideoa:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubSection'
        
    },
    
    
})

module.exports=mongoose.model('CourseProgress',courseProgressSchema);