import express from 'express';
import users from '../controllers/user';
import {encode} from '../middlewares/jwt';
import index from '../controllers/index';

const indexRouter = express.Router();

indexRouter.post('/signin', encode, (req:any, res, next)=>{
  return res.status(200).json({
    success:true,
    authorization:req.authToken,
    user:req.user
  })
});

indexRouter.post('/signup', index.createUser, encode, (req:any, res, next)=>{
  return res.status(200).json({
    success:true,
    authorization:req.authToken,
    user:req.user
  })
});

export default indexRouter;