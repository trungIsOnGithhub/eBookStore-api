// Node Modules
require('dotenv').config();
const jwt = require('jsonwebtoken');

// File Modules
// const User = require(../models/UserSchema.js);

const verifyToken = async (req, res, next) => {
    let token = null;

    if ( req.header('Authorization') &&
         req.header('Authorization').startsWith('Bearer') ) {

            token = req.header('Authorization').split(' ')[1];

            if (!token) {
                res.status(401);
                return next(new Error('You are not authenticated'));
            }

            jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
                if (err) {
                    res.status(403);
                    next(err);

                    return;
                }

                req.user = await User.findById(decoded.userId).select('-password');

                next();
            });
    }

    if (!token) {
        res.status(401);
        return next( new Error('Not authenticated') );
    }
};

const isAdmin = (req, res, next) => {
    const user = req.user;
    if (user.role != 'admin') {
        res.status(403);

        return next( new Error('No granted permissions for this action') );
    }
    next();
};

module.exports = {
    isAdmin,
    verifyToken
};