const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data; }
};

const fsPromies = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client, also delete the access token
    const cookies = req.headers.cookie;
    if(!cookies?.split('=')[1]){
        return res.sendStatus(204); // we were going to delete anyway
    }
    const refreshToken = cookies.split('=')[1];
    // check if user with such refreshToken exists
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
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
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''}
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromies.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    }); // max-age not required while deleting
    res.sendStatus(204);
};

module.exports = { handleLogout };