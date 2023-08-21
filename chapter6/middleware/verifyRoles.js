const verifyRoles = (...allowedRoles) => {
    // *Imp: calling functions with any number of params
    //* to return a function
    return (req, res, next) => {
        if (!req?.roles) {
            return res.sendStatus(401);
        }
        const rolesArray = [...allowedRoles];
        console.log(rolesArray); // roles which can access this route
        console.log(req.roles); // roles which the current user has
        const result = req.roles
        .map(role => rolesArray.includes(role))
        .find(val => val === true);
        if(!result){
            return res.sendStatus(401);
        }
        next();
    };
};

module.exports = verifyRoles;