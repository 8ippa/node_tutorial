const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const {logger, logEvents} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// 2) custom-middleware: putting it here will apply it for css/txt files as well
// the next() call is already present in the built-in mw but we need to call it manually

// app.use((req, res, next) => {
//     logEvents(
//         `${req.method}\t${req.headers.origin}\t${req.url}`,
//         'reqLog.txt'
//     );    
//     next();
// });

// cleaner implementation
app.use(logger);

// 3) third-party middleware
//! CORS = Cross-Origin Resource Sharing --> npm i cors
// app.use(cors()); // this is completely open --> anybody can use it

const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500' /*react local server*/, 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin /*during development*/){
            callback(null, true);
        }
        else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

/* 
1) built-in middleware: to handle urlencoded data
in other words, form data
'content-type: application/x-www-form-urlencoded'
*/
app.use(express.urlencoded({ extended : false }));
// gets applied to all routes (waterfall fashion: everything that comes after)

// built-in middlware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res) => {
    // res.send('Hello World');
    // res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html'); // 302 by default
});

// Route handlers --> similar to middleware
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
}, (req, res) => {
    // we can keep on chaining if we want
    res.send('Hello, World!');
});

// chaining route handlers

const one = (req, res, next) => {
    console.log('one');
    next();
};

const two = (req, res, next) => {
    console.log('two');
    next();
};

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
};

app.get('/chain(.html)?', [one, two, three]); // as long as [][i - 1] has next being called, [][i] will be called 

// not dependent on the order of its definition
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

// placed at last if some error occurs (not 404, error, which we threw in customCors)
// app.use((err, req, res, next) => {
//     console.log(err.stack);
//     res.status(500).send(err.message);
// });

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
