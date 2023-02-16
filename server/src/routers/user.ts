import express from 'express';
import userController from '../controllers/user';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.patch('/friend/:id', userController.addFriendById)
userRouter.delete('/friend/:id', userController.deleteFriendById)
userRouter.get('/myInfo', userController.getUserByToken);
userRouter.get('/:id', userController.getUserById);
userRouter.get('/:id/mutualFriends', userController.getMutualFriends);
userRouter.get('/drafts/:roomId', userController.getDraftByRoomId);
userRouter.delete('/:id', userController.deleteUserById);

export default userRouter;