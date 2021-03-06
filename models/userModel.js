const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type:String, required:true},
    password: {type:String, required:true},
    member: {type:Boolean, default:false},
    admin: {type:Boolean, default:false},
    avatar: {
        type:String,
        required:true,
        enum: ['spy', 'alien', 'robot'],
        default: 'spy'
    },
    join_date:{type:Date, default: Date.now}
})

UserSchema
    .virtual('join_date_formatted')
    .get(function(){
        return this.join_date.toLocaleDateString('en-CA')
    })

module.exports = mongoose.model('User', UserSchema)