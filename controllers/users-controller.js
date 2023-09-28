const HttpError = require('../models/http-error');
const User = require('../models/User'); 
const Post = require('../models/Post'); 

// 1. GET /api/users/:userId/profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError('User not found', 404)); 
        }

        // 取得使用者資料，但不返回密碼
        const userProfile = {
            fullName: user.fullName,
            email: user.email,
            joinDate: user.joinDate,
            bio: user.bio,
            profileImage: user.profileImage
        };

        res.json(userProfile);
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
};

// 2. PUT /api/users/:userId/profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { fullName, password, bio, profileImage } = req.body;
        const updatedData = {
            ...(fullName && { fullName }),
            ...(password && { password }),
            ...(bio && { bio }),
            ...(profileImage && { profileImage })
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return next(new HttpError('User not found', 404)); 
        }

        const updatedProfile = {
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            joinDate: updatedUser.joinDate,
            bio: updatedUser.bio,
            profileImage: updatedUser.profileImage
        };

        res.json(updatedProfile);
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
};

// 3. GET /api/users/:userId/posts
exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return next(new HttpError('User not found', 404)); 
        }

        const posts = await Post.find({ authorId: userId });

        res.json(posts);

    } catch (err) {
        next(new HttpError('Server error', 500));
    }
};