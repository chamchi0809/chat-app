import { css } from '@emotion/react';
import styled from '@emotion/styled';
import moment from 'moment';
import oc from 'open-color';
import { HTMLAttributes, useEffect, useState } from 'react';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatMessage, IChatRoom, IUser } from '../../pages/api/schema';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import {FaDove} from 'react-icons/fa'

const StyledChatMessageSender = styled.div`

  background-color: ${oc.gray[8]};
  display: flex;
  color :${oc.gray[4]};
  border-radius: .25rem;
  display: flex;
  align-items: center;
  align-content: center;
  padding: 10px;
  width: 100%;
  bottom: 0;
  box-sizing: border-box;
  
  input{
    width: 90%;
    margin: 0;
    height: 40px;
  }
  button{
    display: flex;
    justify-content: center;
    width: 10%;
    padding: 5px;
    margin: 0 10px;
  }
  & + & {
    margin-top: 1rem;
  }

  span{
    color:${oc.gray[5]};
    b{
      color:${oc.gray[3]};
    }
  }

`;

interface ChatMessageSenderProps extends HTMLAttributes<HTMLDivElement>{
  roomId:string
  replyingTo:string
} 

const ChatMessageSender:React.FC<ChatMessageSenderProps> = ({roomId, replyingTo,...rest})=>{

  const chatRoomDB = ChatRoomDB.getChatRoomDB();
  const [message,setMessage] = useState<string>('');

  const sendMessage = ()=>{
    if(message){
      chatRoomDB.postMessage(roomId, message, replyingTo);
    }
    setMessage('');
  }

  
  return (
    <StyledChatMessageSender
      onKeyDown={(e)=>{
        if(e.key=='Enter'){
          sendMessage();
        }
      }}
      {...rest}>
      <Input size='md' color='white' bgcolor={oc.gray[6]} borderColor={oc.gray[6]} enableFocusEffect={false}
      value={message} onChange={e=>setMessage(e.target.value)}/>
      <Button colorScheme='gray' color={oc.gray[2]} onClick={sendMessage}><FaDove/></Button>
    </StyledChatMessageSender>
  )
}

export default ChatMessageSender