const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/api/users-route');
const auth = require('./routes/api/auth-route');
const posts = require('./routes/api/posts-route');
const images = require('./routes/api/images-route');

//Connect Database
connectDB();

app.use(cors());

//Init Middleware
app.use(express.json({ extended: false }));

app.use(bodyParser.json());

// Serve static uploads
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/images', images);


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.setHeader('Content-Type', 'application/json');
    console.error(err.stack);
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message  || 'Internal Server Error'
        }
    });
});

const PORT = process.env.PORT || 5200;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

