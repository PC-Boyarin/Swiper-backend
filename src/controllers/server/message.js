const pool = require('../../db/pool')

const createMessage = async (content, user_id, channel_id) => {
    try {
        const room = await pool.query(`SELECT * FROM channels WHERE id = $1`, [
            channel_id
        ]);

        if(!room.rows[0]) {
            throw new Error('Комната не найдена', )
        }

        const newMessage = await pool.query(`
            INSERT INTO messages (content, user_id, channel_id) VALUES ($1, $2, $3) RETURNING *,
            (SELECT username FROM users WHERE id = $2) AS username,
            (SELECT image_icon FROM users WHERE id = $2) AS image_icon`,
            [content, user_id, channel_id]
        )
        return newMessage.rows[0]
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = { createMessage };
