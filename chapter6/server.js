require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const path = require('path');
const {logger, logEvents} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;

// Connect to mongoDB
connectDB();

app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement (FE -> BE)
app.use(credentials);

// Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// handle urlencoded data (form data) 
app.use(express.urlencoded({ extended : false }));

// built-in middlware for json
app.use(express.json());

// middleware for cookies
app.unsubscribe(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT); // will only apply to routes that follow
// protected api routes
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if(req.accepts('json')){
        res.json({error: '404 Not Found'});
    }
    else{
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

// We don't want server to listen if DB connection is not achieved
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
