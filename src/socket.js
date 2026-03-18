import {createMessage} from "./controllers/server/message";

export default function socketIoHandler (io) {
    io.on('connection', (socket) => {
        socket.on('room:join', async (data) => {
            // const {room_id} = data;
            socket.join(`${data}`);
        })

        socket.on('message:send', async (data) => {
            const {content, user_id, channel_id} = data;
            try {
                const newMessage = await createMessage(content, user_id, channel_id);
                io.in(`${channel_id}`).emit('message:new', newMessage);
            } catch (error) {
                const errorMessage = `Failed to save message. ${error.message}`;
                socket.emit('error', {
                    message: errorMessage,
                });
            }
        });

        // socket.on('join_room', async (data) => {
        //     const { userId, roomId, username } = data;
        //
        //     try {
        //         await joinRoom(userId, roomId);
        //
        //         const joinMessage = `${username} has joined the room!`;
        //
        //         const adminUserId = await getAdminUserId();
        //         const newMessage = await createMessage(
        //             joinMessage,
        //             adminUserId,
        //             roomId
        //         );
        //
        //         // Emit a join room success event
        //         socket.emit('join_room_success');
        //
        //         // Emit the new message to all clients in the room
        //         io.in(roomId).emit('new_message', newMessage);
        //     } catch (error) {
        //         const errorMessage = `Failed to join room. ${error.message}`;
        //
        //         socket.emit('join_room_error', {
        //             message: errorMessage,
        //         });
        //     }
        // });

        socket.on('leave_chat', async (data) => {
                console.log(`Client disconnected with id: ${socket.id}`)
                const {roomId} = data
                socket.leave(roomId)
            }
        );
    });
};
