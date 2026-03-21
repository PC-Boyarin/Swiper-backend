const express = require("express");
const router = express.Router();

const { createChannel, getAllChannels, getCurrentChannel } = require('../controllers/client/channels');

router.post('/getAllChannels', getAllChannels);
router.post('/createChannel', createChannel);
router.post('/currentChannel', getCurrentChannel);

module.exports = router;
