import express, {Request, Response} from "express";
import cors from 'cors'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import socketIoHandler from './src/socket'
import {getRooms} from "./src/controllers/client/room";
import {getAllChannels} from "./src/controllers/client/channels";
import {getAllMessages} from "./src/controllers/client/message"
import messageRouter from './src/router/message'
import channelsRouter from './src/router/channels'
import userRouter from './src/router/user'
import authRouter from './src/router/auth'

dotenv.config()
const PORT = process.env.PORT
const app = express()
const http = require('http');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const corsOptions = {
	origin: ['http://localhost:5173', 'http://192.168.50.23:3001', 'http://192.168.50.23:5173'],
	credentials: true,
	allowedHeaders: [
		'set-cookie',
		'Content-Type',
		'Access-Control-Allow-Origin',
		'Access-Control-Allow-Credentials',
	],
};
app.use(express.json())
app.use(cors(corsOptions));
app.use(cookieParser(process.env.JWT_EXPIRES_IN));
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({
	extended: true
}));
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the chat-room servers')
})

const server = http.createServer(app)

app.use('/api/rooms', getRooms);
app.use('/api/messages', getAllMessages);
app.use('/api/messages', messageRouter);
// app.use('/api/channels', getAllChannels);
app.use('/api/channels', channelsRouter);
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

const io = new Server(server, {
	// pingTimeout: 60000,
	cors: {
		origin: ['http://localhost:5173', 'http://192.168.50.23:3000'],
		credentials: true,
		methods: ['GET', 'POST'],
	},
})

socketIoHandler(io)

server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
