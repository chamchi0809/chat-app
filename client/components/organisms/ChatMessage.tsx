import { css } from '@emotion/react';
import styled from '@emotion/styled';
import moment from 'moment';
import oc from 'open-color';
import Auth from '../../utils/Auth';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatMessage, IUser } from '../../pages/api/schema';
import Avatar from '../atoms/Avatar';
import ChatMessageMenu from '../molecules/ChatMessageMenu';
import {useState, useEffect, useLayoutEffect,DetailedHTMLProps,forwardRef,HTMLAttributes, useRef, MutableRefObject}from 'react'
import Input from '../atoms/Input';
import AnchorButton from '../atoms/AnchorButton';
import { useImagePopUpStore, useUserInfoPopUpStore } from '../../zustand/PopUp';
import Textarea from '../atoms/Textarea';
import { useChatMessageStore } from '../../zustand/ChatMessage';
import { IntersectionPos, useOnScreen } from '../../utils/Hooks';
import { checkUrlIsImage } from '../../utils/Functions';
import Image from 'next/image'
import FileAttachment from '../molecules/FileAttachment';

const StyledChatMessage = styled.div<{isEditting:boolean, rows:number}>`

  color :${oc.gray[4]};
  border-radius: .25rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-items: flex-start;
  align-content: flex-start;
  background-color: ${oc.gray[7]};
  padding-left: 58px;
  &.renderNew{
    padding: 0 10px;
    margin-top: 15px;
  }

  .menu{
    display: none;
  }

  &:hover{
    background-color: ${oc.gray[8]};
    .menu{
      display: flex;
    }
    .fileAttachment{
      background-color: ${oc.gray[9]};
    }
  }

  ${props=>props.isEditting && css`
    background-color: ${oc.gray[8]};
  `}

  .replyInfo{
    user-select: none;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    .replyAvatar{
      margin-left: 5px;
    }
    .replyUsername{
      margin-left: 5px;
      color:${oc.gray[4]};
    }
    .replyMessage{
      margin-left: 5px;
      
    }
  }
  
  .messageInfo{
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items:flex-start;
    width: calc(100% - 100px);
    &>span{
      margin-bottom: 7px;
      color:${oc.gray[5]};
      b{
        color:${oc.gray[3]};
      }
    }
  }

  .messageText{
    display:inline;
    white-space:pre-line;
    &>span{
      font-size: .75em;
      color:${oc.gray[6]};
    }
  }

  .messageAttachment{
    img{
      object-fit:contain;
      cursor: pointer;
    }
  }

  textarea{
    margin: 10px 0;
    width: 100%;
    height: 40px;
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

  

`;

interface ChatMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
  chatMessage:IChatMessage
  prevMessage:IChatMessage
  parentRef:MutableRefObject<HTMLElement>
  isLast:boolean
} 

