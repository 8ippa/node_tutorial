const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data; }
};

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    console.log('here');
    const cookies = req.headers.cookie;
    if(!cookies?.split('=')[1]){ // optional chaining operator
        return res.sendStatus(401);
    }
    const refreshToken = cookies.split('=')[1];
    console.log("==>", refreshToken);
    // check if user with such refreshToken exists
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser){
        return res.sendStatus(403); // forbidden
    }
    // evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username){
                return res.sendStatus(403); // forbidden
            }
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken });
        }
    );
    
};

module.exports = { handleRefreshToken };