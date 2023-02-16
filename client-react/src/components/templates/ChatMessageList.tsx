import {css} from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import {UIEventHandler, useEffect, useRef} from 'react';
import {IChatMessage, IChatRoom} from '../../pages/api/schema';
import {SocketClient} from '../../utils/SocketClient';
import Header from '../atoms/Header';
import ChatMessage from '../organisms/ChatMessage';
import ChatMessageSender from '../molecules/ChatMessageSender';
import ReplyBar from '../molecules/ReplyBar';
import Auth from '../../utils/Auth';
import AttachmentBar from '../molecules/AttachmentBar';
import {useOnResize} from '../../utils/Hooks';
import TypingIndicator from '../molecules/TypingIndicator';
import Spinner from "../atoms/Spinner";
import {useMessages} from "../../react-query/chatroom";
import {useChatMessageListState} from "../../recoil/ChatMessageList";
import {useQueryClient} from "react-query";
import {GoMention} from "react-icons/all";

const StyledChatMessageList = styled.div`

  position: relative;
  color: ${oc.gray[4]};
  min-height: 100vh;
  background-color: ${oc.gray[7]};
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  flex: 1;
  scroll-behavior: auto;
  padding: 10px;
  padding-bottom: 0;

  h1 {
    border-bottom: 2px solid ${oc.gray[9]};
  }

  .messages {
    * {
      max-width: 100%;
    }

    max-width: 100%;
    padding-bottom: 10px;
    overflow-y: overlay;

    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar {
      width: 8px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: ${oc.gray[9]};
    }
  }

  .bottomSection {
    margin-top: auto;
  }
`;

