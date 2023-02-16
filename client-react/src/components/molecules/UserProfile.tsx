import styled from '@emotion/styled';
import oc from 'open-color';
import {HTMLAttributes, useMemo} from 'react';
import {IUser} from '../../pages/api/schema';
import {useUserMenuPopUpState} from "../../recoil/PopUps/UserMenuPopUp";
import {useProfilePopUpState} from "../../recoil/PopUps/ProfilePopUp";
import Avatar from '../atoms/Avatar';

const StyledUserProfile = styled.div`

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
  cursor: pointer;

  &:hover {
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

`;

interface UserProfileProps extends HTMLAttributes<HTMLDivElement> {
    user: IUser
    currentIdx: number
}

const UserProfile: React.FC<UserProfileProps> = ({user, currentIdx, ...rest}) => {

    const {turnOn: turnProfilePopUpOn} = useProfilePopUpState();
    const {turnOn: turnFriendMenuOn} = useUserMenuPopUpState();

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
        <StyledUserProfile
            onClick={e => {
                turnProfilePopUpOn(user);
            }}
            onContextMenu={e => {
                e.preventDefault();
                turnFriendMenuOn([e.clientX, e.clientY], user, currentIdx);
            }}
            {...rest}>
            <div className="leftSection">
                <Avatar size='sm' imageUrl={user.profileImage}/>
                <div className='userInfo'>
                    <b>{user.username}</b><br/>
                    {userStatus}
                </div>
            </div>
        </StyledUserProfile>
    )
}

export default UserProfile