import {Socket} from 'socket.io';
import UserModel from '../db/user';

export interface UserInfo {
    socketId: string
    userId: string
}

export interface ServerToClientEvents {
    disconnect: () => void
    identity: (userId: string) => void
    subscribe: (room: string, otherUserId?: string) => void
    unsubscribe: (room: string) => void
    setIsTyping: (room: string, isTyping: boolean, value:string) => void
}

export interface ClientToServerEvents {
    newMessage: (message) => void
    newRoom: (userIds: string[]) => void
    deleteRoom: (userIds: string[]) => void
    deleteMessage: (message) => void
    editMessage: (message) => void
    getIsTyping: (isTyping: boolean, room: string, usersTyping: string[]) => void
}

export type Client = Socket<ServerToClientEvents, ClientToServerEvents>


export class WebSockets {
    users: UserInfo[];
    usersTyping;
    private static instance: WebSockets

    constructor() {
        this.users = [];
        this.usersTyping = [];
        UserModel.updateAllStatus('offline');
    }

    static getWebSockets() {
        if (!WebSockets.instance) {
            WebSockets.instance = new WebSockets();
        }
        return WebSockets.instance
    }

    connection(client: Client) {

        client.onAny((event, ...args) => {
            if (event !== 'disconnect') {
                const user = this.users.find(user => user.socketId === client.id);
                user && UserModel.updateStatusById(user.userId, 'online');
            }
        })

        client.on("disconnect", () => {
            const user = this.users.find(user => user.socketId === client.id);
            user && UserModel.updateStatusById(user?.userId, 'offline');
            this.users = this.users?.filter((user) => user.socketId !== client.id);
            for (const room in this.usersTyping) {
                const newTypingInfo = this.usersTyping[room].filter((userId) => userId !== user.userId);
                this.usersTyping[room] = newTypingInfo;
                (global.io.sockets as Client).in(room).emit('getIsTyping', false, room, newTypingInfo);
            }
        });

        client.on("identity", (userId: string) => {
            this.users.push({
                socketId: client.id,
                userId: userId,
            });
            UserModel.updateStatusById(userId, 'online');
            console.log(this.users);
        });

        client.on("subscribe", (room: string, otherUserId: string = "") => {
            this.subscribeOtherUser(room, otherUserId);
            client.join(room);
        });

        client.on("unsubscribe", (room: string) => {
            client.leave(room);
        });
        client.on('setIsTyping', (room: string, isTyping: boolean, value:string) => {
            const user = this.users.find(user => user.socketId === client.id);

            if (user) {
                UserModel.editDraftByRoomId(user.userId, room, value);
                this.usersTyping[room] = (this.usersTyping[room] || []).filter(userId => userId !== user.userId);
                if (isTyping) {
                    this.usersTyping[room] = [...(this.usersTyping[room] || []), user.userId];
                }

                console.log(this.usersTyping);
                (global.io.sockets as Client).in(room).emit('getIsTyping', isTyping, room, this.usersTyping[room] || []);
            }
        })
    }

    subscribeOtherUser(room: string, otherUserId: string) {
        const userSockets = this.users?.filter(
            (user) => user.userId === otherUserId
        );
        userSockets.map((userInfo) => {

            const socketConn: Socket = global.io.sockets.connected(userInfo.socketId);
            if (socketConn) {
                socketConn.join(room)
            }
        });
    }
}

export default new WebSockets();