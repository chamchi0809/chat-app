import create from 'zustand'
import { IChatMessage, IChatRoom } from '../pages/api/schema';
import ChatRoomDB from '../utils/ChatRoomDB';
import {MutableRefObject} from 'react'

interface ChatMessageState {
  attachment:File
  messageEditing:string
  replyingTo:IChatMessage
  messageToSend:string;
  setAttachment:(file:File)=>void
  setMessageEditing:(message:string)=>void
  setReplyingTo:(message:IChatMessage)=>void
  setMessageToSend:(text:string)=>void
}

export const useChatMessageStore = create<ChatMessageState>()((set)=>({
  attachment:null,
  messageEditing:'',
  replyingTo:null,
  messageToSend:'',
  setAttachment:(file)=>set(state=>({attachment:file})),
  setMessageEditing:(message)=>set(state=>({messageEditing:message})),
  setReplyingTo:(message)=>set(state=>({replyingTo:message})),
  setMessageToSend:(text)=>set(state=>({messageToSend:text})),
}))