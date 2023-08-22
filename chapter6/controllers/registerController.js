const User = require('../model/User');

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd){
        return res.status(400).json({ 'message': 'Username and Password are required' });
    }
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({username: user}).exec(); // .exec() when A-A and there is no callback
    if(duplicate){
        return res.status(409); // Conflict
    }
    try{
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10); // 10 salt rounds
        // create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });
        /* 
            const newUser = new User();
            newUser.username = user;
            newUser.password = hashedPwd;
            const result = await newUser.save();
        */
        console.log("regisered: ", result);
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