const pool = require('../../db/pool');
// const validateForm = require('../../utils/validateForm');
// const { roomSchema } = require('../../schema/room');

const getRooms = async (req, res) => {
    try {
        const rooms = await pool.query('SELECT * FROM rooms');
        res.status(200).json(rooms.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRooms
}
