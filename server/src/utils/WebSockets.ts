import { Socket } from 'socket.io';
import UserModel from '../db/user';

interface UserInfo{
  socketId:string,
  userId:string,
}

interface ServerToClientEvents {
  disconnect:()=>void,
  identity:(userId:string)=>void,
  subscribe:(room:string, otherUserId?:string)=>void,
  unsubscribe:(room:string)=>void
}

interface ClientToServerEvents {
  
}



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

  connection(client:Socket<ServerToClientEvents, ClientToServerEvents>) {
    
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
    
  }

  subscribeOtherUser(room:string, otherUserId:string) {
    const userSockets = this.users?.filter(
      (user) => user.userId === otherUserId
    );
    userSockets.map((userInfo) => {
      
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        (socketConn as Socket).join(room)
      }
    });
  }
}

export default new WebSockets();