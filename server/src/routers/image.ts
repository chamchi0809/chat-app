import express, { Router } from 'express';
import imageController from '../controllers/image'
import upload from '../middlewares/upload';

const imageRouter = express.Router();

imageRouter.post('/', upload.single('image'), imageController.uploadImage);
imageRouter.get('/:filename',imageController.getImageByFilename);

export default imageRouter;