interface ChatMessageListProps {
    selectedRoom: IChatRoom
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({selectedRoom}) => {

    const auth = Auth.getAuth();
    const socketClient = SocketClient.getSocketClient();
    const queryClient = useQueryClient();
    const {scrollFromBottomForRoom, setScrollFromBottomForRoom} = useChatMessageListState(selectedRoom._id);
    const saveScrollTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
    const messageContainerRef = useRef<HTMLDivElement>(null)
    const messageContainer = messageContainerRef.current as HTMLDivElement;
    const opponent = selectedRoom.type === 'dm' ? selectedRoom.users?.filter(user => user._id !== auth.user?._id)[0] : undefined;

    const listeners = useRef<any[]>([]);
    const {data, isFetching, refetch: refetchMessages, fetchNextPage, isFetchingNextPage} = useMessages(selectedRoom._id);

    document.title = `Dove | ${opponent ? '@' + opponent.username : selectedRoom.name}`;


    const initSocketEvent = () => {
        if (!socketClient.socket) {
            socketClient.init();
        }
        listeners.current.forEach(listener => {
            socketClient.socket?.off('newMessage', listener);
            socketClient.socket?.off('deleteMessage', listener);
            socketClient.socket?.off('editMessage', listener);
        })
        listeners.current = [];
    }

    const listenSocketEvent = async () => {
        if (!socketClient.socket) {
            await socketClient.init();
        }
        listeners.current = [
            socketClient.onNewMessage((newMessage) => {
                if (!newMessage) return;
                if (newMessage.chatRoomId === selectedRoom._id) {
                    if (newMessage.postedBy?._id === auth.user?._id) setScrollFromBottomForRoom(0);
                    else if (messageContainer) setScrollFromBottomForRoom(messageContainer.scrollHeight - messageContainer.scrollTop);
                    queryClient.setQueryData(['messages', selectedRoom._id], (oldData: any) => {
                        const lastPageId = oldData.pages.sort((a, b) => {
                            return new Date(b[0]?.createdAt).getTime() - new Date(a[0]?.createdAt).getTime();
                        })[0][0]._id;
                        oldData.pages = oldData.pages.map(page => {
                            if (page[0]._id === lastPageId) {
                                page.push(newMessage);
                            }
                            return page;
                        })
                        return {...oldData};
                    });
                }
            }),
            socketClient.onDeleteMessage((deletedMessage) => {
                if (!messageContainer) return;
                setScrollFromBottomForRoom(messageContainer.scrollHeight - messageContainer.scrollTop);
                queryClient.setQueryData(['messages', selectedRoom._id], (oldData: any) => {
                    oldData.pages = oldData.pages.map((page: any) => page.filter((message: any) => message._id !== deletedMessage._id));
                    return {...oldData};
                });
            }),
            socketClient.onEditMessage((editedMessage) => {
                const messageContainer = messageContainerRef.current;
                if (messageContainer) {
                    setScrollFromBottomForRoom(messageContainer.scrollHeight - messageContainer.scrollTop);
                }
                queryClient.setQueryData(['messages', selectedRoom._id], (oldData: any) => {
                    oldData.pages.forEach((page: any) => {
                        const idx = page.findIndex((message: any) => message._id === editedMessage._id);
                        if (idx !== -1) page[idx] = editedMessage;
                    });
                    return {...oldData};
                });
            })
        ]

    }
    const flatMessages = data?.pages.sort((a, b) => {
        return new Date(a[0]?.createdAt).getTime() - new Date(b[0]?.createdAt).getTime();
    }).flat() || [];
    const hasNext = data?.pages[data?.pages.length - 1].length > 0;
    const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {
        const {scrollTop, scrollHeight} = messageContainerRef.current as HTMLDivElement;
        saveScrollTimeout.current && clearTimeout(saveScrollTimeout.current);
        saveScrollTimeout.current = setTimeout(() => {
            setScrollFromBottomForRoom(scrollHeight - scrollTop);
        }, 100);
        if (scrollTop < 35 && !isFetchingNextPage && hasNext) {
            setScrollFromBottomForRoom(scrollHeight - scrollTop);
            refetchMessages().then(() => fetchNextPage({pageParam: flatMessages.length}));
        }
    }

    useOnResize(messageContainerRef, (currentHeight, previousHeight) => {
        const messageContainer = messageContainerRef.current;

        if (!isFetching) {
            if (previousHeight - currentHeight > 0 && messageContainer) {
                messageContainer.scrollTop += (previousHeight - currentHeight);
            }
        }

    }, [isFetching])

    useEffect(() => {
        if (selectedRoom) {
            initSocketEvent();
            refetchMessages();
            listenSocketEvent();
            if (messageContainer)
                messageContainer.scrollTop = messageContainer.scrollHeight - scrollFromBottomForRoom;
        }
        return () => {
            initSocketEvent();
        }
    }, [selectedRoom, socketClient.socket])

    useEffect(() => {
        if (flatMessages && messageContainer)
            messageContainer.scrollTop = messageContainer.scrollHeight - scrollFromBottomForRoom;
    }, [flatMessages])

    useEffect(() => {
        if (messageContainer) messageContainer.click();
    }, [scrollFromBottomForRoom])

    // useEffect(() => () => setScrollFromBottomForRoom(messageContainer?.scrollHeight - messageContainer?.scrollTop),[])

    return (
        <StyledChatMessageList>
            <Header size='sm'
                    color={oc.gray[2]}>{opponent ? <><GoMention color={oc.gray[5]}/>&nbsp;{opponent.username}</> : selectedRoom.name}</Header>
            <div className='messages' ref={messageContainerRef} onScroll={handleScroll}>
                <div css={css`
                  width: 100%;
                  height: 50px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                `}>
                    {isFetchingNextPage && <Spinner size={'sm'}/>}
                </div>
                {
                    flatMessages.map((chatMessage: IChatMessage, i: number, arr: IChatMessage[]) => {
                        return (
                            <ChatMessage parentRef={messageContainerRef} chatMessage={chatMessage}
                                         prevMessage={i === 0 ? undefined : arr[i - 1]} isLast={i === arr.length - 1}
                                         key={i}/>
                        )
                    })
                }
            </div>
            <div className="bottomSection">
                <ReplyBar/>
                <AttachmentBar/>
                <ChatMessageSender roomId={selectedRoom._id || ''}/>
            </div>
            <TypingIndicator chatRoom={selectedRoom}/>
        </StyledChatMessageList>
    )
}

export default ChatMessageList