const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data; }
};

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd){
        return res.status(400).json({ 'message': 'Username and Password are required' });
    }
    // check if username exists
    const foundUser = usersDB.users.find(person => person.username === user);
    if(!foundUser){
        return res.sendStatus(401); // undefined
    }
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        ); // don't pass something sensitive like pwd
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '2m' }
        );
        // saving refreshToken with current user in DB
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        // refreshToken: send with cookie but as hhtpOnly --> not accessible to JS
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 2 * 60 * 1000
        });
        // accessToken: as json
        res.json({ accessToken });
    }
    else{
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };