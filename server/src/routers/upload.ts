import express, {Router} from 'express';
import multer from 'multer';
import uploadController from '../controllers/upload'
import {getRandomId} from '../middlewares/getRandomId';
import attachmentUploader from '../middlewares/attachmentUploader';


const uploadRouter = express.Router();

uploadRouter.post('/:roomId', getRandomId, attachmentUploader.single('file'), uploadController.uploadAttachment);

export default uploadRouter;