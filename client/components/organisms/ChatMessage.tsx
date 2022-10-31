import { css } from '@emotion/react';
import styled from '@emotion/styled';
import moment from 'moment';
import oc from 'open-color';
import { HTMLAttributes, SetStateAction, Dispatch } from 'react';
import Auth from '../../utils/Auth';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatMessage, IUser } from '../../pages/api/schema';
import Avatar from '../atoms/Avatar';
import ChatMessageMenu from '../molecules/ChatMessageMenu';
import {useState, useEffect}from 'react'
import Input from '../atoms/Input';
import AnchorButton from '../atoms/AnchorButton';
import { useUserInfoPopUpStore } from '../../zustand/PopUp';

const StyledChatMessage = styled.div<{isEditting:boolean}>`

  color :${oc.gray[4]};
  border-radius: .25rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-items: center;
  align-content: center;
  background-color: ${oc.gray[7]};
  padding-left: 58px;
  &.renderNew{
    padding: 0 10px;
    margin-top: 15px;
  }

  &:hover{
    background-color: ${oc.gray[8]};
    .menu{
      display: flex;
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
    &>span{
      font-size: .75em;
      color:${oc.gray[6]};
    }
  }

  input{
    margin: 10px 0;
    width: 100%;
    height: 40px;
  }

  
  .menu{
    display: none;
  }

`;

interface ChatMessageProps extends HTMLAttributes<HTMLDivElement>{
  chatMessage:IChatMessage
  prevMessage:IChatMessage
  setReplyingTo:Dispatch<SetStateAction<IChatMessage>>
} 

const ChatMessage:React.FC<ChatMessageProps> = ({chatMessage, prevMessage, setReplyingTo,...rest})=>{

  const {turnOn:turnUserInfoPopUpOn}=useUserInfoPopUpStore();
  const auth = Auth.getAuth();
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>(chatMessage.message.messageText);

  const completeEditing = ()=>{
    setIsEditing(false);
    chatRoomDB.editMessage(chatMessage._id, messageText);
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
              <Input value={messageText} size={'sm'} color='white' bgcolor={oc.gray[6]} borderColor={oc.gray[6]} enableFocusEffect={false}
              onChange={(e)=>setMessageText(e.target.value)} 
              onKeyDown={(e)=>{
                if(e.key === 'Escape') setIsEditing(false);
                if(e.key === 'Enter') completeEditing();
              }}/>
              <span>escape to <AnchorButton 
              color={oc.blue[5]} onClick={()=>setIsEditing(false)}>cancel</AnchorButton> • enter to <AnchorButton
              color={oc.blue[5]} onClick={completeEditing}>save</AnchorButton></span>
            </>
            :
            <div className='messageText'>
              {messageText} {isModified ? <span>(edited)</span> : <></>}
            </div>
          }
        </>
      </div>
      <ChatMessageMenu className='menu' isMine={chatMessage.postedBy?._id === myId} chatMessage={chatMessage} editMessage={()=>setIsEditing(true)} replyTo={()=>setReplyingTo(chatMessage)}/>
    </StyledChatMessage>
  )
}

export default ChatMessage