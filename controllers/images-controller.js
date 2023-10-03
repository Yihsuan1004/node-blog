const HttpError = require('../models/http-error');
const config = require('config');

exports.uploadErrorHandler = (err, req, res, next) => {
    if (err.code === "LIMIT_FILE_TYPES") {
        res.status(422).json({ error: "Only Images are Allowed" });
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: `Size is too Large, Max size is ${config.get('fileMaxSize') / 1000000}MB` });
        return;
    }
    next(err);
};

exports.uploadImage =  (req, res,next) => {

    if (!req.file) {
        return next(new HttpError('No file uploaded', 400));
    }
    
    const imageUrl = `http://localhost:5200/uploads/${req.file.filename}`;
    
    res.json({ success: true, data: { url: imageUrl } }); 

};