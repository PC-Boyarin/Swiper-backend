const pool = require("../../db/pool");

const getAllServers = async (req, res) => {
    const { user_id } = req.body;

    if(!user_id) {
        return res.status(400).json({message:"user_id is required"});
    }

    try {
        const servers = await pool.query('SELECT s.* FROM servers s JOIN server_members sm ON s.id = sm.server_id WHERE sm.user_id = $1', [user_id]);

        return res.status(200).json(servers.rows);
    } catch (err) {
        console.error('getAllServers error', error);
        return res.status(500).json({message: err.message});
    }
}

const createServer = async (req, res) => {
    const { name, is_public, description, owner_id } = req.body;

    try {
        const newServer = await pool.query('insert into servers (name, is_public, description, owner_id) values ($1, $2, $3, $4) returning *',
            [name, is_public, description, owner_id]);

        return res.status(200).json(newServer.rows);
    } catch (err) {
        console.error('createServer error', err);
        return res.status(500).json({message: err.message});
    }
}

module.exports = {
    getAllServers,
    createServer
}