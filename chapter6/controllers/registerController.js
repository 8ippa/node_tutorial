const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data; }
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd){
        return res.status(400).json({ 'message': 'Username and Password are required' });
    }
    // check for duplicate usernames in the db
    const duplicate = userDB.users.find(person => person.username === user);
    if(duplicate){
        return res.status(409); // Conflict
    }
    try{
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10); // 10 salt rounds
        // store the new user
        const newUser = {
            'username': user,
            'password': hashedPwd
        };
        userDB.setUsers([...userDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        );
        console.log(userDB.users);
        res.status(201).json({
            'success': `New user ${user} created!`
        });
    }
    catch(err){
        res.status(500) // Server Error
        .json({ 'message': err.message });
    }
};

module.exports = { handleNewUser };