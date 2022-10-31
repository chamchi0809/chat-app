import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ChatRoom from '../../components/molecules/ChatRoom';
import ChatMessageList from '../../components/templates/ChatMessageList';
import ChatRoomList from '../../components/organisms/ChatRoomList';
import { SocketClient } from '../../utils/SocketClient';
import Auth from '../../utils/Auth';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatRoom } from '../api/schema';




const ChatRoomPage:React.FC=()=>{

  const router = useRouter();
  const chatRoomDB = ChatRoomDB.getChatRoomDB();
  const [selectedRoom, setSelectedRoom] = useState<IChatRoom>(null);

  useEffect(()=>{
    if(!router.isReady) return;
    (async()=>{
      setSelectedRoom(await chatRoomDB.loadRoom(router.query.roomId as string));
    })()
  },[router.isReady, router.query])

  return (
    <ChatMessageList selectedRoom={selectedRoom}/>
  )
}

export default ChatRoomPage