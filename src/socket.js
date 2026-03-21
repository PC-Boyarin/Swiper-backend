import {createMessage} from "./controllers/server/message";

export default function socketIoHandler (io) {
    io.on('connection', (socket) => {
        socket.on('room:join', async (data) => {
            // const {room_id} = data;
            console.log('socket1', data)
            socket.join(`${data}`);
        })

        socket.on('message:send', async (data) => {

            const { content, user_id, channel_id } = data;
            try {
                const newMessage = await createMessage(content, user_id, channel_id);
                // io.in(`${channel_id}`).emit('message:new', newMessage);
                io.to(String(channel_id)).emit('message:new', {
                    ...newMessage,
                    channel_id: Number(channel_id)
                });
            } catch (error) {
                const errorMessage = `Failed to save message. ${error.message}`;
                socket.emit('error', {
                    message: errorMessage,
                });
            }
        });

        // // Обработка начала печати
        // socket.on('typing:start', (channel_id) => {
        //     const roomName = String(channel_id);
        //     const userId = socket.user_id;
        //     const username = socket.username || socket.user_name;
        //     console.log(`✏️ User (${username}) started typing in channel ${roomName}`, socket.username, '66', socket.user_name);
        //
        //     // Рассылаем всем в комнате, КРОМЕ отправителя
        //     socket.to(roomName).emit('typing:start', {
        //         userId: userId || socket.id,
        //         channelId: Number(channel_id),
        //         username: socket.username, // если есть
        //         timestamp: new Date().toISOString()
        //     });
        // });
        //
        // // Обработка остановки печати
        // socket.on('typing:stop', (channelId) => {
        //     const roomName = String(channelId);
        //     const userId = socket.userId;
        //
        //     console.log(`✏️ User2 ${userId || socket.id} stopped typing in channel ${roomName}`);
        //
        //     socket.to(roomName).emit('typing:stop', {
        //         userId: userId || socket.id,
        //         channelId: Number(channelId),
        //         timestamp: new Date().toISOString()
        //     });
        // });

        socket.on('leave_chat', async (data) => {
                console.log(`Client disconnected with id: ${socket.id}`)
                const {roomId} = data
                socket.leave(roomId)
            }
        );
    });
};
