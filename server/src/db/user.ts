import {Schema, Model, model} from 'mongoose';
import path from 'path';
import {v4 as uuidv4} from 'uuid';


const defaultProfileImage='http://localhost:5000/images/defaultAvatar.png';

export type user_type='consumer'|'support';

export type user_status='online'|'idle'|'donotdisturb'|'offline'

export interface IUser{
  _id?:string,
  username:string,
  type:user_type,
  password:string
  email:string
  profileImage:string
  description:string
  friends:string[]
  status:user_status
}

export interface IUserModel extends Model<IUser>{
  createUser: (username:string, password:string, type:string, email:string)=>Promise<IUser>
  getUserById: (id:string)=>Promise<IUser>
  getUserByIds: (ids:string[])=>Promise<IUser[]>
  getUserByUsernameAndPassword:(username:string, password:string)=>Promise<IUser>
  getUserByEmailAndPassword:(email:string, password:string)=>Promise<IUser>
  getUsers:(query:string)=>Promise<Array<IUser>>
  deleteUserById:(id:string)=>Promise<any>
  updateStatusById:(id:string, status:user_status)=>Promise<void>
  addFriendById:(currentLoggedUser:string, id:string)=>Promise<any>
  deleteFriendById:(currentLoggedUser:string, id:string)=>Promise<any>
  getMutualFriends:(currentLoggedUser:string, id:string)=>Promise<any>
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    _id:{
      type:String,
      default:()=>uuidv4().replace(/\-/g, ""),
    },
    username:String,
    type:String,
    password:String,
    email:String,
    profileImage:{
      type:String,
      default:defaultProfileImage,
    },
    description:{
      type:String,
      default:'',
    },
    friends:{
      type:[{
        type:String
      }],
      default:[]
    },
    status:{
      type:String,
      default:'online'
    }
  },
  {
    timestamps:true,
    collection:'users',
  }
)

userSchema.statics.createUser = async function(username:string, password:string, type:string, email:string){
  try{
    const doesUsernameExist = await this.exists({username:username});
    const doesEmailExist = await this.exists({email:email});
    if(doesUsernameExist || doesEmailExist) throw ({error:'username or email already exists'});
    const user = await this.create({username, password, type, email});
    const aggregate = await this.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'friends',
          foreignField: '_id',
          as: 'friends',
        }
      },
    ]);
    return aggregate[0];
  } catch(error){
    throw error;
  }
};
userSchema.statics.getUserById = async function (id:string) {
  try{
    const aggregate = await this.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'users',
          localField: 'friends',
          foreignField: '_id',
          as: 'friends',
        }
      },
    ]);
    return aggregate[0];
  } catch(error){
    throw error;
  }
}
userSchema.statics.getUserByIds = async function (ids:string[]) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    throw error;
  }
}
userSchema.statics.getUserByEmailAndPassword = async function (email:string, password:string) {
  try{
    const aggregate = await this.aggregate([
      { $match: { email:email, password:password } },
      {
        $lookup: {
          from: 'users',
          localField: 'friends',
          foreignField: '_id',
          as: 'friends',
        }
      },
    ]);
    if(!aggregate[0]) throw ({error : 'Email or password is not correct'});
    return aggregate[0];
  } catch(error){
    throw error;
  }
}
userSchema.statics.getUserByUsernameAndPassword = async function (username:string, password:string) {
  try{
    const aggregate = await this.aggregate([
      { $match: { username:username, password:password } },
      {
        $lookup: {
          from: 'users',
          localField: 'friends',
          foreignField: '_id',
          as: 'friends',
        }
      },
    ]);
    if(!aggregate[0]) throw ({error : 'Username or password is not correct'});
    return aggregate[0];
  } catch(error){
    throw error;
  }
}
userSchema.statics.getUsers = async function (query:string) {
  try{
    const regex = new RegExp(`${query}`,'i')
    const users = await this.find({username:regex});
    return users;
  }catch(error){
    throw error;
  }
}
userSchema.statics.deleteUserById = async function (id:string) {
  try{    
    const result = await this.remove({_id:id});
    return result;
  }catch(error){
    throw error;
  }
}
userSchema.statics.updateStatusById = async function (id:string, status:user_status) {
  try{    
    await this.updateOne({_id:id}, {status:status})
  }catch(error){
    throw error;
  }
}
userSchema.statics.addFriendById = async function (currentLoggedUser:string, id:string) {
  try{
    await this.updateOne({_id:currentLoggedUser}, {$push:{friends:id}});
    const aggregate = await this.aggregate([
      { $match: { _id: currentLoggedUser } },
      {
        $lookup: {
          from: 'users',
          localField: 'friends',
          foreignField: '_id',
          as: 'friends',
        }
      },
    ]);
    return aggregate[0];
  }catch(error){
    throw error;
  }
}
userSchema.statics.deleteFriendById = async function (currentLoggedUser:string, id:string) {
  try{
    await this.updateOne({_id:currentLoggedUser}, {$pull:{friends:id}});
    const aggregate = await this.aggregate([
      { $match: { _id: currentLoggedUser } },
      {
        $lookup: {
          from: 'users',
          localField: 'friends',
          foreignField: '_id',
          as: 'friends',
        }
      },
    ]);
    return aggregate[0];
  }catch(error){
    throw error;
  }
}
userSchema.statics.getMutualFriends = async function (currentLoggedUser:string, id:string) {
  try{
    const user = await this.findOne({_id:currentLoggedUser});
    const otherUser = await this.findOne({_id:id});
    const mutualFriendIds = user.friends.filter(friend=>otherUser.friends.includes(friend));
    const mutualFriends = await this.find({_id:{$in:mutualFriendIds}});
    return mutualFriends;
  }catch(error){
    throw error;
  }
}


const UserModel = model<IUser, IUserModel>("User", userSchema);

export default UserModel;

export function validateUser(user:IUser) : user is IUser{
  return ('username' in user && 'password' in user && 'type' in user && 'email' in user)
}