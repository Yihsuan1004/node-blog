const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
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
    data: {
        type: Date,
        default: Date.now
    },
    role:{
        type: String,
        enum: ['admin','user','guest'],
        default: 'admin'
    }
});


module.exports = User = mongoose.model('user',UserSchema);