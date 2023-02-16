import {css} from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import {HTMLAttributes, useRef} from 'react';
import ChatRoomDB from '../../utils/ChatRoomDB';
import {useClickOutside} from '../../utils/Hooks';
import Button from '../atoms/Button';
import Auth from '../../utils/Auth';
import {useFriendState} from "../../recoil/Friend";
import {useNavigate} from "react-router-dom";
import {useChatRoomMenuPopUpState} from "../../recoil/PopUps/ChatRoomMenuPopUp";
import Divider from "../atoms/Divider";

const StyledChatRoomMenu = styled.div<{ enabled: boolean, position: [number, number] }>`

  z-index: ${props => 10};
  position: absolute;
  left: ${props => props.position[0] + 'px'};
  top: ${props => props.position[1] + 'px'};
  display: flex;
  flex-direction: column;
  background-color: ${oc.gray[9]};
  padding: 1rem 1rem;

  border-radius: 12px;
  transition-property: opacity, transform;
  transition-duration: .2s;

  button {
    width: 100%;
    align-self: flex-end;
    transition: all 0s;
  }

  ${props =>
          props.enabled ?
                  css`
                    opacity: 100%;
                  `
                  :
                  css`
                    opacity: 0%;
                    transform: translateY(10%);
                    pointer-events: none;
                  `
  }
`;

interface UserMenuProps extends HTMLAttributes<HTMLDivElement> {

}

const ChatRoomMenu = ({...rest}) => {

    const navigate = useNavigate();
    const {enabled, position, turnOn, turnOff, chatRoom} = useChatRoomMenuPopUpState();
    const ref = useRef<HTMLDivElement>(null);
    const auth = Auth.getAuth();
    const chatRoomDB = ChatRoomDB.getChatRoomDB();
    const {setFriends} = useFriendState();


    useClickOutside(ref, () => {
        if (!enabled) return;
        turnOff();
    });

    return (
        <StyledChatRoomMenu
            position={position}
            enabled={enabled}
            ref={ref}
            {...rest}>
            <Button colorScheme={'gray'} color={oc.white} highlightOffset={3} onClick={() => {
                turnOff();
            }}>Invite</Button>
            <Button colorScheme={'gray'} color={oc.white} highlightOffset={3} onClick={() => {
                turnOff();
            }}>Change Icon</Button>
            <Divider bgcolor={oc.gray[7]}/>
            <Button colorScheme={'gray'} color={oc.red[5]} highlightOffset={3} onClick={async () => {
                turnOff();
            }}>Leave Room</Button>

        </StyledChatRoomMenu>
    )
}

export default ChatRoomMenu