const mongoose=require('mongoose')
require('dotenv').config()

exports.connect=()=>{
    mongoose.connect(process.env.MOGODB_URL)
    .then(()=>console.log('DB Connected!'))
    .catch((err)=>{console.error(err);console.log('Failed to connect to DB!');process.exit(1)})
}

