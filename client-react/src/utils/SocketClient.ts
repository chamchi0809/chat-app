import {Socket} from 'socket.io';
import {io} from 'socket.io-client'
import Auth from './Auth';
import {IChatMessage, IMessage} from "../pages/api/schema";

interface ServerToClientEvents {
    newMessage: (message: IChatMessage) => void
    newRoom: (userIds: string[]) => void
    deleteRoom: (userIds: string[]) => void
    exitRoom: (roomId: string) => void
    deleteMessage: (message: IChatMessage) => void
    editMessage: (message: IChatMessage) => void
    getIsTyping: (isTyping: boolean, room: string, usersTyping: string[]) => void
}

interface ClientToServerEvents {
    subscribe: (room: string, otherUserId?: string) => void,
    identity: (userId: string) => void;
    unsubscribe: (room: string) => void
    setIsTyping: (room: string, isTyping: boolean, value:string) => void
}

const {VITE_SOCKET_BASE_URL} = import.meta.env;

export class SocketClient {
    private static instance: SocketClient
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined


    static getSocketClient() {
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient();
        }
        return SocketClient.instance
    }

    async init() {
        const auth = Auth.getAuth();
        const userId = (await auth.getUser())?._id
        if (!this.socket && userId) {
            console.log('created new socket');
            this.socket = io(VITE_SOCKET_BASE_URL, {
                transports: ['websocket']
            }) as any;
            this.socket?.emit('identity', userId);
        }
    }


    onNewMessage(cb: (message: IChatMessage) => void) {
        this.socket?.on('newMessage', cb);
        return cb;
    }

    onNewRoom(cb: () => void) {
        const listener = async (userIds: string[]) => {
            const userId = (await Auth.getAuth().getUser())?._id;
            if (!userId) return;
            if (userIds.includes(userId)) {
                cb();
            }
        }
        this.socket?.once('newRoom', listener);
        return listener;
    }

    onDeleteRoom(cb: () => void) {
        const listener = async (userIds: string[]) => {
            const userId = (await Auth.getAuth().getUser())?._id;
            if (!userId) return;
            if (userIds.includes(userId)) {
                cb();
            }
        }
        this.socket?.once('deleteRoom', listener)
        return listener;
    }

    onExitRoom(cb: (roomId: string) => void) {
        this.socket?.on('exitRoom', cb);
        return cb;
    }

    onDeleteMessage(cb: (message: IChatMessage) => void) {
        this.socket?.on('deleteMessage', cb)
        return cb;
    }

    onEditMessage(cb: (message: IChatMessage) => void) {
        this.socket?.on('editMessage', cb)
        return cb;
    }

    onGetIsTyping(cb: (isTyping: boolean, room: string, usersTyping: string[]) => void) {
        this.socket?.on('getIsTyping', cb);
        return cb;
    }

    subscribeRoom(room: string, otherUserId: string = '') {
        this.socket?.emit('subscribe', room, otherUserId);
    }

    unsubscribeRoom(room: string) {
        this.socket?.emit('unsubscribe', room);
    }

    setIsTyping(room: string, isTyping: boolean, value:string) {
        this.socket?.emit('setIsTyping', room, isTyping, value);
    }

}