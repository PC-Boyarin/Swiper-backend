"use strict";
const jwt = require('jsonwebtoken');
const verifyToken = async (req, res, next) => {
    try {
        const token = req?.cookies?.refreshToken;
        if (!token) {
            return res.status(403).json({ message: 'Токен не предоставлен' });
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Токен истек' });
                }
                return res.status(401).json({ message: 'Недействительный токен' });
            }
            req.user = decoded;
            next();
        });
    }
    catch (err) {
        return res.status(401).json({ message: err.message });
    }
};
module.exports = verifyToken;
