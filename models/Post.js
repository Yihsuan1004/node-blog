const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  tags: {
    type: Array,
    required: true
  },
  content: { 
    type: String, 
    required: true 
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  authorId:{
    type: String, 
    required: true 
  }
});

module.exports = Post = mongoose.model('Post', PostSchema);
