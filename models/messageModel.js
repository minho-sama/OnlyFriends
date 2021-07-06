const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required:true},
    title: {type:String, required:true},
    message: {type:String, required:true},
    post_date: {type:Date, default:Date.now}
})

MessageSchema
    .virtual('post_date_formatted')
    .get(function(){
        return this.post_date.toLocaleString('en-CA')
    })

module.exports = mongoose.model('Message', MessageSchema)
