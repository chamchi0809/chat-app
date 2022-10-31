import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import {Dispatch, SetStateAction, useEffect, useRef} from 'react';
import oc from 'open-color';
import { IChatRoom } from '../../pages/api/schema';
import {useState} from 'react'
import Button from '../atoms/Button';
import Header from '../atoms/Header';
import ChatRoom from '../molecules/ChatRoom';
import {FaPlus} from 'react-icons/fa'
import { css } from '@emotion/react';
import CreateChatRoomMenu from '../molecules/CreateChatRoomMenu';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { SocketClient } from '../../utils/SocketClient';
import { useChatRoomStore } from '../../zustand/ChatRoom';
import moment from 'moment';
import { useCreateRoomPopUpStore } from '../../zustand/PopUp';

const StyledChatRoomList = styled.div`

  color :${oc.gray[4]};
  width: 280px;
  min-height: 100vh;
  background-color: ${oc.gray[8]};
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0 10px;

  overflow-y: hidden;
  &:hover{
    overflow-y: overlay;
  }
  &::-webkit-scrollbar-track
  {
    background-color: rgba(0,0,0,0);
  }

  &::-webkit-scrollbar
  {
    width: 8px;
    background-color: rgba(0,0,0,0);
  }

  &::-webkit-scrollbar-thumb
  {
    border-radius: 6px;
    background-color: ${oc.gray[9]};
  }
`;

interface ChatRoomListProps{

} 

const ChatRoomList:React.FC<ChatRoomListProps> = ({})=>{
  
  const router = useRouter();
  const {turnOn:turnCreateRoomOn, position} = useCreateRoomPopUpStore(state=>state);
  const socketClient = SocketClient.getSocketClient();
  const {chatRooms,loadChatRooms}=useChatRoomStore();
  const listeners = useRef([]);

  const initSocketEvent=()=>{
    if(!socketClient.socket) return;
    listeners.current.forEach(listener=>{
      socketClient.socket.off('newRoom',listener);
      socketClient.socket.off('deleteRoom',listener);
      socketClient.socket.off('newMessage',listener);
      socketClient.socket.off('deleteMessage',listener);
      socketClient.socket.off('editMessage',listener);
    })
    listeners.current = [];
  }

  const subscribeRooms=async()=>{
    if(!socketClient.socket){
      await socketClient.init();
    }
    chatRooms?.forEach((chatRoom)=>{
      socketClient.subscribeRoom(chatRoom._id);
    })
    listeners.current.push(
      socketClient.onNewRoom(()=>{
        loadChatRooms();
      })
    )
    listeners.current.push(
      socketClient.onDeleteRoom(()=>{
        loadChatRooms();
      })
    );
    listeners.current.push(
      socketClient.onNewMessage(()=>{
        loadChatRooms();
      })
    );
    listeners.current.push(
      socketClient.onEditMessage(()=>{
        loadChatRooms();
      })
    );
    listeners.current.push(
      socketClient.onDeleteMessage(()=>{
        loadChatRooms();
      })
    );
  }

  useEffect(()=>{
    loadChatRooms();
  },[])

  useEffect(()=>{
    initSocketEvent();
    subscribeRooms();
    return()=>{
      initSocketEvent();
    }
  },[chatRooms])

  return (
    <StyledChatRoomList>
      <Header size='sm' color={oc.gray[2]}
      css={css`
        display: flex;
        align-items: center;
        padding: 0px;
        padding-bottom: 10px;
      `}
      >Chat Rooms <Button color='white' size='sm' colorScheme={'gray'} css={css`
          margin-left: 15px;
          padding: 5px;
          font-weight: bold;
        `}
        onClick={(e)=>turnCreateRoomOn([e.clientX, e.clientY])}
      ><FaPlus/></Button></Header>
      {
        chatRooms?.map((chatRoom, i)=>{
          return(
            <ChatRoom chatRoom={chatRoom} key={i} selected={chatRoom._id===router.query?.roomId} onClick={()=>{
              router.push(`/chatrooms/${chatRoom._id}`);
            }}/>
          )
        })
      }
    </StyledChatRoomList>
  )
}

export default ChatRoomList