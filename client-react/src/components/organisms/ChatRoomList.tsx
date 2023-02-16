import styled from '@emotion/styled';
import {useEffect, useRef} from 'react';
import oc from 'open-color';
import Button from '../atoms/Button';
import Header from '../atoms/Header';
import ChatRoom from '../molecules/ChatRoom';
import {FaPlus} from 'react-icons/fa'
import {css} from '@emotion/react';
import {SocketClient} from '../../utils/SocketClient';
import {useCreateRoomPopUpState} from "../../recoil/CreateRoomPopUp";
import {useNavigate, useParams} from "react-router-dom";
import {useRooms} from "../../react-query/chatroom";
import Auth from "../../utils/Auth";

const StyledChatRoomList = styled.div`

  color: ${oc.gray[4]};
  width: 280px;
  min-height: 100vh;
  background-color: ${oc.gray[8]};
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0 10px;

  overflow-y: hidden;

  &:hover {
    overflow-y: overlay;
  }

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
`;

const ChatRoomList = ({}) => {

    const auth = Auth.getAuth();
    const navigate = useNavigate();
    const {roomId} = useParams()
    const socketClient = SocketClient.getSocketClient();
    const {turnOn: turnCreateRoomOn} = useCreateRoomPopUpState();
    const {isLoading, isError, isFetching, data: chatRooms, refetch: loadChatRooms} = useRooms();

    const listeners = useRef<any[]>([]);

    const initSocketEvent = () => {
        if (!socketClient.socket) return;
        listeners.current.forEach(listener => {
            socketClient.socket?.off('newRoom', listener);
            socketClient.socket?.off('deleteRoom', listener);
            socketClient.socket?.off('exitRoom', listener)
            socketClient.socket?.off('newMessage', listener);
            socketClient.socket?.off('deleteMessage', listener);
            socketClient.socket?.off('editMessage', listener);
        })
        listeners.current = [];
    }

    const subscribeRooms = async () => {
        if (!socketClient.socket) {
            await socketClient.init();
        }
        chatRooms?.forEach((chatRoom) => {
            socketClient.subscribeRoom(chatRoom._id);
        })
        listeners.current = [
            socketClient.onNewRoom(() => {
                loadChatRooms();
            }),
            socketClient.onDeleteRoom(() => {
                loadChatRooms();
            }),
            socketClient.onNewMessage(() => {
                loadChatRooms();
            }),
            socketClient.onEditMessage(() => {
                loadChatRooms();
            }),
            socketClient.onDeleteMessage(() => {
                loadChatRooms();
            }),
            socketClient.onExitRoom(() => {
                loadChatRooms();
            })
        ]
    }

    useEffect(() => {
        initSocketEvent();
        subscribeRooms();
        return () => {
            initSocketEvent();
        }
    }, [chatRooms])

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
                                onClick={(e) => turnCreateRoomOn([e.clientX, e.clientY])}
            ><FaPlus/></Button></Header>
            {
                chatRooms?.map((chatRoom, i) => {
                    return (
                        <ChatRoom chatRoom={chatRoom} key={i} selected={chatRoom._id === roomId}
                                  onClick={() => {
                                      navigate(`/chatrooms/${chatRoom._id}`);
                                  }}/>
                    )
                })
            }
        </StyledChatRoomList>
    )
}

export default ChatRoomList