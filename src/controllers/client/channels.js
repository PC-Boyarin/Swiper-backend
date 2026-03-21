import pool from "../../db/pool";

const createChannel = async (req, res) => {
    const { server_id, name, type, created_by, is_private } = req.body;

    try {
        await pool.query('BEGIN');

        await pool.query('LOCK TABLE channels IN EXCLUSIVE MODE')
        console.log('newChannel0');
        const positionResult = await pool.query(
            'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM channels WHERE server_id = $1',
            [server_id]
        );
        console.log('newChannel1', positionResult);
        const nextPosition = positionResult.rows[0].next_position;
        console.log('newChannel2', nextPosition);
        const newChannel = await pool.query(
            'INSERT INTO channels (server_id, name, type, created_by, is_private, position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [server_id, name, type, created_by, is_private, nextPosition]
        );

        await pool.query('COMMIT');
        console.log('newChannel3', newChannel);
        res.status(201).json(newChannel.rows[0]);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error creating channel:', err);
        res.status(500).json({message: err.message})
    }
}

const getCurrentChannel = async (req, res) => {
    const { channel_id } = req.body;

    if(!channel_id) {
        return res.status(400).json({message: 'Channel Required'})
    }

    try {
        const channel = await pool.query('SELECT * FROM channels WHERE id = $1', [channel_id]);

        return res.status(200).json(channel.rows[0]);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const getAllChannels = async (req, res) => {
    const { server_id } = req.body;

    if(!server_id) {
        return res.status(400).json({message: 'Channel Required'})
    }

    try {
        const channels = await pool.query('SELECT * FROM channels WHERE server_id = $1 ORDER BY channels.created_at', [server_id]);
        return res.status(200).json(channels.rows);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    getCurrentChannel,
    getAllChannels,
    createChannel
}