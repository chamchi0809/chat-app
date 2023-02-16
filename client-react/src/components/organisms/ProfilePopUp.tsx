import {css} from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import {HTMLAttributes, useEffect, useRef, useState} from 'react';
import {useProfilePopUpState} from "../../recoil/PopUps/ProfilePopUp";
import {useUserMenuPopUpState} from "../../recoil/PopUps/UserMenuPopUp";
import Avatar from '../atoms/Avatar';
import moment from 'moment';
import TabBar from '../molecules/TabBar';
import TabBarItem from '../atoms/TabBarItem';
import {IUser} from '../../pages/api/schema';
import UserDB from '../../utils/UserDB';
import UserProfile from '../molecules/UserProfile';
import Button from '../atoms/Button';
import ChatRoomDB from '../../utils/ChatRoomDB';
import {BsThreeDotsVertical} from 'react-icons/bs';
import Auth from '../../utils/Auth';
import {useNavigate} from "react-router-dom";

type profileTabType = 'User Info' | 'Mutual Friends';

const StyledProfilePopUp = styled.div<{ idx: number, enabled: boolean }>`

  z-index: ${props => props.idx * 2 + 10};
  position: absolute;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: ${oc.gray[2]};
  transition-property: opacity;
  transition-duration: .2s;
  width: 100vw;
  height: 100vh;

  ${props => props.enabled ?
          css`
            opacity: 100%;
            pointer-events: all;

            & > .modal {
              transform: scale(100%);
            }
          ` :
          css`
            opacity: 0%;
            pointer-events: all;

            & > .modal {
              transform: scale(10%);
            }
          `
  }
  .modal {
    display: flex;
    width: 600px;
    flex-direction: column;
    padding: 1rem 1rem;
    border-radius: 12px;
    background-color: ${oc.gray[8]};
    transition-property: transform;
    transition-duration: 0.2s;

    .upperSection {
      display: flex;
      justify-content: space-between;
      align-content: flex-end;
      align-items: flex-end;

      .buttons {
        display: flex;
        align-content: center;
        align-items: center;
        gap: 20px;

        svg {
          color: ${oc.gray[5]};

          &:hover {
            color: ${oc.white};
          }

          &:active {
            color: ${oc.white};
          }
        }
      }

      min-height: 168px;
    }

    .innerSection {
      display: flex;
      flex-direction: column;
      padding: 1rem 1rem;
      margin-top: 1rem;
      border-radius: 12px;
      background-color: ${oc.gray[7]};

      .infoScroller {
        display: flex;
        flex-direction: column;
        min-height: 287px;
        height: 287px;
        user-select: none;
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

        b {
          margin-bottom: 0.3rem;
        }
      }
    }
  }

`;

interface ProfilePopUpProps extends HTMLAttributes<HTMLDivElement> {
    idx: number
    enabled: boolean
    user: IUser
}


const ProfilePopUp: React.FC<ProfilePopUpProps> = ({idx, user, enabled, ...rest}) => {

    const navigate = useNavigate();
    const auth = Auth.getAuth();
    const userDB = UserDB.getUserDB();
    const chatRoomDB = ChatRoomDB.getChatRoomDB();
    const isMine = auth.user?._id === user?._id;
    const {turnOff, clear} = useProfilePopUpState();
    const {turnOn: turnUserMenuOn} = useUserMenuPopUpState();
    const ref = useRef<HTMLDivElement>(null);
    const [selectedTab, setSelectedTab] = useState<profileTabType>('User Info');

    const [mutualFriends, setMutualFriends] = useState<IUser[]>([]);
    const createDM = async () => {
        const result = await chatRoomDB.createNewRoom([user._id], 'dm');
        if (result) {
            const {id} = result;
            navigate(`/chatrooms/${id}`);
            clear();
        }
    }

    useEffect(() => {
        setSelectedTab('User Info');
        if (user) {
            (async () => {
                setMutualFriends((await userDB.getMutualFriends(user._id)) || [])
            })()
        }
    }, [user])

    return (
        <StyledProfilePopUp
            idx={idx}
            enabled={enabled}
            onClick={(e) => {
                if (e.target === e.currentTarget) turnOff();
            }}
            {...rest}>
            <div className="modal" ref={ref}>
                {
                    user &&
                    <>
                        <div className="upperSection">
                            <Avatar imageUrl={user.profileImage} size='xxl'/>
                            {
                                isMine ||
                                <div className="buttons">
                                    <Button color={oc.white} colorScheme={'teal'} highlightOffset={2}
                                            onClick={createDM}>Send Message</Button>
                                    <BsThreeDotsVertical fontSize='larger'
                                                         onClick={(e) => turnUserMenuOn([e.clientX, e.clientY], user, idx * 2 + 10)}/>
                                </div>
                            }
                        </div>

                        <div className="innerSection">
                            <b>{user.username}</b>
                            <TabBar>
                                <TabBarItem selected={selectedTab === 'User Info'} onClick={() => {
                                    setSelectedTab('User Info')
                                }}>User Info</TabBarItem>
                                {
                                    isMine ||
                                    <TabBarItem selected={selectedTab === 'Mutual Friends'} onClick={() => {
                                        setSelectedTab('Mutual Friends')
                                    }}>Mutual Friends</TabBarItem>
                                }
                            </TabBar>
                            <div className="infoScroller">
                                {
                                    {
                                        'User Info':
                                            <>
                                                {
                                                    user.description !== '' &&
                                                    <>
                                                        <b>ABOUT ME</b>
                                                        {user.description}
                                                    </>
                                                }
                                                <b>MEMBER SINCE</b>
                                                {moment(user.createdAt).format('MM DD, YYYY')}
                                            </>
                                        ,
                                        'Mutual Friends':
                                            <>
                                                {
                                                    mutualFriends?.map((friend, i) => <UserProfile user={friend}
                                                                                                   currentIdx={idx * 2 + 10}
                                                                                                   key={i}/>)
                                                }
                                            </>

                                    }[selectedTab]
                                }

                            </div>
                        </div>
                    </>
                }
            </div>

        </StyledProfilePopUp>
    )
}

export default ProfilePopUp