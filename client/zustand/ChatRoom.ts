import create from 'zustand'
import { IChatRoom } from '../pages/api/schema';
import ChatRoomDB from '../utils/ChatRoomDB';

interface ChatRoomState {
  chatRooms:IChatRoom[]
  loadChatRooms:()=>void
}

export const useChatRoomStore = create<ChatRoomState>()((set)=>({
  chatRooms:[],
  loadChatRooms:async()=>{
    const chatRoomsData = await ChatRoomDB.getChatRoomDB().loadRooms();
    set((state)=>({chatRooms:chatRoomsData}))
  }
}))