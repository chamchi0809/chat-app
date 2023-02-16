export type user_type = 'consumer' | 'support';
export type user_status = 'online' | 'idle' | 'donotdisturb' | 'offline'
export type chatRoom_type = 'group' | 'dm'

export interface IMessage {
    messageText: string,
    attachmentUrl: string
}

interface ISchema {
    createdAt: string,
    updatedAt: string
}

export interface IUser extends ISchema {
    _id: string,
    username: string,
    type: user_type,
    password: string
    email: string
    profileImage: string
    description: string
    friends: IUser[]
    friendRequest: IUser[]
    status: user_status
}

export interface IChatRoom extends ISchema {
    _id: string,
    name: string,
    userIds: string[],
    chatInitiator: string
    type: chatRoom_type
    recentMessage?: IChatMessage
    users: IUser[]
}

export interface IChatMessage extends ISchema {
    _id: string,
    chatRoomId: string,
    message: IMessage
    postedBy?: IUser,
    replyingTo?: IChatMessage
}

export interface IMessage {
    messageText: string,
    attachmentUrl: string
}