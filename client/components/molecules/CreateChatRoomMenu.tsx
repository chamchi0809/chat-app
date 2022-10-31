import { css } from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import { Dispatch, HTMLAttributes, SetStateAction, useEffect, useState, useRef } from 'react';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { IChatMessage, IChatRoom, IUser } from '../../pages/api/schema';
import { useClickOutside } from '../../utils/Hooks';
import { SocketClient } from '../../utils/SocketClient';

import Button from '../atoms/Button';
import Header from '../atoms/Header';
import { useCreateRoomPopUpStore } from '../../zustand/PopUp';

const StyledCreateChatRoomMenu = styled.div<{enabled:boolean, position:[number,number]}>`

  z-index: 10;
  position: absolute;
  left: ${props=>props.position[0]+'px'};
  top:${props=>props.position[1]+'px'};
  display: flex;
  flex-direction: column;
  background-color: ${oc.gray[7]};
  padding: 1rem 1rem;
  border: 1px solid ${oc.gray[8]};
  border-radius: 12px;
  transition-property: opacity, transform;
  transition-duration: .2s;
  
  button{
    margin-top: 1rem;
    align-self: flex-end;
  }
  ${props=>
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

export interface CreateChatRoomMenuProps extends HTMLAttributes<HTMLDivElement>{

}

const CreateChatRoomMenu:React.FC<CreateChatRoomMenuProps> = ({ ...rest})=>{
  const ref = useRef<HTMLDivElement>(null);
  const chatRoomDB = ChatRoomDB.getChatRoomDB();
  const [userIds,setUserIds] = useState<string[]>([]);
  const {enabled, turnOn, turnOff, position} = useCreateRoomPopUpStore();

  useClickOutside(ref, ()=>{
    if(!enabled)return;
    turnOff();
  });

  return (
    <StyledCreateChatRoomMenu
      position={position}
      enabled={enabled}
      ref={ref}
      {...rest}>
      <Header color={oc.gray[3]} size='sm'>Select Users</Header>
      <Button colorScheme={'cyan'} onClick={()=>{
        chatRoomDB?.createNewRoom(userIds, 'group');
      }}>Create ChatRoom</Button>
    </StyledCreateChatRoomMenu>
  )
}

export default CreateChatRoomMenu