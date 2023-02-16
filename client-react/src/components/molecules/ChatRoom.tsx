import {css} from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import {HTMLAttributes} from 'react';
import {AiOutlineClose} from 'react-icons/ai';
import ChatRoomDB from '../../utils/ChatRoomDB';
import {IChatRoom} from '../../pages/api/schema';
import Avatar from '../atoms/Avatar';
import Auth from '../../utils/Auth';
import {getFileInfo} from '../../utils/FileInfo';
import {useNavigate} from "react-router-dom";
import {useUserMenuPopUpState} from "../../recoil/PopUps/UserMenuPopUp";
import {useChatRoomMenuPopUpState} from "../../recoil/PopUps/ChatRoomMenuPopUp";

const StyledChatRoom = styled.div<{ selected: boolean }>`

  color: ${oc.gray[4]};
  border-radius: .25rem;
  width: 100%;
  display: flex;
  min-width: 0;
  align-items: center;
  background-color: ${oc.gray[8]};
  padding: 10px;
  user-select: none;
  margin-top: .25rem;
  cursor: pointer;

  &:hover {
    background-color: ${oc.gray[9]};

    .deleteButton {
      display: inherit;
    }
  }

  &:active {
    background-color: ${oc.gray[7]};
  }

  ${props => props.selected && css`
    background-color: ${oc.gray[9]};
  `};

  .roomInfo {
    overflow: hidden;
    width: calc(80%);
    white-space: nowrap;
    text-overflow: ellipsis;
    flex-direction: column;
    margin-left: 10px;
    display: flex;
    margin: 0 5px 0 5px;

  }

  .deleteButton {
    display: none;
    color: ${oc.gray[6]};
    font-size: 24px;

    &:hover {
      color: ${oc.gray[3]}
    }
  }

`;

interface ChatRoomProps extends HTMLAttributes<HTMLDivElement> {
    chatRoom: IChatRoom
    selected: boolean
}

const defaultProfile = 'http://localhost:5000/images/defaultAvatar.png';

const ChatRoom: React.FC<ChatRoomProps> = ({chatRoom, selected, ...rest}) => {
    const navigate = useNavigate();
    const auth = Auth.getAuth();
    const chatRoomDB = ChatRoomDB.getChatRoomDB();
    const {turnOn: turnChatRoomMenuOn} = useChatRoomMenuPopUpState();
    const {turnOn: turnUserMenuOn} = useUserMenuPopUpState()
    const opponent = chatRoom.type !== 'group' ? chatRoom.users?.filter(user => user._id !== auth.user?._id)[0] : undefined;


    return (
        <StyledChatRoom
            selected={selected}
            onContextMenu={e => {
                opponent ?
                    turnUserMenuOn([e.clientX, e.clientY], opponent)
                    :
                    turnChatRoomMenuOn([e.clientX, e.clientY], chatRoom);
            }}
            {...rest}>
            <Avatar size='sm'
                    imageUrl={opponent ? opponent.profileImage : defaultProfile}/>
            <div className='roomInfo'>
                <b>{opponent ? opponent.username : chatRoom.name}</b>
                {chatRoom.recentMessage?.message.attachmentUrl ? getFileInfo(chatRoom.recentMessage?.message.attachmentUrl).name : chatRoom.recentMessage?.message.messageText}
            </div>
            <AiOutlineClose className='deleteButton' onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (chatRoom.type === 'group' && chatRoom.chatInitiator === auth.user?._id) {
                    chatRoomDB.deleteRoom(chatRoom._id);
                } else {
                    chatRoomDB.exitRoom(chatRoom._id);
                }
                if (selected) {
                    navigate('/chatrooms');
                }
            }}/>
        </StyledChatRoom>
    )
}

export default ChatRoom