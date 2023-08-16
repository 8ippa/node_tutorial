console.log("Hello world!");
// console.log(global);

const os = require('os');
console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log(__dirname);
console.log(__filename);

const path = require('path');
console.log(path.dirname(__filename));
console.log(path.basename(__filename));
console.log(path.extname(__filename));

console.log(path.parse(__filename));


const math = require('./math'); // not common core module --> path required
const { subtract, multiply, divide } = require('./math');
console.log(math.add(2, 3));
console.log(subtract(2, 3));
console.log(multiply(2, 3));
console.log(divide(2, 3));

