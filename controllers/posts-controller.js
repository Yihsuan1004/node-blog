const HttpError = require('../models/http-error');
const Post = require('../models/Post');

const createPost =  async (req,res,next) =>{

    try {
        const { title, tags, content } = req.body;

        if (!title || title.trim() === "") {
            return next(new HttpError('Title is required', 400));
        }
        
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return next(new HttpError('Tags should be an array and cannot be empty', 400));
        }
        
        if (!content || content.trim() === "") {
            return next(new HttpError('Content is required', 400));
        }

        const post = new Post({
            title,
            tags,
            content,
        });
  
        await post.save();

        next(res.status(201).json(post));

    } catch (error) {
        console.log(req.body);
        next(new HttpError('Server error', 500));
    }
} 


const getPost =  async (req,res,next) =>{
    try {
        const post = await Post.findById(req.params.postId);
  
        if (!post) return next(new HttpError('Post not found', 404));
  
        res.json(post);
  
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
} 


const getAllPost =  async (req,res,next) =>{
    try {
        const posts = await Post.find();
  
        if (!posts) next(new HttpError('Post not found', 404));
  
        res.json(posts);
  
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
} 


const updatePost =  async (req,res,next) =>{
    try {
        let post = await Post.findById(req.params.postId);
        
        if (!post) return  next(new HttpError('Post not found', 404));
  
        const { title, content } = req.body;
  
        if (title) post.title = title;
        if (content) post.content = content;
  
        await post.save();

        res.json(post);
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
} 




const deletePost =  async (req,res,next) =>{
    try {
        const post = await Post.findById(req.params.postId);
  
        if (!post) return next(new HttpError('Post not found', 404));
  
        await post.deleteOne();
  
        res.json({ msg: 'Post removed' });
  
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
} 


exports.createPost = createPost;
exports.getPost = getPost;
exports.getAllPost = getAllPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
