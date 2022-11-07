import { css } from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import { HTMLAttributes, useRef, useState, useEffect } from 'react';
import { useClickOutside } from '../../utils/Hooks';
import { useImagePopUpStore, useProfilePopUpStore, useUserMenuPopUpStore } from '../../zustand/PopUp';
import Avatar from '../atoms/Avatar';
import moment from 'moment';
import TabBar from './TabBar';
import TabBarItem from '../atoms/TabBarItem';
import { IUser } from '../../pages/api/schema';
import UserDB from '../../utils/UserDB';
import UserProfile from './UserProfile';
import Button from '../atoms/Button';
import { useRouter } from 'next/router';
import ChatRoomDB from '../../utils/ChatRoomDB';
import { AiFillMessage } from 'react-icons/ai';
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import Auth from '../../utils/Auth';

const StyledImagePopUp = styled.div<{enabled:boolean}>`

  z-index: 10;
  position: absolute;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.7);
  color: ${oc.gray[2]};
  transition-property: opacity;
  transition-duration: .2s;
  width: 100vw;
  height: 100vh;

  ${props=>props.enabled ? 
    css`
      opacity: 100%;
      pointer-events: all;
      &>.modal{
        transform: scale(100%);
      }
    `:
    css`
      opacity: 0%;
      pointer-events: none;
      &>.modal{
        transform: scale(10%);
      }
    `
  }

  .modal{
    display: flex;
    transition-property:transform;
    transition-duration:0.2s;
    img{
      max-height:70vh;
      object-fit:contain;
    }
  }

`;

interface ImagePopUpProps extends HTMLAttributes<HTMLDivElement>{

}



const ImagePopUp:React.FC<ImagePopUpProps> = ({...rest})=>{

  const {enabled, turnOff, turnOn, imageUrl} = useImagePopUpStore();

  return (
    <StyledImagePopUp
      enabled={enabled}
      onClick={(e)=>{
        if(e.target === e.currentTarget) turnOff();
      }}
      {...rest}>
      <div className="modal">
      {
        imageUrl &&
        <img src={imageUrl} alt=""/>
      }
      </div>
      
    </StyledImagePopUp>
  )
}

export default ImagePopUp