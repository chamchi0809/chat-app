import mongoose, { model, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import UserModel, { IUser } from './user';

export type chatRoom_type='group'|'dm'

export interface IChatRoom{
  _id?:string,
  name:string,
  userIds:string[],
  chatInitiator:string
  type:chatRoom_type
}

export interface IChatRoomModel extends Model<IChatRoom>{
  initiateChat:(userIds:string[], chatInitiator:string, type:chatRoom_type)=>Promise<{isNew:boolean, id:string, opponent:IUser}>
  getChatRoomById:(roomId:string)=>Promise<IChatRoom>
  getChatRoomsByUserId:(userId:string)=>Promise<IChatRoom[]>
  deleteChatRoomById:(roomId:string)=>Promise<void>
}

const chatRoomSchema = new Schema<IChatRoom, IChatRoomModel>(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    name:{
      type:String,
      default:'Untitled'
    },
    userIds: Array,
    chatInitiator: String,
    type:String
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

chatRoomSchema.statics.initiateChat = async function (
	userIds:string, chatInitiator:string, type:chatRoom_type
) {
  try {
    let isNew = true;
    if(type==='dm'){
      const room = await this.findOne({userIds:userIds, chatInitiator:chatInitiator})
      if(room) return {
        isNew:false,
        id:room._id,
        opponent:UserModel.getUserById(room.userIds[0])
      }
    }
    const newRoom = await this.create({ userIds,chatInitiator,type });
    return {isNew:true, id:newRoom._id, opponent:null};
  } catch (error) {
    console.log('error on start chat method', error);
    throw error;
  }
};

chatRoomSchema.statics.getChatRoomById = async function (roomId:string) {
  try {
    const aggregate = await this.aggregate([
      {$match:{ _id:roomId } },
      {$lookup:{from:'users', localField:'userIds', foreignField:'_id', as:'users'}},
      {$lookup: {from: "chatmessages", localField: "_id", foreignField: "chatRoomId", as: "chatmessages"}},
      {$unwind: { path: "$chatmessages", preserveNullAndEmptyArrays: true }},
      {$sort: {"chatmessages.createdAt": -1}},
      {$group:
        { 
          _id:"$_id",
          name:{$last:'$name'},
          userIds:{$last:'$userIds'},
          chatInitiator:{$last:'$chatInitiator'},
          type:{$last:'$type'},
          createdAt:{$last:'$createdAt'},
          updatedAt:{$last:'$updatedAt'},
          recentMessage:{$first:'$chatmessages'},
          users:{$first:'$users'}
        }
      }
    ]);
    return aggregate[0]
  } catch (error) {
    throw error;
  }
};

chatRoomSchema.statics.deleteChatRoomById = async function (roomId:string) {
  try {
    await this.deleteOne({_id:roomId});
  } catch (error) {
    console.log(error);
    throw error;
  }
}

chatRoomSchema.statics.getChatRoomsByUserId = async function (userId:string) {
  try {
    return await this.aggregate([
      {$match:{ userIds: { $all: [userId] } }},
      {$lookup:{from:'users', localField:'userIds', foreignField:'_id', as:'users'}},
      {$lookup: {from: "chatmessages", localField: "_id", foreignField: "chatRoomId", as: "chatmessages"}},
      {$unwind: { path: "$chatmessages", preserveNullAndEmptyArrays: true }},
      {$sort: {"chatmessages.createdAt": -1}},
      {$group:
        { 
          _id:'$_id',
          name:{$last:'$name'},
          userIds:{$last:'$userIds'},
          chatInitiator:{$last:'$chatInitiator'},
          type:{$last:'$type'},
          createdAt:{$last:'$createdAt'},
          updatedAt:{$last:'$updatedAt'},
          recentMessage:{$first:'$chatmessages'},
          users:{$first:'$users'}
        }
      },
      {$sort:{'updatedAt':-1}}
    ])
  } catch (error) {
    console.log(error)
    throw error;
  }
}




const ChatRoomModel = model<IChatRoom, IChatRoomModel>('ChatRoom', chatRoomSchema);

export default ChatRoomModel

export function validateChatRoom(chatRoom:IChatRoom) : chatRoom is IChatRoom{
  return ('userIds' in chatRoom && 'chatInitiator' in chatRoom)
}