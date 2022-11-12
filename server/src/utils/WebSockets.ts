import { Socket } from 'socket.io';
import UserModel from '../db/user';

export interface UserInfo{
  socketId:string,
  userId:string,
}

export interface ServerToClientEvents {
  disconnect:()=>void,
  identity:(userId:string)=>void,
  subscribe:(room:string, otherUserId?:string)=>void,
  unsubscribe:(room:string)=>void
  setIsTyping:(room:string, isTyping:boolean)=>void
}

export interface ClientToServerEvents {
  newMessage:(message)=>void
  newRoom:(userIds:string[])=>void
  deleteRoom:(userIds:string[])=>void
  deleteMessage:(message)=>void
  editMessage:(message)=>void
  getIsTyping:(isTyping:boolean, userId:string)=>void
}

export type Client = Socket<ServerToClientEvents, ClientToServerEvents>



export class WebSockets {
  users:UserInfo[];
  private static instance: WebSockets
  constructor(){
    this.users = [];
  }
  static getWebSockets(){
    if(!WebSockets.instance){
      WebSockets.instance = new WebSockets();
    }
    return WebSockets.instance
  }

  connection(client:Client) {
    
    client.on("disconnect", () => {
      const user = this.users.find(user=>user.socketId===client.id);
      user && UserModel.updateStatusById(user?.userId, 'offline');
      this.users = this.users?.filter((user) => user.socketId !== client.id);
    });
    
    client.on("identity", (userId:string) => {
      this.users.push({
        socketId: client.id,
        userId: userId,
      });
      UserModel.updateStatusById(userId, 'online');
      console.log(this.users);
    });
    
    client.on("subscribe", (room:string, otherUserId:string = "") => {
      this.subscribeOtherUser(room, otherUserId);
      client.join(room);
    });
    
    client.on("unsubscribe", (room:string) => {
      client.leave(room);
    });
    client.on('setIsTyping', (room:string, isTyping:boolean)=>{
      const user = this.users.find(user=>user.socketId===client.id);
      
      if(user){
        (global.io.sockets as Client).in(room).emit('getIsTyping', isTyping, user.userId);
      }
    })
  }

  subscribeOtherUser(room:string, otherUserId:string) {
    const userSockets = this.users?.filter(
      (user) => user.userId === otherUserId
    );
    userSockets.map((userInfo) => {
      
      const socketConn:Socket = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room)
      }
    });
  }
}

export default new WebSockets();