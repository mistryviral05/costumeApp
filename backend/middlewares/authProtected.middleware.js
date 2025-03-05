const jwt = require('jsonwebtoken');
const BlackListToken = require('../models/BlackListToken');

const authProtected = async(req, res, next) => {
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
        return next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authProtected;