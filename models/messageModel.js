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
 
MessageSchema
    .virtual('post_date_calendar')
    .get(function(){
        return this.post_date.toLocaleString('en-CA').slice(0,10)
})

MessageSchema
    .virtual('post_date_time')
    .get(function(){
        if(this.post_date.toLocaleString('en-CA').length == 25){
            const hour = this.post_date.toLocaleString('en-CA').slice(11, 17)
            const ampm = this.post_date.toLocaleString('en-CA').slice(20, 24)
            return hour + " " + ampm
        }
        const hour = this.post_date.toLocaleString('en-CA').slice(11, 16)
        const ampm = this.post_date.toLocaleString('en-CA').slice(19, 24)
        return hour + " " + ampm
})

module.exports = mongoose.model('Message', MessageSchema)
