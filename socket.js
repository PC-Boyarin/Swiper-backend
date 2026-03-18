// import {Server} from 'socket.io'
//
// export default async function Handler(req, res) {
//
//        if(!res?.socket?.server?.io) {
//            const httpServer = res?.socket?.server;
//            const io = new Server(httpServer)
//            // console.log(io)
//            io.on('connect', (socket) => {
//                socket.on('disconnect', () => {})
//                // Broadcast a message to all connected clients
//                socket.on('broadcastMessage', (message) => {
//                    io.emit('serversMessage', message);
//                });
//            })
//            if(res) {
//                res.socket.server.io = io
//            }
//        }
//     res?.end()
// }
