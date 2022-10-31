import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import oc from 'open-color';
import { HTMLAttributes, useEffect, useState, useRef } from 'react';
import { AiOutlineClose, AiOutlineUsergroupAdd } from 'react-icons/ai';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatMessage, IChatRoom, IUser } from '../../pages/api/schema';
import { SocketClient } from '../../utils/SocketClient';
import Avatar from '../atoms/Avatar';
import Auth from '../../utils/Auth';
import UserDB from '../../utils/UserDB';

const StyledChatRoom = styled.div<{selected:boolean}>`

  color :${oc.gray[4]};
  border-radius: .25rem;
  width: 100%;
  display: flex;
  min-width: 0;
  align-items: center;
  background-color: ${oc.gray[8]};
  padding: 10px;
  user-select: none;
  margin-top: .25rem;
  cursor: pointer;

  &:hover{
    background-color: ${oc.gray[9]};
    .deleteButton{
      display:inherit;
    }
  }
  &:active{
    background-color: ${oc.gray[7]};
  }

  ${props=>props.selected && css`
    background-color: ${oc.gray[9]};
  `};

  .roomInfo{
    overflow:hidden;
    margin-left: 10px;
    width:calc(80%);
    display: flex;
    flex-direction: column;
    white-space:nowrap;
    text-overflow: ellipsis;
    display:block;
    
    margin: 0 5px 0 5px;
    
  }
  
  .deleteButton{
    display:none;
    color:${oc.gray[6]};
    font-size:24px;
    &:hover{
      color:${oc.gray[3]}
    }
  }

`;

interface ChatRoomProps extends HTMLAttributes<HTMLDivElement>{
  chatRoom:IChatRoom
  selected:boolean
} 

const ChatRoom:React.FC<ChatRoomProps> = ({chatRoom, selected, ...rest})=>{
  const router = useRouter();
  const auth = Auth.getAuth();
  const userDB = UserDB.getUserDB();
  const chatRoomDB = ChatRoomDB.getChatRoomDB();
  const opponent = chatRoom.type !== 'group' && chatRoom.users?.filter(user=>user._id !== auth.user?._id)[0]

  return (
    <StyledChatRoom 
      selected={selected}
      {...rest}>
      <Avatar size='sm' imageUrl={chatRoom.type==='group' ? 'http://localhost:5000/images/defaultAvatar.png' : opponent?.profileImage}/>
      <div className='roomInfo'>
        <b>{chatRoom.type === 'group' ? chatRoom.name : opponent?.username}</b><br/>
        {chatRoom.recentMessage?.message.messageText}
      </div>
      <AiOutlineClose className='deleteButton' onClick={(e)=>{
        e.stopPropagation();
        e.preventDefault();
        chatRoomDB.deleteRoom(chatRoom._id);
        if(selected){
          router.push('/chatrooms/');
        }
      }}/>
    </StyledChatRoom>
  )
}

export default ChatRoom