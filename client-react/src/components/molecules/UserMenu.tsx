import {css} from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import {HTMLAttributes, useRef} from 'react';
import ChatRoomDB from '../../utils/ChatRoomDB';
import {useClickOutside} from '../../utils/Hooks';
import Button from '../atoms/Button';
import Auth from '../../utils/Auth';
import {useProfilePopUpState} from "../../recoil/PopUps/ProfilePopUp";
import {useUserMenuPopUpState} from "../../recoil/PopUps/UserMenuPopUp";
import {useFriendState} from "../../recoil/Friend";
import {useNavigate} from "react-router-dom";

const StyledUserMenu = styled.div<{ enabled: boolean, position: [number, number], currentIdx: number }>`

  z-index: ${props => props.currentIdx + 1};
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

const UserMenu: React.FC<UserMenuProps> = ({...rest}) => {

    const navigate = useNavigate();
    const {enabled, position, turnOn, turnOff, user, zIndex: currentIdx} = useUserMenuPopUpState();
    const {turnOn: turnProfilePopUpOn} = useProfilePopUpState();
    const ref = useRef<HTMLDivElement>(null);
    const auth = Auth.getAuth();
    const chatRoomDB = ChatRoomDB.getChatRoomDB();
    const {setFriends} = useFriendState();
    const isFriend = auth.user?.friends.find(friend => friend._id === user?._id);

    const createDM = async () => {
        if (!user) return;
        const result = await chatRoomDB.createNewRoom([user._id], 'dm');
        if (result) {
            const {id} = result;
            navigate(`/chatrooms/${id}`);
        }
    }

    useClickOutside(ref, () => {
        if (!enabled) return;
        turnOff();
    });

    return (
        <StyledUserMenu
            currentIdx={currentIdx}
            position={position}
            enabled={enabled}
            ref={ref}
            {...rest}>
            <Button colorScheme={'gray'} color={oc.white} highlightOffset={3} onClick={() => {
                turnProfilePopUpOn(user);
                turnOff();
            }}>Profile</Button>
            <Button colorScheme={'gray'} color={oc.white} highlightOffset={3} onClick={() => {
                createDM();
                turnOff();
            }}>Message</Button>
            <Button colorScheme={'gray'} color={oc.white} highlightOffset={3} onClick={() => {

            }}>Call</Button>
            {
                isFriend ?
                    <Button colorScheme={'gray'} color={oc.red[5]} highlightOffset={3} onClick={async () => {
                        if (!user) return;
                        setFriends(await auth.deleteFriend(user._id))
                        turnOff();
                    }}>Remove Friend</Button> :
                    <Button colorScheme={'teal'} color={oc.white} highlightOffset={1} onClick={async () => {
                        if (!user) return;
                        setFriends(await auth.addFriend(user._id));
                        turnOff();
                    }}>Add Friend</Button>
            }

        </StyledUserMenu>
    )
}

export default UserMenu