const ChatMessage: React.FC<ChatMessageProps> =({chatMessage, prevMessage, parentRef,isLast,...rest})=>{

  const {messageEditing, setMessageEditing, attachment, replyingTo, messageToSend} = useChatMessageStore();
  const {turnOn:turnUserInfoPopUpOn}=useUserInfoPopUpStore();
  const {turnOn:turnImagePopUpOn} = useImagePopUpStore();
  const auth = Auth.getAuth();
  const ref = useRef<HTMLDivElement>(null);
  const chatRoomDB = ChatRoomDB.getChatRoomDB();
  const toMoment = moment(chatMessage.createdAt);
  const toPrevMoment = moment(prevMessage?.createdAt);
  const isToday = toMoment.isSame(new Date(), "day");
  const isYesterday = toMoment.isSame(moment().subtract(1, 'day'),'day');
  const isDiffAuthor = chatMessage.postedBy?._id !== prevMessage?.postedBy?._id;
  const isModified = chatMessage.createdAt !== chatMessage.updatedAt;
  const renderNew = !!(isDiffAuthor ||
  toMoment.diff(toPrevMoment, 'minutes') > 5
  ||chatMessage.replyingTo._id);

  const [myId, setMyId] = useState<string>('');
  const isEditing = chatMessage._id === messageEditing;
  const [scrolled, setScrolled] = useState(false);
  const [messageText, setMessageText] = useState<string>(chatMessage.message.messageText);
  const [rows,setRows] = useState<number>(1);
  
  const {isIntersecting:onScreen, intersectionPos} = useOnScreen(ref, parentRef);

  const scrollToThis = (pos:IntersectionPos) =>{
    if(!onScreen){
      ref.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
      });
      setScrolled(true);
    }
  }

  useLayoutEffect(()=>{
    setRows(messageText.split('\n').length);
  },[messageText])

  useEffect(()=>{
    if(isEditing && !scrolled) {
      scrollToThis(intersectionPos);
    }
    else {
      setScrolled(false);
    };
  },[messageEditing, onScreen])

  const completeEditing = ()=>{
    setMessageEditing('');
    chatRoomDB.editMessage(chatMessage._id, {
      messageText:messageText,
      attachmentUrl:chatMessage.message.attachmentUrl,
    });
  }

  useEffect(() => {
    if(auth.user){
      setMyId(auth.user._id);
    }
  }, [auth.user])

  useEffect(()=>{
    setMessageText(chatMessage.message.messageText);
  },[chatMessage.message.messageText])

  return (
    <StyledChatMessage 
      ref={ref}
      rows={rows}
      isEditting={isEditing}
      className={renderNew && 'renderNew'}
      {...rest}>
      {
        chatMessage.replyingTo._id &&
        <>
          <div className="replyInfo">
            ↱ <Avatar className='replyAvatar'
            size='xs' imageUrl={chatMessage.replyingTo.postedBy.profileImage}/>
            <AnchorButton className='replyUsername'
            onClick={(e)=>turnUserInfoPopUpOn([e.clientX, e.clientY], chatMessage.replyingTo?.postedBy)}
            >{chatMessage.replyingTo.postedBy.username}</AnchorButton>
            <AnchorButton className='replyMessage' enableUnderline={false} highlightColor={oc.gray[2]} color={oc.gray[5]}>{chatMessage.replyingTo.message.messageText}</AnchorButton>
          </div>
          <div css={css`width:100%;`}/>
        </>
      }
      {
        renderNew && 
        <Avatar
        size='md' imageUrl={chatMessage.postedBy?.profileImage}
        onClick={(e)=>turnUserInfoPopUpOn([e.clientX, e.clientY], chatMessage.postedBy)}
        />
      }
      <div className='messageInfo'>
        <>
          {
            renderNew &&
            <span>
              <AnchorButton onClick={(e)=>turnUserInfoPopUpOn([e.clientX, e.clientY], chatMessage.postedBy)}><b>{chatMessage.postedBy?.username}</b></AnchorButton>
              &nbsp;
              <span>
                {
                isYesterday ? 
                'Yesterday at '+toMoment.format('HH:mm')
                :
                isToday ?  
                'Today at '+toMoment.format('HH:mm')
                :
                toMoment.format('YYYY.MM.DD')
                }
              </span>
            </span>
          }
        </>
        <>
          {
            isEditing?
            <>
              <Textarea size='md' color='white' bgcolor={oc.gray[6]} borderColor={oc.gray[6]} enableFocusEffect={false}
              value={messageText} onChange={e=>setMessageText(e.target.value)} onKeyDown={e=>{
                  if(!e.shiftKey && e.key==='Enter') e.preventDefault()
                  if(e.key === 'Escape') setMessageEditing('');
                  if(e.key === 'Enter' && !e.shiftKey) completeEditing();
                }
                
              }/>
              <span>escape to <AnchorButton 
              color={oc.blue[5]} onClick={()=>setMessageEditing('')}>cancel</AnchorButton> • enter to <AnchorButton
              color={oc.blue[5]} onClick={completeEditing}>save</AnchorButton></span>
            </>
            :
            <div className='messageText'>
              {messageText} {isModified ? <span>(edited)</span> : <></>}
            </div>
          }
          {
            chatMessage.message.attachmentUrl && <div className="messageAttachment">
              {
                checkUrlIsImage(chatMessage.message.attachmentUrl) ? 
                <img src={chatMessage.message.attachmentUrl} height={300} onClick={()=>turnImagePopUpOn(chatMessage.message.attachmentUrl)}/> :
                <FileAttachment attachmentUrl={chatMessage.message.attachmentUrl}/>
              }
            </div>
          }
        </>
      </div>
      <ChatMessageMenu className='menu' isMine={chatMessage.postedBy?._id === myId} chatMessage={chatMessage}/>
    </StyledChatMessage>
  )
}

export default ChatMessage