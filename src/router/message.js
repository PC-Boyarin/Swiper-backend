const express = require('express');
const router = express.Router();
const {
    getAllMessages,
    updateMessage,
    // deleteMessage,
} = require('../controllers/client/message');
const verifyToken = require('../utils/verifyToken').default;

if(verifyToken) {
    router.post('/', verifyToken, getAllMessages);
    router.put('/:id', verifyToken, updateMessage);
// router.delete('/:id', verifyToken, deleteMessage);
}

module.exports = router;
