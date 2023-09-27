const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role:{
        type: String,
        enum: ['admin','user'],
        default: 'user'
    },
    bio: {
        type: String,
        default: ''  
    },
    profileImage: {
        type: String,
        default: ''  
    }
});


module.exports = User = mongoose.model('user',UserSchema);