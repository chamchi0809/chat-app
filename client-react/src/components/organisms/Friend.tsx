import styled from '@emotion/styled';
import oc from 'open-color';
import {HTMLAttributes, useMemo} from 'react';
import {AiFillMessage} from 'react-icons/ai';
import {BsThreeDots} from 'react-icons/bs';

import {IUser} from '../../pages/api/schema';
import ChatRoomDB from '../../utils/ChatRoomDB';
import {useUserMenuPopUpState} from "../../recoil/PopUps/UserMenuPopUp";
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import {useNavigate} from "react-router-dom";

const StyledFriend = styled.div`

  position: relative;
  box-sizing: border-box;
  color: ${oc.gray[4]};
  width: 100%;
  height: 60px;
  display: flex;
  min-width: 0;
  justify-content: space-between;
  align-items: center;
  background-color: ${oc.gray[7]};
  padding: 10px;
  user-select: none;
  border-top: 1px solid ${oc.gray[6]};
  cursor: pointer;

  &:first-of-type {
    margin-top: 30px;
  }

  &:hover + & {
    border-top: 1px solid transparent;
  }

  &:hover {
    border-top: 1px solid transparent;
    border-radius: 0.5rem;
    background-color: ${oc.gray[8]};

    .deleteButton {
      display: inherit;
    }
  }

  &:active {
    background-color: ${oc.gray[8]};
  }

  & > .leftSection {
    display: flex;
    align-items: center;

    .userInfo {
      overflow: hidden;
      margin-left: 10px;
      width: calc(80%);
      display: flex;
      flex-direction: column;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
      margin: 0 5px 0 5px;
    }
  }

  & > .rightSection {
    button {
      padding: 10px;
      font-size: x-large;
      margin-left: 10px;
    }
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

interface FriendProps extends HTMLAttributes<HTMLDivElement> {
    user: IUser
}

const Friend: React.FC<FriendProps> = ({user, ...rest}) => {

    const {turnOn: turnUserMenuOn} = useUserMenuPopUpState();
    const chatRoomDB = ChatRoomDB.getChatRoomDB();
    const navigate = useNavigate();
    const createDM = async () => {
        const result = await chatRoomDB.createNewRoom([user._id], 'dm');
        if (result) {
            const {id} = result;
            navigate(`/chatrooms/${id}`);
        }
    }

    const userStatus = useMemo(() => {
        switch (user.status) {
            case 'online':
                return 'Online'
            case 'idle':
                return 'Idle'
            case 'donotdisturb':
                return 'Do Not Disturb'
            case 'offline':
                return 'Offline'
        }
    }, [user])


    return (
        <StyledFriend
            onClick={e => {
                createDM()
            }}
            onContextMenu={e => {
                e.preventDefault();
                turnUserMenuOn([e.clientX, e.clientY], user);
            }}
            {...rest}>
            <div className="leftSection">
                <Avatar size='sm' imageUrl={user.profileImage}/>
                <div className='userInfo'>
                    <b>{user.username}</b><br/>
                    {userStatus}
                </div>
            </div>
            <div className="rightSection">
                <Button colorScheme={'gray'} highlightOffset={2} onClick={createDM}><AiFillMessage
                    color={oc.white}/></Button>
                <Button colorScheme={'gray'} highlightOffset={2} onClick={(e) => {
                    e.stopPropagation();
                    turnUserMenuOn([e.clientX, e.clientY], user)
                }}>
                    <BsThreeDots color={oc.white}/>
                </Button>
            </div>
        </StyledFriend>
    )
}

export default Friend