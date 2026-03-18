const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    checkAuthenticated,
} = require('../controllers/client/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/checkAuthenticated', checkAuthenticated);

module.exports = router;
