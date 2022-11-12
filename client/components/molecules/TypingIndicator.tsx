import React, { useRef, useEffect, useState} from 'react';

import {Dot} from 'react-animated-dots'
import styled from '@emotion/styled';
import oc from 'open-color';
import Button from '../atoms/Button';
import { AiFillFile, AiOutlineClose } from 'react-icons/ai';
import { useChatMessageStore } from '../../zustand/ChatMessage';
import { checkUrlIsImage } from '../../utils/Functions';
import { IChatRoom, IUser } from '../../pages/api/schema';
import { SocketClient } from '../../utils/SocketClient';
import Auth from '../../utils/Auth';

const StyledTypingIndicator = styled.div`
  
  min-height: 24px;
  max-height: 24px;
  font-size: 16px;

  span{
    font-size: 40px;
    line-height: 0px;
    max-height: 100%;
  }
`;

interface TypingIndicatorProps{
  chatRoom:IChatRoom
}

const TypingIndicator:React.FC<TypingIndicatorProps>=({chatRoom})=>{

  const auth = Auth.getAuth();
  const socketClient = SocketClient.getSocketClient();
  const listener = useRef(null);
  const [usersTyping, setUsersTyping] = useState<IUser[]>([]);

  const initSocketEvent=()=>{
    if(!socketClient.socket) return;
    socketClient.socket.off('getIsTyping', listener.current)
    listener.current = null;
  }
  const listenSocketEvent=async ()=>{
    if(!socketClient.socket){
      await socketClient.init();
    }
    listener.current = socketClient.onGetIsTyping((isTyping, userId)=>{
      setUsersTyping(prev=>{
        const userTyping = chatRoom.users.find(user=>user._id===userId);
        const prevCopy = prev.filter(user=>user._id !== userId)
        if(isTyping && userId!== auth.user?._id){
          return [...prevCopy, userTyping];
        }
        return prevCopy
      })
    })
  }
  
  useEffect(() => {
    
    if(chatRoom){
      initSocketEvent();
      listenSocketEvent();
    }
  
    return () => {
      initSocketEvent();
    }
  }, [chatRoom])
  
  return(
    <StyledTypingIndicator>
      {
        usersTyping?.length>0 &&
        <>
        <Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
        &nbsp;
        {
          usersTyping.map((user,i, arr)=>{
            return <>
            {
              user.username
            }{
              i !== arr.length-1 && ', '
            }
            </>
          })
        } is Typing...
        </>

      }
    </StyledTypingIndicator>
  )
}

export default TypingIndicator