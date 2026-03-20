"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = socketIoHandler;
const message_1 = require("./controllers/server/message");
function socketIoHandler(io) {
    io.on('connection', (socket) => {
        socket.on('room:join', async (data) => {
            // const {room_id} = data;
            console.log('socket1', data);
            socket.join(`${data}`);
        });
        socket.on('message:send', async (data) => {
            console.log('socket2', data);
            const { content, user_id, channel_id } = data;
            try {
                const newMessage = await (0, message_1.createMessage)(content, user_id, channel_id);
                console.log('socket3', newMessage);
                // io.in(`${channel_id}`).emit('message:new', newMessage);
                io.to(String(channel_id)).emit('message:new', {
                    ...newMessage,
                    channel_id: Number(channel_id)
                });
                console.log('socket4', newMessage);
            }
            catch (error) {
                console.log('socket5', error);
                const errorMessage = `Failed to save message. ${error.message}`;
                console.log('socket6', error);
                socket.emit('error', {
                    message: errorMessage,
                });
            }
        });
        socket.on('leave_chat', async (data) => {
            console.log(`Client disconnected with id: ${socket.id}`);
            const { roomId } = data;
            socket.leave(roomId);
        });
    });
}
;
