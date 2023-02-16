import mongoose, {model, Model, Schema} from "mongoose";
import {StringDecoder} from 'string_decoder';
import {v4 as uuidv4} from "uuid";
import ChatRoomModel from './chatRoom';

export interface IMessage {
    messageText: string,
    attachmentUrl: string
}

export interface IChatMessage {
    _id?: string,
    chatRoomId: string,
    message: IMessage
    postedBy: string,
    replyingTo: string
}

export interface IChatMessageModel extends Model<IChatMessage> {
    createPostInChatRoom: (chatRoomId: string, message: IMessage, postedBy: string, replyingTo: string) => Promise<any>
    getConversationByRoomId: (chatRoomId: string, options?: IGetConversationOption) => Promise<any>
    getRecentConversations: (chatRoomIds: string[]) => Promise<any>
    getMessageById: (messageId: string) => Promise<IChatMessage>
    deleteMessageById: (messageId: string) => Promise<void>
    deleteMessagesByRoomId: (roomId: string) => Promise<void>
    editMessageById: (messageId: string, message: IMessage) => Promise<any>
}

export interface IGetConversationOption {
    page?: number,
    limit?: number
}

const chatMessageSchema = new Schema<IChatMessage, IChatMessageModel>(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        chatRoomId: String,
        message: mongoose.Schema.Types.Mixed,
        postedBy: String,
        replyingTo: String,
    },
    {
        timestamps: true,
        collection: "chatmessages",
    }
);

chatMessageSchema.statics.createPostInChatRoom = async function (chatRoomId: string, message: IMessage, postedBy: string, replyingTo: string) {
    try {
        const post = await this.create({
            chatRoomId,
            message,
            postedBy,
            replyingTo
        });
        await ChatRoomModel.updateOne({_id: chatRoomId}, {$inc: {'__v': 1}});
        const aggregate = await this.aggregate([
            {$match: {_id: post._id}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy',
                }
            },
            {$unwind: {path: '$postedBy', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'chatmessages',
                    localField: 'replyingTo',
                    foreignField: '_id',
                    as: "replyingTo"
                }
            },
            {$unwind: {path: '$replyingTo', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'replyingTo.postedBy',
                    foreignField: '_id',
                    as: 'replyingTo.postedBy',
                }
            },
            {$unwind: {path: '$replyingTo.postedBy', preserveNullAndEmptyArrays: true}},
        ]);
        return aggregate[0];
    } catch (error) {
        throw error;
    }
}
chatMessageSchema.statics.getConversationByRoomId = async function (chatRoomId: string, options: IGetConversationOption = {}) {
    try {
        return this.aggregate([
            {$match: {chatRoomId}},
            {$sort: {createdAt: -1}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy',
                }
            },
            {$unwind: {path: '$postedBy', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'chatmessages',
                    localField: 'replyingTo',
                    foreignField: '_id',
                    as: "replyingTo"
                }
            },
            {$unwind: {path: '$replyingTo', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'replyingTo.postedBy',
                    foreignField: '_id',
                    as: 'replyingTo.postedBy',
                }
            },
            {$unwind: {path: '$replyingTo.postedBy', preserveNullAndEmptyArrays: true}},
            {$skip: options.page},
            {$limit: options.limit},
            {$sort: {createdAt: 1}},
        ]);
    } catch (error) {
        throw error;
    }
}
chatMessageSchema.statics.getRecentConversations = async function (chatRoomIds: string[]) {
    try {
        return this.aggregate([
            {$match: {chatRoomId: {$in: chatRoomIds}}},
            {
                $group: {
                    _id: '$chatRoomId',
                    messageId: {$last: '$_id'},
                    chatRoomId: {$last: '$chatRoomId'},
                    message: {$last: '$message'},
                    postedBy: {$last: '$postedBy'},
                    createdAt: {$last: '$createdAt'},
                }
            },
            {$sort: {createdAt: -1}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy',
                }
            },
            {$unwind: "$postedBy"},
            {
                $lookup: {
                    from: 'chatrooms',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'roomInfo',
                }
            },
            {$unwind: "$roomInfo"},
            {$unwind: "$roomInfo.userIds"},
            {
                $lookup: {
                    from: 'users',
                    localField: 'roomInfo.userIds',
                    foreignField: '_id',
                    as: 'roomInfo.userProfile',
                }
            },

            {
                $group: {
                    _id: '$roomInfo._id',
                    messageId: {$last: '$messageId'},
                    chatRoomId: {$last: '$chatRoomId'},
                    message: {$last: '$message'},
                    postedBy: {$last: '$postedBy'},
                    roomInfo: {$addToSet: '$roomInfo.userProfile'},
                    createdAt: {$last: '$createdAt'},
                },
            },

        ]);
    } catch (error) {
        throw error;
    }
}
chatMessageSchema.statics.getMessageById = async function (messageId: string) {
    try {
        const aggregate = await this.aggregate([
            {$match: {_id: messageId}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy',
                }
            },
            {$unwind: {path: '$postedBy', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'chatmessages',
                    localField: 'replyingTo',
                    foreignField: '_id',
                    as: "replyingTo"
                }
            },
            {$unwind: {path: '$replyingTo', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'replyingTo.postedBy',
                    foreignField: '_id',
                    as: 'replyingTo.postedBy',
                }
            },
            {$unwind: {path: '$replyingTo.postedBy', preserveNullAndEmptyArrays: true}},
        ]);
        return aggregate[0];
    } catch (error) {
        throw error;
    }
}
chatMessageSchema.statics.deleteMessageById = async function (messageId: string) {
    try {
        await this.deleteOne({_id: messageId});
    } catch (error) {
        throw error;
    }
}
chatMessageSchema.statics.deleteMessagesByRoomId = async function (roomId: string) {
    try {
        await this.deleteMany({chatRoomId: roomId});
    } catch (error) {
        throw error;
    }
}
chatMessageSchema.statics.editMessageById = async function (messageId: string, message: IMessage) {
    try {
        await this.updateOne({_id: messageId}, {message: message});
        const aggregate = await this.aggregate([
            {$match: {_id: messageId}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy',
                }
            },
            {$unwind: {path: '$postedBy', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'chatmessages',
                    localField: 'replyingTo',
                    foreignField: '_id',
                    as: "replyingTo"
                }
            },
            {$unwind: {path: '$replyingTo', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'replyingTo.postedBy',
                    foreignField: '_id',
                    as: 'replyingTo.postedBy',
                }
            },
            {$unwind: {path: '$replyingTo.postedBy', preserveNullAndEmptyArrays: true}},
        ]);
        return aggregate[0];
    } catch (error) {
        throw error;
    }
}


const ChatMessageModel = model<IChatMessage, IChatMessageModel>('ChatMessage', chatMessageSchema);

export default ChatMessageModel