const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On client, also delete the access token
    const cookies = req.headers.cookie;
    if(!cookies?.split('=')[1]){
        return res.sendStatus(204); // we were going to delete anyway
    }
    const refreshToken = cookies.split('=')[1];
    // check if user with such refreshToken exists
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser){
        // but the cookie exists, so 
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });
        return res.sendStatus(204); // successful but no content
    }
    // Delete the refreshToken in DB
    foundUser.refreshToken = '';
    const result = foundUser.save();
    console.log(result);

    // foundUser.refreshToken = '';
    // foundUser.save()
    // .then(updatedUser => console.log(updatedUser))
    // .catch(err => console.log(err));

    // await User.findOneAndUpdate(
    //     { refreshToken },
    //     { refreshToken: '' },
    //     { new: true }
    // )
    // .then(updatedUser => {
    //     console.log(updatedUser);
    // })
    // .catch(err => console.log(err));

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    }); // max-age not required while deleting
    res.sendStatus(204);
};

module.exports = { handleLogout };