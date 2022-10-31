//configure .env file
import * as dotenv from 'dotenv'
dotenv.config();

import http from 'http';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import './db/connection';
//routers
import indexRouter from './routers/index';
import userRouter from './routers/user';
import chatRoomRouter from './routers/chatRoom';
//middlewares
import {decode} from './middlewares/jwt';


import socketio from "socket.io";

import imageRouter from './routers/image';
import { WebSockets } from './utils/WebSockets';

const app = express();

const port = process.env.PORT || '5000';
app.set('port', port);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/',indexRouter);
app.use('/users',decode,userRouter);
app.use('/rooms', decode, chatRoomRouter);
app.use('/images', imageRouter);

app.use('*', (req, res)=>{
  return res.status(404).json({
    success:false,
    message:'route doesnt exist'
  })
})

const server = http.createServer(app);
server.listen(port);
server.on('listening',()=>{
  console.log(`listening on localhost:${port}`);
})

const webSockets = WebSockets.getWebSockets();

global.io = new socketio.Server(server)
global.io.on('connection', webSockets.connection.bind(webSockets))
