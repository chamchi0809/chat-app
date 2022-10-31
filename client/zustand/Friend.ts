import create from 'zustand'
import { IUser } from '../pages/api/schema';
import ChatRoomDB from '../utils/ChatRoomDB';

interface FriendState {
  friends:IUser[]
  setFriends:(user:IUser)=>void
}

export const useFriendStore = create<FriendState>()((set)=>({
  friends:[],
  setFriends:user=>set(state=>({friends:user?.friends}))
}))