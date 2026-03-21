const pool = require('../../db/pool');

const getUser = async (req, res) => {
    try {
        const { id } = req.body

        if(!id) {
            return res.status(400).json({message:"id is required"});
        }

        const user = await pool.query(
            'SELECT id, username, image_icon FROM users WHERE id = $1',
            [id]
        )

        return res.status(200).json(user.rows[0])
    } catch (err) {
        return res.status(500).json({message: 'Пользователь не найден или не авторизован'})
    }
}

const updateUser = async (req, res) => {
    try {
        const {id} = req.user
        const {username, image_icon} = req.body

        if(!username) throw new Error('Username обязателен')

        const user = await pool.query(
            'UPDATE users SET username= $1, image_icon = $2 WHERE id = $3 RETURNING *',
            [username, image_icon, id]
        )
        return res.status(200).json(user.rows[0])
    } catch (err) {
        return res.status(500).json({message: 'Произошла ошибка'})
    }
}

const searchUser = async(req, res) => {
    try {
        const { username } = req.body

        const query = `
          SELECT * FROM users
          WHERE username ILIKE $1
        `;
        const values = [`%${username}%`]; // Добавляем % для поиска по части строки

        const result = await pool.query(query, values);
        const resultSearch = result.rows.map(res => {
            return {
                username: res.username,
                id: res.id,
                image_icon: res.image_icon
            }
        })
        return res.status(200).json(resultSearch)
    } catch (err) {
        return res.status(500).json({message: 'Что-то пошло не так'})
    }
}

module.exports = {
    getUser,
    updateUser,
    searchUser
}
