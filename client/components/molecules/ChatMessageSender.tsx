import { css } from '@emotion/react';
import styled from '@emotion/styled';
import moment from 'moment';
import oc from 'open-color';
import { HTMLAttributes, useState, useLayoutEffect, useEffect, useRef } from 'react';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatMessage, IChatRoom, IUser } from '../../pages/api/schema';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import {FaDove, FaPlus} from 'react-icons/fa'
import Textarea from '../atoms/Textarea';
import { useChatMessageStore } from '../../zustand/ChatMessage';
import Uploader from '../../utils/Uploader';

const StyledChatMessageSender = styled.div<{rows:number}>`

  background-color: ${oc.gray[8]};
  display: flex;
  color :${oc.gray[4]};
  border-radius: .25rem;
  display: flex;
  align-items: flex-start;
  align-content: center;
  padding: 10px;
  width: 100%;
  bottom: 0;
  box-sizing: border-box;
  
  textarea{
    width: 90%;
    margin: 0;
    padding-top: 10px;
    line-height: 20px;
    height: ${props=>40+(props.rows-1)*20+2+'px'};
    min-height: 40px;
    max-height: 200px;
    overflow-y: overlay;
    &::-webkit-scrollbar-track
    {
      background-color: rgba(0,0,0,0);
    }

    &::-webkit-scrollbar
    {
      width: 6px;
      background-color: rgba(0,0,0,0);
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 6px;
      background-color: ${oc.gray[9]};
    }
  }
  button{
    display: flex;
    justify-content: center;
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
} 

const ChatMessageSender:React.FC<ChatMessageSenderProps> = ({roomId, ...rest})=>{


  const chatRoomDB = ChatRoomDB.getChatRoomDB();
  const uploader = Uploader.getUploader();
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {messageToSend, setMessageToSend, attachment, setAttachment,replyingTo} = useChatMessageStore();
  
  const [rows,setRows] = useState<number>(1);

  useLayoutEffect(()=>{
    setRows(messageToSend.split('\n').length);
  },[messageToSend])
  const sendMessage = async()=>{
    if(messageToSend || attachment){
      chatRoomDB.postMessage(roomId, {
        messageText: messageToSend.trim(), 
        attachmentUrl: attachment ? (await uploader.uploadAttachment(attachment, roomId)) : '',
      }, replyingTo?._id);
    }
    setMessageToSend('');
    setAttachment(null);
  }

  useEffect(() => {
    const dataTranster = new DataTransfer();
    if(attachment){
      dataTranster.items.add(attachment);
    }
    fileInputRef.current.files = dataTranster.files;
  }, [attachment])
  

  
  return (
    <StyledChatMessageSender
      rows={rows}
      onKeyDown={(e)=>{
        if(e.key=='Enter'){
          if(e.shiftKey){
            setRows(prev=>prev+1);
          }else{
            sendMessage();
          }
        }
      }}
      {...rest}>
      <Button colorScheme='gray' highlightOffset={1} color={oc.gray[2]} onClick={()=>fileInputRef.current.click()} css={css`
        padding: 0;
      `}><FaPlus/></Button>
      <Textarea size='md' color='white' bgcolor={oc.gray[7]} borderColor={oc.gray[7]} enableFocusEffect={false}
      value={messageToSend} onChange={e=>setMessageToSend(e.target.value)} onKeyDown={e=>{
        if(!e.shiftKey && e.key==='Enter') e.preventDefault()}
      }/>
      <Button colorScheme='gray' highlightOffset={1} color={oc.gray[2]} onClick={sendMessage}><FaDove/></Button>
      <input type="file" css={{display:'none'}} ref={fileInputRef}  onChange={e=>{
        setAttachment(e.target.files[0]);
      }}/>
    </StyledChatMessageSender>
  )
}

export default ChatMessageSender