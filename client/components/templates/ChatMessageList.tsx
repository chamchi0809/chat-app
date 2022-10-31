import { css } from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import { HTMLAttributes, UIEvent, UIEventHandler, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatMessage, IChatRoom } from '../../pages/api/schema';
import { lerp } from '../../utils/MathHelper';
import { SocketClient } from '../../utils/SocketClient';
import Header from '../atoms/Header';
import ChatMessage from '../organisms/ChatMessage';
import ChatMessageSender from '../molecules/ChatMessageSender';
import ReplyBar from '../molecules/ReplyBar';
import Auth from '../../utils/Auth';

const StyledChatMessageList = styled.div`

  position: relative;
  color :${oc.gray[4]};
  min-height: 100vh;
  background-color: ${oc.gray[7]};
  display: flex;
  flex-direction: column;
  
  flex: 1;
  scroll-behavior: auto;
  padding: 10px;

  h1{
    border-bottom: 2px solid ${oc.gray[9]};
    
  }

  .messages{
    padding-bottom: 10px;
    overflow-y: overlay;
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
  }

  .bottomSection{
    margin-top: auto;
  }
`;

interface ChatMessageListProps{
  selectedRoom:IChatRoom
} 

const ChatMessageList:React.FC<ChatMessageListProps> = ({selectedRoom})=>{
  
  const auth = Auth.getAuth();
  const chatRoomDB = ChatRoomDB.getChatRoomDB();
  const socketClient = SocketClient.getSocketClient();
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const opponent = selectedRoom?.type === 'dm' && selectedRoom?.users?.filter(user=>user._id !== auth.user?._id)[0]

  const [chatMessages, setChatMessages]=useState<IChatMessage[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [scrollFromBottom, setScrollFromBottom] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [replyingTo, setReplyingTo] = useState<IChatMessage>(null);

  const listeners = useRef([]);

  const loadChatMessages=useCallback(async (page:number, limit:number)=>{
    
    if(!selectedRoom) return;
    const chatMessageData = (await chatRoomDB.loadMessages(selectedRoom._id, page, limit)).conversation;
    setIsFetching(false);
    if(chatMessageData?.length === 0) {
      setHasNext(false)
      return;
    };

    setChatMessages(prev=> {
      if(prev.length > 0){
        prev.unshift(...chatMessageData);
        return [...prev];
      }
      return prev.concat(chatMessageData)
    });
    const messageContainer = messageContainerRef.current;
    setScrollFromBottom(messageContainer.scrollHeight - messageContainer.scrollTop);
  },[selectedRoom])

  const initSocketEvent=()=>{
    if(!socketClient.socket) return;
    listeners.current.forEach(listener=>{
      socketClient.socket.off('newMessage',listener);
      socketClient.socket.off('deleteMessage',listener);
      socketClient.socket.off('editMessage',listener);
    })
    listeners.current = [];
  }

  const listenSocketEvent=async ()=>{
    if(!socketClient.socket){
      await socketClient.init();
    }
    listeners.current.push(
      socketClient.onNewMessage((message)=>{
        const messageContainer = messageContainerRef.current;
        if(!message) return;
        const newMessage:IChatMessage = message.message;
        if(newMessage.chatRoomId === selectedRoom._id){
          if(newMessage.postedBy._id === auth?.user._id) setScrollFromBottom(0);
          else setScrollFromBottom(messageContainer.scrollHeight - messageContainer.scrollTop);
          setChatMessages(prev=>prev.concat(newMessage));
        }
      })
    )
    listeners.current.push(
      socketClient.onDeleteMessage((deletedMessage)=>{
        const messageContainer = messageContainerRef.current;
        setScrollFromBottom(messageContainer.scrollHeight - messageContainer.scrollTop);
        setChatMessages(prev=>prev.filter(message=>message._id !== deletedMessage._id))
      })
    )
    listeners.current.push(
      socketClient.onEditMessage((edittedMessage)=>{
        const messageContainer = messageContainerRef.current;
        setScrollFromBottom(messageContainer.scrollHeight - messageContainer.scrollTop);
        setChatMessages(prev=>{
          const newMessages = [...prev];
          newMessages[newMessages.findIndex(message=>message._id===edittedMessage._id)] = edittedMessage;
          return newMessages;
        })
      })
    )
  }

  const handleScroll:UIEventHandler<HTMLDivElement>=(event)=>{
    const {scrollTop} = messageContainerRef.current;

    if(scrollTop<35){
      setIsFetching(true);
    }
  }

  useEffect(()=>{
    if(selectedRoom){
      setChatMessages([]);
      initSocketEvent();
      setIsFetching(true);
      setIsFirstLoad(true);
      setHasNext(true);
      listenSocketEvent();
    }
    return ()=>{
      initSocketEvent();
    }
  },[selectedRoom])

  

  useEffect(()=>{
    if(isFetching && hasNext) loadChatMessages(chatMessages.length, 40);
    else if(isFetching) setIsFetching(false);
  },[isFetching])

  useEffect(()=>{
    const messageContainer = messageContainerRef.current;
    if(isFirstLoad && chatMessages.length>0){
      messageContainer.scrollTop = messageContainer.scrollHeight;
      setIsFirstLoad(false);
    }
    if(!isFirstLoad){
      messageContainer.scrollTop = messageContainer.scrollHeight - scrollFromBottom;
    }
  },[chatMessages])

  useEffect(()=>{
    const messageContainer = messageContainerRef.current;
    messageContainer.scrollTop = messageContainer.scrollHeight;
  },[replyingTo])

  return (
    <StyledChatMessageList >
      <Header size='sm' color={oc.gray[2]}>{selectedRoom?.type==='group' ? selectedRoom?.name : opponent?.username}</Header>
      <div className='messages' ref={messageContainerRef} onScroll={handleScroll}>
        <div css={css`
          width: 100%;
          height: 50px;
        `}/>
        {
          hasNext && <></>
        }
        {
          chatMessages?.map((chatMessage, i, arr)=>{
            return(
              <ChatMessage chatMessage={chatMessage} prevMessage={i === 0 ? null : arr[i-1]} setReplyingTo={setReplyingTo} key={i}/>
            )
          })
        }
      </div>
      <div className="bottomSection">
        {
          replyingTo &&
          <ReplyBar replyingTo={replyingTo?.postedBy?.username} cancelReply={()=>setReplyingTo(null)}/>
        }
        <ChatMessageSender roomId={selectedRoom?._id} replyingTo={replyingTo?._id}/>
      </div>
    </StyledChatMessageList>
  )
}

export default ChatMessageList