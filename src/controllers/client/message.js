const pool = require('../../db/pool')

const getAllMessages = async (req, res) => {

    const room_id = req.query.room_id;

    if (!room_id) return res.status(400).json({ message: 'Room ID is required' });

    try {
        const messages = await pool.query(
            'SELECT messages.*, users.image_icon, users.username FROM messages LEFT JOIN users ON messages.user_id = users.id WHERE messages.channel_id = $1 ORDER BY messages.created_at ASC LIMIT 100',
            [room_id]
        );

        return res.status(200).json(messages.rows);
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: error.message });
    }
};

const updateMessage = async (req, res) => {
    try {
        const {id} = req.query
        const {message} = req.body

        const currentMessage = await pool.query(
            'UPDATE messages SET message=$1 WHERE id = $2 RETURNING *',
            [message, id]
        )
        return res.status(200).json(currentMessage.rows[0])
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}


module.exports = {
    getAllMessages,
    updateMessage
}

