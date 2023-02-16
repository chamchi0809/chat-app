import ChatMessageModel, {IGetConversationOption, IMessage} from '../db/chatMessage';
import ChatRoomModel from '../db/chatRoom';
import UserModel from '../db/user';
import {WebSockets} from "../utils/WebSockets";

export default {
    initiate: async (req, res) => {
        try {

            if (!req.body.userIds) return res.status(400).json({error: "no userids provided"});
            if (!req.body.type) return res.status(400).json({error: "no type provided"});

            const {userIds, type} = req.body;
            const {userId: chatInitiator} = req;
            const allUserIds = [...userIds, chatInitiator];

            const {isNew, id, opponent} = await ChatRoomModel.initiateChat(allUserIds, chatInitiator, type);
            global.io.sockets.emit('newRoom', allUserIds);
            return res.status(200).json({success: true, isNew, id, opponent});
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    postMessage: async (req, res) => {
        try {
            const {roomId} = req.params;
            const replyingTo = req.body.replyingTo || '';

            const messagePayload: IMessage = {
                messageText: req.body.messageText || '',
                attachmentUrl: req.body.attachmentUrl || '',
            };
            const currentLoggedUser = req.userId;
            const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser, replyingTo);
            global.io.sockets.in(roomId).emit('newMessage', post);

            return res.status(200).json({success: true, post: post});
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    getRecentConversation: async (req, res) => {
        try {
            const currentLoggedUser = req.userId;
            const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser);
            return res.status(200).json({success: true, rooms: rooms});
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    getConversationByRoomId: async (req, res) => {
        try {
            const {roomId} = req.params;
            const room = await ChatRoomModel.getChatRoomById(roomId)
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                })
            }
            const users = await UserModel.getUserByIds(room.userIds);
            const options: IGetConversationOption = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);
            return res.status(200).json({
                success: true,
                conversation,
                users,
            });
        } catch (error) {
            return res.status(500).json({success: false, error});
        }
    },
    getChatRoomById: async (req, res) => {
        try {
            const {roomId} = req.params;
            const room = await ChatRoomModel.getChatRoomById(roomId)
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                })
            }
            return res.status(200).json({
                success: true,
                room
            });
        } catch (error) {
            return res.status(500).json({success: false, error});
        }
    },
    deleteChatRoomById: async (req, res) => {
        try {
            const {roomId} = req.params;
            const room = await ChatRoomModel.getChatRoomById(roomId);
            await ChatRoomModel.deleteChatRoomById(roomId)
            ChatMessageModel.deleteMessagesByRoomId(roomId)
            global.io.sockets.in(roomId).emit('deleteRoom', (await room).userIds);
            return res.status(200).json({
                success: true,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({success: false, error});
        }
    },
    exitChatRoomById: async (req, res) => {
        try {
            const {roomId} = req.params;
            const currentLoggedUser = req.userId;
            await ChatRoomModel.exitChatRoomById(roomId, currentLoggedUser);
            const currentLoggedSocketId = WebSockets.getWebSockets().users.find(user => user.userId === currentLoggedUser).socketId;
            global.io.sockets.to(currentLoggedSocketId).emit('exitRoom', roomId);
            return res.status(200).json({
                success: true,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({success: false, error});
        }
    },
    deleteMessageById: async (req, res) => {
        try {
            const {messageId} = req.params;
            const message = await ChatMessageModel.getMessageById(messageId);
            await ChatMessageModel.deleteMessageById(messageId);
            global.io.sockets.in(message?.chatRoomId).emit('deleteMessage', message);
            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            return res.status(500).json({success: false, error});
        }
    },
    editMessageById: async (req, res) => {
        try {
            const {messageId} = req.params;
            if (!req.body.messageText) return res.status(400).json({error: 'no message provided'});
            const message = await ChatMessageModel.editMessageById(messageId, {
                messageText: req.body.messageText,
                attachmentUrl: req.body.attachmentUrl || '',
            });
            global.io.sockets.in(message?.chatRoomId).emit('editMessage', message);
            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            return res.status(500).json({success: false, error});
        }
    },
}