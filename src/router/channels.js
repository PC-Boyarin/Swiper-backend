const express = require("express");
const router = express.Router();

const { createChannel, getAllChannels, getCurrentChannels } = require('../controllers/client/channels');

router.post('/getAllChannels', getAllChannels);
router.post('/createChannel', createChannel);
router.get('/channels/:channel_id', getCurrentChannels);

module.exports = router;
