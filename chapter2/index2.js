const fs = require('fs');

// Good idea to deal with files with a lot of data
const rs = fs.createReadStream('./files/lorem.txt', {encoding: 'utf8'});
const ws = fs.createWriteStream('./files/newLorem.txt')

// // listening for the incoming data from readStream
// rs.on('data', (dataChunk) => {
//     ws.write(dataChunk);
// });

// an even more efficient method
rs.pipe(ws);