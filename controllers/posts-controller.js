const HttpError = require('../models/http-error');
const Post = require('../models/Post');

exports.createPost =  async (req,res,next) =>{

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


exports.getPost =  async (req,res,next) =>{
    try {
        const post = await Post.findById(req.params.postId);
  
        if (!post) return next(new HttpError('Post not found', 404));
  
        res.json(post);
  
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
} 


exports.getAllPost =  async (req,res,next) =>{
    try {
        const { tag, title } = req.query;

        let queryObj = {};

        if (tag) {
            queryObj.tags = new RegExp(tag, 'i');
        }

        if (title) {
            queryObj.title = new RegExp(title, 'i'); // 使用正規表達式進行模糊搜尋
        }

        const posts = await Post.find(queryObj);
        
        res.json(posts);

    } catch (err) {
        next(new HttpError('Server error', 500));
    }
} 

exports.updatePost =  async (req,res,next) =>{
    try {
        let post = await Post.findById(req.params.postId);
        
        if (!post) return  next(new HttpError('Post not found', 404));
  
        const { title, content, tags } = req.body;
  
        if (title) post.title = title;
        if (content) post.content = content;
        if (tags) post.tags = tags;

        await post.save();

        res.json(post);
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
} 




exports.deletePost =  async (req,res,next) =>{
    try {
        const post = await Post.findById(req.params.postId);
  
        if (!post) return next(new HttpError('Post not found', 404));
  
        await post.deleteOne();
  
        res.json({ msg: 'Post removed' });
  
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
} 


exports.getPostsByTag =  async (req, res) => {
    try {
        // 找出所有的標籤
        const distinctTags = await Post.distinct('tags');

        // 對於每個標籤，找出含有該標籤的文章
        const results = [];

        for (let tag of distinctTags) {
            const postsWithTag = await Post.find({ tags: tag }).sort({ createdDate: -1 }).select('title content tags createdDate');
            results.push({
                tag,
                posts: postsWithTag
            });
        }

        res.json(results);

    } catch (err) {
        next(new HttpError('Server error', 500));
    }
}
