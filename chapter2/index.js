// documentation: https://nodejs.org/dist/latest-v18.x/docs/api/fs.html

const fs = require('fs');
const path = require('path');

// fs.readFile('./files/starter.txt', (err, data) => {
//     // this is a callback function!
//     if(err){
//         throw err;
//     }
//     // console.log(data); // --> gives buffer data
//     console.log(data.toString());
//     console.log(data)
// });

fs.readFile('./files/starter.txt', 'utf8', (err, data) => {
    // or we can add encoding for buffer
    if(err){
        throw err;
    }
    console.log(data);
});

// // deliberately throwing error
// fs.readFile('hello.txt', err => {throw err;});

console.log("hello..."); // readFile is asynchronous


// to avoid hassle of slashes in path
fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you', (err) => {
    if (err) throw err;
    console.log("Write complete");
    
    fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n\n\nYes it is!', (err) => {
        // appendfile creates a file if it doesnot exist
        if (err) throw err;
        console.log("Append complete");

        // more and more operations in callback to avoid issue of asynchronicity
        fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'newReply.txt'), (err) => {
            if (err) throw err;
            console.log("Rename complete");
        });
    });
});



// exit on uncaught errors
process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
});