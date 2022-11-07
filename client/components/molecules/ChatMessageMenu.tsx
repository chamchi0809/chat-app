import { css } from '@emotion/react';
import styled from '@emotion/styled';

import oc from 'open-color';
import { HTMLAttributes } from 'react';
import {AiFillDelete, AiFillEdit} from 'react-icons/ai'
import {ImReply} from 'react-icons/im';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatMessage } from '../../pages/api/schema';
import ChatMessageMenuButton from '../atoms/ChatMessageMenuButton';
import { useChatMessageStore } from '../../zustand/ChatMessage';

const StyledChatMessageMenu = styled.div`
  
  position: absolute;
  right:10px;
  bottom:100%;

  transform: translateY(50%);
`;

interface ChatMessageMenuProps extends HTMLAttributes<HTMLDivElement>{
  isMine:boolean
  chatMessage:IChatMessage
}

const ChatMessageMenu:React.FC<ChatMessageMenuProps> = ({isMine, chatMessage,...rest})=>{

  const {setReplyingTo, setMessageEditing} = useChatMessageStore();
  const chatRoomApi = ChatRoomDB.getChatRoomDB();

  return (
    <StyledChatMessageMenu 
      {...rest}>
      <ChatMessageMenuButton
      color={oc.gray[4]}
      onClick={()=>setReplyingTo(chatMessage)}
      ><ImReply/></ChatMessageMenuButton>
      {
        isMine && 
        <>
          <ChatMessageMenuButton
          color={oc.gray[4]}
          onClick={()=>setMessageEditing(chatMessage._id)}
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