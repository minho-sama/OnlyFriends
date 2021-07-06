const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required:true},
    title: {type:String, required:true},
    message: {type:String, required:true},
    post_date: {type:Date, default:Date.now}
})