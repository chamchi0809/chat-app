import { Socket } from 'socket.io';
import {io} from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Auth from './Auth';

interface ServerToClientEvents {
  newMessage:(message)=>void
  newRoom:(userIds:string[])=>void
  deleteRoom:(userIds:string[])=>void
  deleteMessage:(message)=>void
  editMessage:(message)=>void
}

interface ClientToServerEvents {
  subscribe:(room:string, otherUserId?:string)=>void,
  identity: (userId:string) => void;
  unsubscribe:(room:string)=>void
}

export class SocketClient{
  private static instance: SocketClient
  socket:Socket<ServerToClientEvents, ClientToServerEvents>
  callback:()=>Promise<void>

  static getSocketClient(){
    if(!SocketClient.instance){
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance
  }

  async init() {
    const auth = Auth.getAuth();
    console.log(await auth.getUser());
    const userId = (await auth.getUser())._id
    if(!this.socket){
      console.log('created new socket');
      this.socket = io(process.env.SOCKET_BASE_URL,{
        transports:['websocket']
      }) as any;
      this.socket.emit('identity', userId);
    }
  }
  

  onNewMessage(cb:(message)=>void){
    this.socket.on('newMessage',cb);
    return cb;
  }

  onNewRoom(cb:()=>void){
    const listener = async(userIds)=>{
      const userId = (await Auth.getAuth().getUser())._id;
      if(userIds.includes(userId)){
        cb();
      }
    }
    this.socket.once('newRoom', listener);
    return listener;
  }

  onDeleteRoom(cb:()=>void){
    const listener = async(userIds)=>{
      const userId = (await Auth.getAuth().getUser())._id;
      if(userIds.includes(userId)){
        cb();
      }
    }
    this.socket.once('deleteRoom', listener)
    return listener;
  }

  onDeleteMessage(cb:(message)=>void){
    this.socket.on('deleteMessage', cb)
    return cb;
  }

  onEditMessage(cb:(message)=>void){
    this.socket.on('editMessage', cb)
    return cb;
  }

  subscribeRoom(room:string, otherUserId:string=''){
    this.socket.emit('subscribe', room, otherUserId);
  }

  unsubscribeRoom(room:string){
    this.socket.emit('unsubscribe', room);
  }
}