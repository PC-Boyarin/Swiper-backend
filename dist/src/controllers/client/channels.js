"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChannels = void 0;
const pool_1 = __importDefault(require("../../db/pool"));
const createChannel = async (req, res) => {
    const { server_id, name, type, created_by, is_private } = req.body;
    try {
        await pool_1.default.query('BEGIN');
        await pool_1.default.query('LOCK TABLE channels IN EXCLUSIVE MODE');
        console.log('newChannel0');
        const positionResult = await pool_1.default.query('SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM channels WHERE server_id = $1', [server_id]);
        console.log('newChannel1', positionResult);
        const nextPosition = positionResult.rows[0].next_position;
        console.log('newChannel2', nextPosition);
        const newChannel = await pool_1.default.query('INSERT INTO channels (server_id, name, type, created_by, is_private, position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [server_id, name, type, created_by, is_private, nextPosition]);
        await pool_1.default.query('COMMIT');
        console.log('newChannel3', newChannel);
        res.status(201).json(newChannel.rows[0]);
    }
    catch (err) {
        await pool_1.default.query('ROLLBACK');
        console.error('Error creating channel:', err);
        res.status(500).json({ message: err.message });
    }
};
const getCurrentChannels = async (req, res) => {
    const { channel_id } = req.body;
    if (!channel_id) {
        return res.status(400).json({ message: 'Channel Required' });
    }
    try {
        const channel = await pool_1.default.query('SELECT * FROM channels WHERE channel_id = $1', [channel_id]);
        return res.status(200).json(channel.rows);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getAllChannels = async (req, res) => {
    const { server_id } = req.body;
    if (!server_id) {
        return res.status(400).json({ message: 'Channel Required' });
    }
    try {
        const channels = await pool_1.default.query('SELECT * FROM channels WHERE server_id = $1 ORDER BY channels.created_at', [server_id]);
        return res.status(200).json(channels.rows);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllChannels = getAllChannels;
module.exports = {
    getCurrentChannels,
    getAllChannels: exports.getAllChannels,
    createChannel
};
