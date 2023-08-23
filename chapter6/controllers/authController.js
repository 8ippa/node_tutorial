const User = require('../model/User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and Password are required' });
    }
    // check if username exists
    const foundUser = await User.findOne({ username: user });
    if (!foundUser) {
        return res.sendStatus(401); // undefined
    }
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        ); // don't pass something sensitive like pwd
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '2m' }
        );
        // saving refreshToken with current user in DB
        foundUser.refreshToken = refreshToken;
        // foundUser.save()
        // .then(updatedUser => console.log(updatedUser))
        // .catch(err => console.log(err));
        const result = await foundUser.save();
        console.log(result);

        // refreshToken: send with cookie but as hhtpOnly --> not accessible to JS
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            // secure: true,
            maxAge: 2 * 60 * 1000
        });
        // accessToken: as json
        res.json({ accessToken });
    }
    else {
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };