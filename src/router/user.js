const express = require('express');
const router = express.Router();
const {getUser, updateUser, searchUser} = require('../controllers/client/user')
const verifyToken = require('../utils/verifyToken');

if(verifyToken) {
  router.post('/currentUser', verifyToken, getUser);
  router.put('/update', verifyToken, updateUser);
  router.post('/search', verifyToken, searchUser)
}

// router.get('/rooms', verifyToken, getJoinedRooms);
// router.post('/rooms/:id/remove', verifyToken, removeRoom);

module.exports = router;
