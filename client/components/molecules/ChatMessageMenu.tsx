import { css } from '@emotion/react';
import styled from '@emotion/styled';

import oc from 'open-color';
import { HTMLAttributes } from 'react';
import {AiFillDelete, AiFillEdit} from 'react-icons/ai'
import {ImReply} from 'react-icons/im';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatMessage } from '../../pages/api/schema';
import ChatMessageMenuButton from '../atoms/ChatMessageMenuButton';

const StyledChatMessageMenu = styled.div`
  
  position: absolute;
  right:10px;
  bottom:100%;

  transform: translateY(50%);
`;

interface ChatMessageMenuProps extends HTMLAttributes<HTMLDivElement>{
  isMine:boolean
  chatMessage:IChatMessage
  editMessage:()=>void
  replyTo:()=>void
}

const ChatMessageMenu:React.FC<ChatMessageMenuProps> = ({isMine, chatMessage,editMessage, replyTo,...rest})=>{

  const chatRoomApi = ChatRoomDB.getChatRoomDB();

  return (
    <StyledChatMessageMenu 
      {...rest}>
      <ChatMessageMenuButton
      color={oc.gray[4]}
      onClick={replyTo}
      ><ImReply/></ChatMessageMenuButton>
      {
        isMine && 
        <>
          <ChatMessageMenuButton
          color={oc.gray[4]}
          onClick={editMessage}
          ><AiFillEdit/></ChatMessageMenuButton>

          <ChatMessageMenuButton
          color={oc.red[8]}
          onClick={()=>chatRoomApi.deleteMessage(chatMessage._id)}
          ><AiFillDelete/></ChatMessageMenuButton>
        </>
      }
    </StyledChatMessageMenu>
  )
}

export default ChatMessageMenu