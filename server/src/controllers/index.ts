import UserModel, { validateUser } from '../db/user';

export default {
  createUser: async (req, res, next) => {
    try {
      if(!validateUser(req.body)) return res.status(400).json({error: "not type of user"});
      const {username, password, type, email} = req.body; 
      const user = await UserModel.createUser(username, password, type, email);
      next();
    }catch(error){
      return res.status(400).json({success:false, error:error});
    }
  },
}