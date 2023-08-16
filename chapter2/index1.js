// to avoid the "callback-hell"

const fsPromises = require('fs').promises;
const path = require('path');

const fileOps = async() => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8');
        console.log(data);
        // to delete a file
        await fsPromises.unlink(path.join(__dirname, 'files', 'starter.txt'));
        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data);
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNice to meet you!');
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'newPromiseWrite.txt'));
        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'newPromiseWrite.txt'), 'utf8');
        console.log(newData);
    } catch (err) {
        console.log(err);
    }
};

fileOps();