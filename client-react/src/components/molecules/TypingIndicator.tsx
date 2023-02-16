import React, {useEffect, useRef, useState} from 'react';

import {Dot} from 'react-animated-dots'
import styled from '@emotion/styled';
import {IChatRoom, IUser} from '../../pages/api/schema';
import {SocketClient} from '../../utils/SocketClient';
import Auth from '../../utils/Auth';

const StyledTypingIndicator = styled.div`

  min-height: 24px;
  max-height: 24px;
  font-size: 16px;

  span {
    font-size: 40px;
    line-height: 0px;
    max-height: 100%;
  }
`;

interface TypingIndicatorProps {
    chatRoom: IChatRoom | undefined;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({chatRoom}) => {

    const auth = Auth.getAuth();
    const socketClient = SocketClient.getSocketClient();
    const listener = useRef<any>();
    const [usersTyping, setUsersTyping] = useState<IUser[]>([]);

    const initSocketEvent = () => {
        if (!socketClient.socket) return;
        socketClient.socket.off('getIsTyping', listener.current)
        listener.current = undefined;
    }
    const listenSocketEvent = async () => {
        if (!socketClient.socket) {
            await socketClient.init();
        }
        listener.current = socketClient.onGetIsTyping((isTyping, room, typingInfo) => {
            if (room !== chatRoom?._id) return;
            setUsersTyping(typingInfo.filter(info => info !== auth.user?._id).map((info) => {
                return chatRoom.users.find((user) => user._id === info) as IUser;
            }));
        })
    }

    useEffect(() => {

        if (chatRoom) {
            initSocketEvent();
            listenSocketEvent();
            setUsersTyping([]);
        }

        return () => {
            initSocketEvent();
        }
    }, [chatRoom])

    return (
        <StyledTypingIndicator>
            {
                usersTyping?.length > 0 &&
                <>
                    <Dot>.</Dot>
                    <Dot>.</Dot>
                    <Dot>.</Dot>
                    &nbsp;
                    {
                        usersTyping.length < 5 ?
                            usersTyping.map((user, i, arr) => {
                                return <>
                                    {
                                        user?.username
                                    }
                                    {
                                        i !== arr.length - 1 && ', '
                                    }
                                </>
                            }) : 'many people'
                    } is Typing...
                </>

            }
        </StyledTypingIndicator>
    )
}

export default TypingIndicator