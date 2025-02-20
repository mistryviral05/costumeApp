const jwt = require('jsonwebtoken');

const authProtected = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'UnAuthorized access' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authProtected;