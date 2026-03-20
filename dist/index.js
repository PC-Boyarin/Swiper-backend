"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = __importDefault(require("./src/socket"));
const room_1 = require("./src/controllers/client/room");
const message_1 = require("./src/controllers/client/message");
const message_2 = __importDefault(require("./src/router/message"));
const channels_1 = __importDefault(require("./src/router/channels"));
const servers_1 = __importDefault(require("./src/router/servers"));
const user_1 = __importDefault(require("./src/router/user"));
const auth_1 = __importDefault(require("./src/router/auth"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const corsOptions = {
    origin: ['http://localhost:5173', 'http://192.168.50.23:3001', 'http://192.168.50.23:5173', 'http://217.177.74.174:3001'],
    credentials: true,
    allowedHeaders: [
        'set-cookie',
        'Content-Type',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
    ],
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use(cookieParser(process.env.JWT_EXPIRES_IN));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', (req, res) => {
    res.send('Welcome to the chat-room servers');
});
const server = http.createServer(app);
app.use('/api/rooms', room_1.getRooms);
app.use('/api/messages', message_1.getAllMessages);
app.use('/api/messages', message_2.default);
// app.use('/api/channels', getAllChannels);
app.use('/api/channels', channels_1.default);
app.use('/api/servers', servers_1.default);
app.use('/api/user', user_1.default);
app.use('/api/auth', auth_1.default);
const io = new socket_io_1.Server(server, {
    // pingTimeout: 60000,
    cors: {
        origin: ['http://localhost:5173', 'http://192.168.50.23:3000', 'http://217.177.74.174:5173'],
        credentials: true,
        methods: ['GET', 'POST'],
    },
});
(0, socket_1.default)(io);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
