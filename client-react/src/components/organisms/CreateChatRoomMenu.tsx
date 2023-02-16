import {css} from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import React, {HTMLAttributes, useEffect, useMemo, useRef, useState} from 'react';
import ChatRoomDB from '../../utils/ChatRoomDB';
import {useClickOutside} from '../../utils/Hooks';
import Button from '../atoms/Button';
import Header from '../atoms/Header';
import {useCreateRoomPopUpState} from "../../recoil/CreateRoomPopUp";
import SearchInput from "../atoms/SearchInput";
import {useFriendState} from "../../recoil/Friend";
import {IUser} from "../../pages/api/schema";
import Auth from "../../utils/Auth";
import {BsCheck} from "react-icons/bs";
import Avatar from "../atoms/Avatar";
import Badge from "../atoms/Badge";

const StyledCreateChatRoomMenu = styled.div<{ enabled: boolean, position: [number, number] }>`
  filter: drop-shadow(0px 0px 5px #000);
  z-index: 10;
  position: absolute;
  left: ${props => props.position[0] + 'px'};
  top: ${props => props.position[1] + 'px'};
  display: flex;
  flex-direction: column;
  color: ${oc.gray[4]};
  background-color: ${oc.gray[7]};
  padding: 1rem 1rem;
  border-radius: 12px;
  transition-property: opacity, transform;
  transition-duration: .2s;
  gap: 0.5rem;
  width: 300px;

  button {

    svg {
      font-size: 1.5rem;
    }
  }

  .searchInput {
    margin: 0;
    width: 100%;
  }

  .selectedUsers {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    width: calc(100%);
  }

  .filteredFriends {
    max-height: 400px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    & > button {
      width: 100%;
      height: 40px;
      min-height: 40px;
    }

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
      background-color: ${oc.gray[8]};
    }
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

export interface CreateChatRoomMenuProps extends HTMLAttributes<HTMLDivElement> {

}

const MAX_SELECTED_USERS = 9;

const CreateChatRoomMenu: React.FC<CreateChatRoomMenuProps> = ({...rest}) => {

    const ref = useRef<HTMLDivElement>(null);
    const chatRoomDB = ChatRoomDB.getChatRoomDB();
    const auth = Auth.getAuth();
    const {enabled, turnOn, turnOff, position} = useCreateRoomPopUpState();
    const {friends, setFriends, setFriendsViaUser} = useFriendState();
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const [filterInput, setFilterInput] = useState<string>('');

    const filteredFriends = useMemo<IUser[]>(() => {
        if (!friends) return [];
        if (!filterInput) return friends;
        return friends.filter(friend => friend.username.includes(filterInput)).sort((a, b) => {
            if (a.username < b.username) return -1;
            if (b.username > b.username) return 1;
            return 0;
        });
    }, [friends, filterInput]) || [];

    useClickOutside(ref, () => {
        if (!enabled) return;
        turnOff();
    });

    useEffect(() => {

        if (auth.user) {
            setFriendsViaUser(auth.user);
        } else {
            (async () => {
                setFriendsViaUser(await auth.getUser())
            })
        }
    }, [auth.user])

    useEffect(() => {
        if (!enabled) return;
        setSelectedUsers([]);
    }, [enabled])

    return (
        <StyledCreateChatRoomMenu
            position={position}
            enabled={enabled}
            ref={ref}
            {...rest}>
            <Header color={oc.gray[3]} size='xs'>Select Friends</Header>
            You can add {MAX_SELECTED_USERS - selectedUsers.length} more friends.
            <SearchInput bgcolor={oc.gray[8]} color={oc.gray[3]} size={'md'} onChange={(e) => {
                setFilterInput(e.target.value)
            }} value={filterInput} placeholder='Search' setValue={setFilterInput}/>
            <div className={'selectedUsers'}>
                {
                    selectedUsers?.map(user => {
                        return (
                            <Badge value={user.username} key={user._id} onDelete={() => {
                                setSelectedUsers(selectedUsers.filter(u => u._id !== user._id))
                            }
                            }/>
                        )
                    })
                }
            </div>
            <div className={'filteredFriends'}>
                {
                    filteredFriends.map &&
                    filteredFriends?.map(friend => {
                        return (
                            <Button
                                key={friend._id}
                                size='sm'
                                colorScheme={'gray'}
                                highlightOffset={3}
                                color={oc.white}
                                onClick={() => {
                                    if (selectedUsers.find(user => user._id === friend._id)) {
                                        if (selectedUsers.length < MAX_SELECTED_USERS) {
                                            setSelectedUsers(selectedUsers.filter(user => user._id !== friend._id));
                                        }
                                    } else {
                                        setSelectedUsers([...selectedUsers, friend]);
                                    }
                                }}
                            >
                                <Avatar imageUrl={friend.profileImage} size={'xs'}/>&nbsp;{friend.username}{selectedUsers.find(user => user._id === friend._id) ? <BsCheck color={oc.teal[5]}/> : ''}
                            </Button>
                        )
                    })
                }
            </div>

            <Button colorScheme={'teal'} color={oc.white} highlightOffset={1} onClick={() => {
                chatRoomDB?.createNewRoom(selectedUsers.map(user => user._id), 'group');
            }}>Create Chat Room</Button>
        </StyledCreateChatRoomMenu>
    )
}

export default CreateChatRoomMenu