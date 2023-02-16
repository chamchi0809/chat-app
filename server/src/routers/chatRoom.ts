import express from 'express';
import chatRoomController from '../controllers/chatRoom';

const chatRoomRouter = express.Router();

chatRoomRouter.get('/', chatRoomController.getRecentConversation);
chatRoomRouter.get('/:roomId', chatRoomController.getChatRoomById);
chatRoomRouter.delete('/:roomId', chatRoomController.deleteChatRoomById);
chatRoomRouter.post('/:roomId/exit', chatRoomController.exitChatRoomById);
chatRoomRouter.get('/:roomId/message', chatRoomController.getConversationByRoomId);
chatRoomRouter.delete('/message/:messageId', chatRoomController.deleteMessageById);
chatRoomRouter.patch('/message/:messageId', chatRoomController.editMessageById)
chatRoomRouter.post('/initiate', chatRoomController.initiate);
chatRoomRouter.post('/:roomId/message', chatRoomController.postMessage);

export default chatRoomRouter;