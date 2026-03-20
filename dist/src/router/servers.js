"use strict";
const express = require('express');
const router = express.Router();
const { getAllServers, createServer } = require('../controllers/client/servers');
router.post('/createServer', createServer);
router.post('/getAllServers', getAllServers);
module.exports = router;
