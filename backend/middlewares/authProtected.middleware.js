const jwt = require('jsonwebtoken');
const BlackListToken = require('../models/BlackListToken');
const Client = require('../models/Client');
const User = require('../models/User');

module.exports.authProtected = async(req, res, next) => {
    const token = req.cookies.clientToken || req.header("Authorization").split(' ')[1];
  
   
    if (!token) {
        return res.status(401).json({ message: 'UnAuthorized access' });
    }

    const isBlacklisted = await BlackListToken.findOne({ token: token });
    



    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Client.findById(decoded._id)
        req.user = user;
        // console.log(user)
        return next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
module.exports.authProtectedAdmin = async(req, res, next) => {
    const token = req.cookies.token || req.header("Authorization").split(' ')[1];
  
    // console.log(token)
   
    if (!token) {
        return res.status(401).json({ message: 'UnAuthorized access' });
    }

    // const isBlacklisted = await BlackListToken.findOne({ token: token });
    



    // if (isBlacklisted) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await User.findById(decoded._id)
        req.admin = admin;
        // console.log(user)
        return next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};


