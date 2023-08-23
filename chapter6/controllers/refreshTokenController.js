const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    console.log('here');
    const cookies = req.headers.cookie;
    if (!cookies?.split('=')[1]) { // optional chaining operator
        return res.sendStatus(401);
    }
    const refreshToken = cookies.split('=')[1];
    console.log("==>", refreshToken);
    // check if user with such refreshToken exists
    // const foundUser = await User.findOne({refreshToken: refreshToken}).exec();
    const foundUser = await User.findOne({refreshToken }).exec(); // because key and value names are same
    if (!foundUser) {
        return res.sendStatus(403); // forbidden
    }
    // evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(403); // forbidden
            }
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken });
        }
    );

};

module.exports = { handleRefreshToken };