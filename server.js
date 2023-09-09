const express = require('express');
const connectDB = require('./config/db');

const app = express();

const users = require('./routes/api/users-route');
const auth = require('./routes/api/auth-route');
const posts = require('./routes/api/posts-route');
const images = require('./routes/api/images-route');
const HttpError = require('./models/http-error');

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false}));

app.use((err, req, res, next) => {
    console.error(err.stack);

     // Check if error is an instance of HttpError
     if (err instanceof HttpError) {
        return res.status(err.code).json(err.toJSON());
    }

    // Handle other generic errors
    res.status(500).json({
        error: {
            message: err.message || 'Internal Server Error'
        }
    });

});

// Serve static uploads
app.use('/uploads', express.static('uploads'));

app.get('/', (req,res)=> res.send('API Running'));

//Define Routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/images', images);

app.use((req,res,next)=>{
    throw new HttpError('Could not find this route.',404);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));

